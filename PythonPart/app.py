from flask import Flask, request, jsonify, make_response
from flask import copy_current_request_context
import jwt
from functools import wraps
from flask_cors import CORS
from bson import json_util, ObjectId
from customerRepository import *
from customer import *
from datetime import datetime, timezone, timedelta
from bdConnection import *
from charity import *
from charityRepository import *

app = Flask(__name__)
app.config['SECRET_KEY']="thisisthesecretkey"  # change , make more secure 
CORS(app)

customerConnection = CustomerRepository(db)
charityConnection = CharityRepository(db)


# server function for customer registration
@app.route('/customerRegistration', methods=['POST'])
def customerRegistration():
    try:
        content = request.form
        customer = Customer(0, content['name'], content['surname'],  content['dateOfBirth'], content['email'], content['phoneNum'], content['password'], content['imageFile'], content['address'])
        newId = customerConnection.createCustomer(customer)
        if(newId==None):
            return  jsonify({'message':"Customer with that email exists"}), 404
        else:
            return jsonify({'message':"Customer created"}), 200
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({'message':"It is not possible to create a new customer"}), 404
    

# server function for charity registration
@app.route('/charityRegistration', methods=['POST'])
def charityRegistration():
    try:
        content = request.form
        charity = Charity(0, content['name'], content['email'], content['phoneNum'], content['password'], content['imageFile'], content['address'])
        newId = charityConnection.createCharity(charity)
        if(newId==None):
            return  jsonify({'message':"Charity with that email exists"}), 404
        else:
            return jsonify({'message':"Charity created"}), 200
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({'message':"It is not possible to create a new charity"}), 404


# server function for customer sign in
@app.route('/signIn', methods=['POST'])
def signIn():
    try:
        content = request.form
        email = content['email']
        password=content['password']
        existCustomer=customerConnection.customerExistForSignIn(email, password)
        existCharity = charityConnection.charityExistForSignIn(email, password)
        if(existCustomer or existCharity):
            token = jwt.encode(
            {
                'email': email,
                'password': password,
                'exp': datetime.now(timezone.utc) + timedelta(hours=24)
            },
    app.config["SECRET_KEY"]
)
            return jsonify({'token': token}), 200
        else:
            return jsonify({'message': "No such user exists"}), 404
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({'message': "Unable to get token"}), 400


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token =request.headers.get('authorization')

        if not token:
            return "Token is missing", 403
        try:
            data=jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            result = f(*args, **kwargs)
            return result[0], 200
        except:
            return "Token is invalid", 403
        
    return decorated


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8080)