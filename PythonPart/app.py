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
import datetime

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
            imageFile="-",
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


# server function for charity registration
@app.route("/charityRegistration", methods=["POST"])
def charityRegistration():
    try:
        content = request.json
        print(content)
        charity = Charity(
            name=content["userName"],
            email=content["userEmail"],
            password=content["userPassword"],
            phoneNum=content["userPhone"],
            address=content["userAddress"],
            imageData=content["imageData"],
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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
