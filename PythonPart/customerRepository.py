from customer import *
from bson.objectid import ObjectId
import hashlib
import base64


class CustomerRepository:
    def __init__(self, db):
        self.coll = db.customer

    # get list of all customers from database
    def getListOfCustomers(self):
        all_customers = self.coll.find()
        list_customers = []
        for customer in all_customers:
            _id = customer["_id"]
            name = customer["name"]
            surname = customer["surname"]
            dateOfBirth = customer["dateOfBirth"]
            email = customer["email"]
            phoneNum = customer["phoneNum"]
            password = customer["password"]
            imageFile = customer["imageFile"]
            fileName=imageFile["fileName"]
            imageData=base64.b64decode(imageFile["imageData"])
            address = customer["address"]
            web_customer = Customer(
                name,
                surname,
                dateOfBirth,
                email,
                phoneNum,
                password,
                fileName,
                imageData,
                address,
                _id=_id,
            )
            list_customers.append(web_customer)
        return list_customers

    # check whether a customer with such an e-mail exists
    def customerExist(self, customerEmail):
        query = {"email": customerEmail}
        customer = self.coll.find_one(query)
        if customer:
            return True
        return False

    # find customer data by e-mail
    def getCustomerByEmail(self, email):
        query = {"email": email}
        customer = self.coll.find_one(query)
        return customer

    # check whether the customer with the ID exists
    def customerExistsById(self, customer_id):
        query = {"_id": ObjectId(customer_id)}
        customer = self.coll.find_one(query)
        if customer:
            return True
        return False

    # find customer data by ID
    def getCustomerById(self, customer_id):
        query = {"_id": ObjectId(customer_id)}
        customer = self.coll.find_one(query)
        return customer

    # check whether the customer has entered the correct e-mail and password and can be admitted to the system
    def customerExistForSignIn(self, customerEmail, password):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        query = {"email": customerEmail, "password": hashed_password}
        customer = self.coll.find_one(query)
        if customer:
            return True
        return False

    # create customer  and add to database
    def createCustomer(self, customer):
        if self.customerExist(customer.email):
            return None
        
        
        imageFile = {
            "fileName": customer.fileName,
            "imageData": customer.imageData
        }

        new_customer = {
            "name": customer.name,
            "surname": customer.surname,
            "dateOfBirth": customer.dateOfBirth,
            "email": customer.email,
            "phoneNum": customer.phoneNum,
            "password": customer.password,
            "imageFile": imageFile,
            "address": customer.address,
        }
        result = self.coll.insert_one(new_customer)
        return result.inserted_id

    # delete customer by ID
    def deleteCustomerByID(self, customer_id):
        result = self.coll.delete_one({"_id": ObjectId(customer_id)})
        if result.deleted_count > 0:
            return True
        return False

    # update customers`s data using ID
    def updateCustomer(self, customer, customer_id):
        imageFile = {
            "fileName": customer.fileName,
            "imageData": customer.imageData
        }
        result = self.coll.update_one(
            {"_id": ObjectId(customer_id)},
            {
                "$set": {
                    "name": customer.name,
                    "surname": customer.surname,
                    "dateOfBirth": customer.dateOfBirth,
                    "email": customer.email,
                    "phoneNum": customer.phoneNum,
                    "password": customer.password,
                    "imageFile": imageFile,
                    "address": customer.address,
                }
            },
        )

        if result.modified_count > 0:
            return True
        return False
