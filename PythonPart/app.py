from flask import Flask, request, jsonify, make_response
from flask import copy_current_request_context
from flask_jwt_extended import (
    JWTManager,
    get_jwt,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    unset_access_cookies,
    get_csrf_token,
    decode_token,
)
from functools import wraps
from flask_cors import CORS
from bson import json_util, ObjectId
from customerRepository import *
from customer import *
from datetime import datetime, timezone, timedelta
from bdConnection import *
from charity import *
from charityRepository import *
from auctionItemRepository import *
from quizRepository import *
from questionRepository import *
from answerRepository import *
from categoryRepository import  *
import datetime
from pprint import pprint

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "thisisthesecretkey"  # change , make more secure
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)  # Set token expiration

app.config["JWT_TOKEN_LOCATION"] = ["cookies"]  # Look for JWT in cookies
app.config["JWT_COOKIE_SECURE"] = True  # Use True in production with HTTPS
app.config["JWT_ACCESS_COOKIE_NAME"] = "jwt"  # Name of the cookie
app.config["JWT_COOKIE_CSRF_PROTECT"] = True
app.config["CSRF_COOKIE_NAME"] = "csrf_access_token"
app.config["JWT_CSRF_IN_COOKIES"] = True  # Ensure CSRF is sent in a cookie
app.config["JWT_CSRF_CHECK_FORM"] = False  # Only check headers for CSRF token
app.config["JWT_COOKIE_SAMESITE"] = "None"  # same-site option for set_access_cookies

jwt = JWTManager(app)
CORS(
    app,
    # origins=["http://localhost:5173"],
    supports_credentials=True,
    resources={r"/*": {"origins": ["http://localhost:5173"]}},
)

customerConnection = CustomerRepository(db)
charityConnection = CharityRepository(db)

quizConnection = QuizRepository(db)
questionConnection = QuestionRepository(db)
answerConnection = AnswerRepository(db)
categoryConnection = CategoryRepository(db)


# server function for customer registration
@app.route("/customerRegistration", methods=["POST"])
def customerRegistration():
    try:
        content = request.json
        customer = Customer(
            name=content["userName"],
            surname=content["userLastName"],
            dateOfBirth=content["userDOB"],
            email=content["userEmail"],
            password=content["userPassword"],
            phoneNum=content["userPhone"],
            address=content["userAddress"],
            image="-",
        )
        newId = customerConnection.createCustomer(customer)
        if newId == None:
            return jsonify({"message": "Customer with that email exists"}), 404
        else:
            response = make_response(jsonify({"message": "Customer created"}), 200)
            return response
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "It is not possible to create a new customer"}), 404


@app.route("/updateCustomerProfile", methods=["POST"])
@jwt_required()
def updateCustomerProfile():
    content = request.json
    status = customerConnection.updateCustomer(
        Customer(
            name=content["customerName"],
            surname=content["customerLastName"],
            dateOfBirth=content["customerDOB"],
            email=content["customerEmail"],
            phoneNum=content["customerPhone"],
            password=content["customerPassword"],
            image=content["customerImage"],
            address=content["customerAddress"],
            _id=content["customerId"],
            hashed_password=True,
        ),
        content["customerId"],
    )
    if status:
        return jsonify({"message": "Customer profile updated"}), 200
    return jsonify({"message": "Failed to updated customer profile"}), 404


@app.route("/updateCustomerPassword", methods=["POST"])
@jwt_required()
def updateCustomerPassword():
    content = request.json
    current_user = get_jwt_identity()
    existCustomer = customerConnection.getCustomerById(current_user["id"])
    customer = existCustomer
    customer["_id"] = str(existCustomer["_id"])
    status = customerConnection.updateCustomer(
        Customer(
            name=customer["name"],
            surname=customer["surname"],
            dateOfBirth=customer["dateOfBirth"],
            email=customer["email"],
            phoneNum=customer["phoneNum"],
            password=content["newPassword"],
            image=customer["image"],
            address=customer["address"],
            _id=customer["_id"],
        ),
        customer["_id"],
    )
    if status:
        return jsonify({"message": "Customer password updated"}), 200
    return jsonify({"message": "Failed to updated customer password"}), 404


# server function for charity registration
@app.route("/charityRegistration", methods=["POST"])
def charityRegistration():
    try:
        content = request.json
        charity = Charity(
            name=content["userName"],
            email=content["userEmail"],
            password=content["userPassword"],
            phoneNum=content["userPhone"],
            address=content["userAddress"],
            image=content["image"],
        )
        newId = charityConnection.createCharity(charity)
        if newId == None:
            return jsonify({"message": "Charity with that email exists"}), 404
        else:
            response = make_response(jsonify({"message": "Charity created"}), 200)
            return response
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "It is not possible to create a new charity"}), 404


@app.route("/updateCharityProfile", methods=["POST"])
@jwt_required()
def updateCharityProfile():
    content = request.json
    status = charityConnection.updateCharity(
        Charity(
            name=content["charityName"],
            email=content["charityEmail"],
            phoneNum=content["charityPhone"],
            password=content["charityPassword"],
            image=content["charityImage"],
            address=content["charityAddress"],
            description=content["charityDescription"],
            _id=content["charityId"],
            hashed_password=True,
        ),
        content["charityId"],
    )
    if status:
        return jsonify({"message": "Charity profile updated"}), 200
    return jsonify({"message": "Failed to updated charity profile"}), 404


@app.route("/updateCharityPassword", methods=["POST"])
@jwt_required()
def updateCharityPassword():
    content = request.json
    current_user = get_jwt_identity()
    existCharity = charityConnection.getCharityById(current_user["id"])
    charity = existCharity
    charity["_id"] = str(existCharity["_id"])
    status = charityConnection.updateCharity(
        Charity(
            name=charity["name"],
            email=charity["email"],
            phoneNum=charity["phoneNum"],
            password=content["newPassword"],
            image=charity["image"],
            address=charity["address"],
            description=charity["description"],
            _id=charity["_id"],
        ),
        charity["_id"],
    )
    if status:
        return jsonify({"message": "Charity password updated"}), 200
    return jsonify({"message": "Failed to updated charity password"}), 404


# server function for customer sign in
@app.route("/signIn", methods=["POST"])
def signIn():
    try:
        content = request.json
        email = content["userEmail"]
        password = content["userPassword"]
        existCustomer = customerConnection.customerExistForSignIn(email, password)
        existCharity = charityConnection.charityExistForSignIn(email, password)
        if existCustomer or existCharity:
            if existCustomer:
                user = customerConnection.getCustomerByEmail(email)
                userType = "customer"
            if existCharity:
                user = charityConnection.getCharityByEmail(email)
                userType = "charity"

            token = create_access_token(
                identity={
                    "id": str(user["_id"]),
                    "userType": userType,
                }
            )

            expiration_time = datetime.datetime.fromtimestamp(
                decode_token(token)["exp"], datetime.UTC
            )
            response = jsonify(
                {
                    "message": "Logged in",
                    "exp": expiration_time,  # Add expiration time
                }
            )
            # to retrieve csrf from jwt
            response.headers["CSRF_TOKEN"] = get_csrf_token(token)
            response.headers["Access-Control-Expose-Headers"] = "CSRF_TOKEN"
            set_access_cookies(response, token)
            return response
        else:
            return jsonify({"message": "No such user exists"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Unable to get token"}), 400


@app.route("/signOut", methods=["POST"])
@jwt_required()
def signOut():
    response = make_response(jsonify({"msg": "Logged out successfully"}))
    unset_access_cookies(response)
    return response


@app.route("/getUserInfo", methods=["GET"])
@jwt_required()
def getUserInfo():
    current_user = get_jwt_identity()

    expiration_time = datetime.datetime.fromtimestamp(get_jwt()["exp"], datetime.UTC)

    if current_user["userType"] == "customer":
        existCustomer = customerConnection.getCustomerById(current_user["id"])
        username = existCustomer["name"]

    if current_user["userType"] == "charity":
        existCharity = charityConnection.getCharityById(current_user["id"])
        username = existCharity["name"]

    response = jsonify(
        {
            "username": username,
            "userType": current_user["userType"],
            "exp": expiration_time,
        }
    )
    response.headers["CSRF_TOKEN"] = get_jwt()["csrf"]
    response.headers["Access-Control-Expose-Headers"] = "CSRF_TOKEN"

    return response


@app.route("/getUserData", methods=["GET"])
@jwt_required()
def getUserData():
    current_user = get_jwt_identity()

    if current_user["userType"] == "customer":
        existCustomer = customerConnection.getCustomerById(current_user["id"])
        response = existCustomer
        response["_id"] = str(existCustomer["_id"])

    if current_user["userType"] == "charity":
        existCharity = charityConnection.getCharityById(current_user["id"])
        response = existCharity
        response["_id"] = str(existCharity["_id"])

    response["userType"] = current_user["userType"]

    return jsonify(response)


@app.route("/getCharitiesList", methods=["GET"])
def getCharitiesList():
    return charityConnection.getListOfCharities()


@app.route("/getQuiz", methods=["GET"])
def getQuiz():
    response = []
    quiz = quizConnection.getQuizById("67be43ebe8bfbd867e188cfa")
    questions = questionConnection.getListOfQuizQuestions(quizId=str(quiz["_id"]))
    # print(quiz)
    for question in questions:
        # print(question)
        questionJson = {"question": question["text"]}
        questionAnswers = answerConnection.getListOfQuestionAnswers(
            questionId=str(question["_id"])
        )
        questionJson["answers"] = []
        for answer in questionAnswers:
            # print(answer)
            questionJson["answers"].append(
                {"text": answer["text"], "correct": answer["correct"]}
            )
        response.append(questionJson)
    return response


# Initialize the AuctionItemRepository
auctionItemConnection = AuctionItemRepository(db)


# Get Auction Items
@app.route("/getAuctionItems", methods=["GET"])
def getAuctionItems():
    try:
        auction_items = auctionItemConnection.getListOfAuctionItems()
        return jsonify(auction_items), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Unable to fetch auction items"}), 500


# Create Auction Item
@app.route("/createAuctionItem", methods=["POST"])
def createAuctionItem():
    try:
        content = request.json
        auctionItem = AuctionItem(
            title=content["title"],
            description=content["description"],
            startingPrice=content["startingPrice"],
            currentPrice=content["startingPrice"],
            image=content["image"],
            auctionStartDate=content["auctionStartDate"],
            auctionEndDate=content["auctionEndDate"],
            categoryId=content["categoryId"],
            charityId=content["charityId"],
            status="active",
        )
        newId = auctionItemConnection.createAuctionItem(auctionItem)
        if newId == None:
            return jsonify({"message": "Auction item with that title exists"}), 404
        else:
            response = make_response(jsonify({"message": "Auction item created"}), 200)
            return response
    except Exception as e:
        print(f"Error: {e}")
        return (
            jsonify({"message": "It is not possible to create a new auction item"}),
            404,
        )


# Get Auction items by CharityId
# This function will allow user to see their own listings to manage them
@app.route("/getCharityAuctionItems", methods=["GET"])
@jwt_required()
def getCharityAuctionItems():
    try:
        current_user = get_jwt_identity()
        if current_user["userType"] != "charity":
            return (
                jsonify(
                    {
                        "message": "Access forbidden: Only charity users can access this route"
                    }
                ),
                403,
            )

        charity_id = current_user["id"]
        auction_items = auctionItemConnection.getAuctionItemsByCharityId(charity_id)
        return jsonify(auction_items), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Unable to fetch auction items"}), 500   
    

# server function for getting a dictionary of all categories
@app.route('/getCategories', methods=['GET'])
def getCategories():
    try:
        categoriesNames = categoryConnection.getListOfCategories()
        return jsonify({'categories': categoriesNames}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching categories'}), 500
    
# server function for getting a dictionary of searched auction items
@app.route('/getSearchedAuctionItems', methods=['POST'])
def getSearchedAuctionItems():
    try:
        auctionItems = auctionItemConnection.getListOfAuctionItems()
        print(auctionItems)
        list_auctionItems = []
        for auctionItem in auctionItems:
            print(str(auctionItem["categoryId"]))
            print(str(charityConnection.getCharityById(auctionItem["charityId"])["name"]) )
            auctionItem_dict = {
                "_id": str(auctionItem["_id"]),  
                "title":auctionItem["title"],
                "description": auctionItem["description"],
                "startingPrice":auctionItem["startingPrice"],
                "currentPrice" : auctionItem["currentPrice"],
                "image" : auctionItem["image"],
                "auctionStartDate": auctionItem["auctionStartDate"],
                "auctionEndDate" : auctionItem["auctionEndDate"],
                "categoryId" : str(categoryConnection.getCategoryById(auctionItem["categoryId"])["categoryName"]), 
                "charityId" : str(charityConnection.getCharityById(auctionItem["charityId"])["name"]), 
                "status" : auctionItem["status"],
            }
            list_auctionItems.append(auctionItem_dict)
        return jsonify({'auctionItems': list_auctionItems}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error fetching auction items'}), 500
    

    



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
