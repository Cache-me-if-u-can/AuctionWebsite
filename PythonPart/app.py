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
from categoryRepository import *
from quizRepository import *
from questionRepository import *
from answerRepository import *
from categoryRepository import *
from bidRepository import *
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
categoryConnection = CategoryRepository(db)

quizConnection = QuizRepository(db)
questionConnection = QuestionRepository(db)
answerConnection = AnswerRepository(db)
bidConnection = BidRepository(db)


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

            expiration_time = datetime.fromtimestamp(
                decode_token(token)["exp"], timezone.utc
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

    expiration_time = datetime.fromtimestamp(get_jwt()["exp"], timezone.utc)

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

        # Convert category IDs to category names
        for item in auction_items:
            item["categoryId"] = categoryConnection.getCategoryById(item["categoryId"])[
                "categoryName"
            ]

        return jsonify(auction_items), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Unable to fetch auction items"}), 500


# server function for getting a dictionary of all categories
@app.route("/getCategories", methods=["GET"])
def getCategories():
    try:
        categoriesNames = categoryConnection.getListOfCategories()
        return jsonify({"categories": categoriesNames}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Error fetching categories"}), 500


# server function for getting a dictionary of searched auction items
@app.route("/getSearchedAuctionItems", methods=["POST"])
def getSearchedAuctionItems():
    try:
        data = request.json
        category = data.get("category", "all")
        conditions = data.get("conditions", [])
        charity = data.get("charity", "all")

        auction_items = auctionItemConnection.getListOfAuctionItems()

        if category != "all":
            auction_items = [
                item
                for item in auction_items
                if item["categoryId"]
                == str(categoryConnection.getCategoryByName(category)["_id"])
            ]

        if conditions:
            auction_items = [
                item for item in auction_items if item["status"] in conditions
            ]

        if charity != "all":
            auction_items = [
                item
                for item in auction_items
                if item["charityId"]
                == str(charityConnection.getCharityByName(charity)["_id"])
            ]
        print(auction_items)
        for item in auction_items:
            item["charityId"] = charityConnection.getCharityById(item["charityId"])[
                "name"
            ]
            item["categoryId"] = categoryConnection.getCategoryById(item["categoryId"])[
                "categoryName"
            ]
        return jsonify(auction_items), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Error fetching auction items"}), 500


##Update Auction Item
@app.route("/updateAuctionItem", methods=["POST"])
@jwt_required()
def updateAuctionItem():
    try:
        content = request.json
        if not content or "_id" not in content:
            return jsonify({"message": "No data or ID provided"}), 400

        # Get the current user from JWT
        current_user = get_jwt_identity()

        if not current_user or "id" not in current_user:
            return jsonify({"message": "Invalid authentication token"}), 401

        # Convert string ID to ObjectId for MongoDB
        try:
            item_id = ObjectId(content["_id"])
        except:
            return jsonify({"message": "Invalid item ID format"}), 400

        # Verify the item exists and belongs to this charity
        if not auctionItemConnection.auctionItemExistsByCharityId(
            str(item_id), current_user["id"]
        ):
            return (
                jsonify(
                    {
                        "message": "Access forbidden - item not found or you don't own this item"
                    }
                ),
                403,
            )

        # Create AuctionItem object
        auction_item = AuctionItem(
            title=content["title"],
            description=content["description"],
            startingPrice=float(content["startingPrice"]),
            currentPrice=float(content["currentPrice"]),
            image=content["image"],
            auctionStartDate=content["auctionStartDate"],
            auctionEndDate=content["auctionEndDate"],
            categoryId=content["categoryId"],
            charityId=current_user["id"],
            status=content["status"],
            _id=str(item_id),
        )

        # Update the item
        success = auctionItemConnection.updateAuctionItem(auction_item, str(item_id))

        if success:
            return jsonify({"message": "Auction item updated successfully"}), 200
        else:
            return jsonify({"message": "Auction item not found"}), 404

    except Exception as e:
        print(f"Error in updateAuctionItem: {e}")
        return (
            jsonify({"message": "Unable to update auction item", "error": str(e)}),
            500,
        )


# Update price after a bid
@app.route("/updateAuctionPrice", methods=["POST"])
@jwt_required()
def update_auction_price():
    try:
        content = request.json
        if not content or "auctionItemId" not in content or "newPrice" not in content:
            return jsonify({"message": "Missing required data"}), 400

        auction_item_id = content["auctionItemId"]
        new_price = float(content["newPrice"])

        # Get the item to check current price
        auction_item = auctionItemConnection.getAuctionItemById(auction_item_id)
        if not auction_item:
            return jsonify({"message": "Auction item not found"}), 404

        # Ensure new price is higher
        if new_price <= auction_item["currentPrice"]:
            return (
                jsonify({"message": "New price must be higher than current price"}),
                400,
            )

        # Update only the price
        success = auctionItemConnection.updateAuctionPrice(auction_item_id, new_price)

        if success:
            return jsonify({"message": "Price updated successfully"}), 200
        else:
            return jsonify({"message": "Failed to update price"}), 500

    except Exception as e:
        print(f"Error in updateAuctionPrice: {e}")
        return jsonify({"message": "Unable to update price", "error": str(e)}), 500


##Delete Auction Item
@app.route("/deleteAuctionItem", methods=["POST"])
def deleteAuctionItemByID():
    try:
        content = request.json
        status = auctionItemConnection.deleteAuctionItemByID(content["_id"])
        if status:
            return jsonify({"message": "Auction item deleted"}), 200
        return jsonify({"message": "Failed to delete auction item"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return (
            jsonify({"message": "It is not possible to delete the auction item"}),
            404,
        )


# Add new endpoint for category dropdown
@app.route("/getCategoryDropdownData", methods=["GET"])
def getCategoryDropdownData():
    try:
        categories = categoryConnection.getCategories()
        print("Categories fetched:", categories)  # Add logging
        formatted_categories = [
            {"_id": str(cat["_id"]), "categoryName": cat["categoryName"]}
            for cat in categories
        ]
        print("Formatted categories:", formatted_categories)  # Add logging
        return jsonify({"categories": formatted_categories}), 200
    except Exception as e:
        print(f"Error in getCategoryDropdownData: {e}")
        return jsonify({"message": "Error fetching categories"}), 500


# server function for adding new bid
@app.route("/createBid", methods=["POST"])
@jwt_required()
def create_bid():
    try:
        content = request.json
        if not content:
            return jsonify({"message": "No data provided"}), 400

        # Get the current user from JWT
        current_user = get_jwt_identity()

        if not current_user or "id" not in current_user:
            return jsonify({"message": "Invalid authentication token"}), 401

        # Create bid object with all required parameters including bidDate
        bid = Bid(
            auctionId=content[
                "auctionItemId"
            ],  # Use auctionId instead of auctionItemId
            bidAmount=float(content["bidAmount"]),
            customerId=content["customerId"],
            isAnonymous=content["isAnonymous"],
            bidDate=datetime.now(timezone.utc),  # Add the current UTC date/time
        )

        # Validate bid amount against current price
        auction_item = auctionItemConnection.getAuctionItemById(
            content["auctionItemId"]
        )
        if not auction_item:
            return jsonify({"message": "Auction item not found"}), 404

        if bid.bidAmount <= auction_item["currentPrice"]:
            return (
                jsonify({"message": "Bid amount must be higher than current price"}),
                400,
            )

        # Create the bid with the required connections
        result = bidConnection.createBid(bid, customerConnection, auctionItemConnection)

        # If bid was created successfully, update the auction item's current price
        if result:
            # Update the auction item's current price
            # Use content["auctionItemId"] here since that's the name used in the request
            update_result = auctionItemConnection.update_auction_price(
                content["auctionItemId"], bid.bidAmount
            )

            if update_result:
                return (
                    jsonify({"message": "Bid placed successfully and price updated"}),
                    201,
                )
            else:
                # Bid was created but price wasn't updated
                return (
                    jsonify(
                        {"message": "Bid placed successfully but price update failed"}
                    ),
                    201,
                )
        else:
            return jsonify({"message": "Failed to create bid"}), 500

    except Exception as e:
        print(f"Error in createBid: {e}")
        return jsonify({"message": "Unable to create bid", "error": str(e)}), 500


# server function for getting top 3 bids for an auction item
@app.route("/getTopBids/<auctionId>", methods=["GET"])
def getTopBids(auctionId):
    top_bids = bidConnection.getTopThreeBids(auctionId, customerConnection)
    if not top_bids:
        return jsonify({"message": "No bids found for this auction item."}), 200
    return jsonify(top_bids), 200


# Get Auction Item by ID
@app.route("/getAuctionItem/<string:auctionItem_id>", methods=["GET"])
def getAuctionItem(auctionItem_id):
    try:
        auction_item = auctionItemConnection.getAuctionItemById(auctionItem_id)
        if not auction_item:
            return jsonify({"message": "Auction item not found"}), 404

        # Add charityName and categoryName to the auction item
        auction_item["charityName"] = charityConnection.getCharityById(auction_item["charityId"])["name"]
        auction_item["categoryName"] = categoryConnection.getCategoryById(auction_item["categoryId"])["categoryName"]
        return jsonify(auction_item), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Unable to fetch auction item"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
