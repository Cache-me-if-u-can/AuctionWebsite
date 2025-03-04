from charity import *
from bson.objectid import ObjectId
import hashlib
import base64


class CharityRepository:
    def __init__(self, db):
        self.coll = db.charity

    # create charity and add to database
    def createCharity(self, charity):
        if self.charityExistsByEmail(charity.email):
            return None

        new_charity = {
            "name": charity.name,
            "email": charity.email,
            "phoneNum": charity.phoneNum,
            "password": charity.password,
            "image": charity.image,
            "address": charity.address,
            "description": charity.description,
        }
        result = self.coll.insert_one(new_charity)
        return result.inserted_id

    # get list of all charities from database
    def getListOfCharities(self):
        all_charities = self.coll.find()
        # list_charities = []
        # for charity in all_charities:
        #     _id = charity["_id"]
        #     name = charity["name"]
        #     email = charity["email"]
        #     phoneNum = charity["phoneNum"]
        #     password = charity["password"]
        #     image = charity["image"]
        #     address = charity["address"]
        #     description = charity["description"]
        #     web_charity = Charity(
        #         name,
        #         email,
        #         phoneNum,
        #         password,
        #         image,
        #         address,
        #         description,
        #         _id=_id,
        #     )
        #     list_charities.append(web_charity)
        # return list_charities
        list_charities = []
        for charity in all_charities:
            charity_el = charity
            charity_el["_id"] = str(charity["_id"])
            list_charities.append(charity_el)
        return list_charities

    # check whether a charity with such an e-mail exists
    def charityExistsByEmail(self, charityEmail):
        query = {"email": charityEmail}
        charity = self.coll.find_one(query)
        if charity:
            return True
        return False

    # check whether the charity with the ID exists
    def charityExistsById(self, charity_id):
        query = {"_id": ObjectId(charity_id)}
        charity = self.coll.find_one(query)
        if charity:
            return True
        return False

    # find charity data by ID
    def getCharityById(self, charity_id):
        query = {"_id": ObjectId(charity_id)}
        charity = self.coll.find_one(query)
        return charity

    # find charity data by name
    def getCharityByName(self, charity_name):
        query = {"name": charity_name}
        charity = self.coll.find_one(query)
        return charity

    # find charity data by e-mail
    def getCharityByEmail(self, email):
        query = {"email": email}
        charity = self.coll.find_one(query)
        return charity

    # check whether the charity has entered the correct e-mail and password and can be admitted to the system
    def charityExistForSignIn(self, charityEmail, password):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        query = {"email": charityEmail, "password": hashed_password}
        charity = self.coll.find_one(query)
        if charity:
            return True
        return False

    # delete charity by ID
    def deleteCharityByID(self, charity_id):
        result = self.coll.delete_one({"_id": ObjectId(charity_id)})
        if result.deleted_count > 0:
            return True
        return False

    # update charity`s data using ID
    def updateCharity(self, charity, charity_id):
        result = self.coll.update_one(
            {"_id": ObjectId(charity_id)},
            {
                "$set": {
                    "name": charity.name,
                    "email": charity.email,
                    "phoneNum": charity.phoneNum,
                    "password": charity.password,
                    "image": charity.image,
                    "address": charity.address,
                    "description": charity.description,
                }
            },
        )

        if result.modified_count > 0:
            return True
        return False
