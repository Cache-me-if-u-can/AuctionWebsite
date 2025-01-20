from auctionItem import *
from bson.objectid import ObjectId
import hashlib
import base64


class AuctionItemRepository:
    def __init__(self, db):
        self.coll = db.auctionItem

    # get list of all auction items from database
    def getListOfAuctionItems(self):
        all_auctionItems = self.coll.find()
        list_auctionItems = []
        for auctionItem in all_auctionItems:
            _id = auctionItem["_id"]
            title = auctionItem["title"]
            description = auctionItem["description"]
            startingPrice = auctionItem["startingPrice"]
            currentPrice = auctionItem["currentPrice"]
            imageFile = auctionItem["imageFile"]
            fileName=imageFile["fileName"]
            imageData=base64.b64decode(imageFile["imageData"])
            auctionEndDate = auctionItem["auctionEndDate"]
            categoryId = auctionItem["categoryId"]
            charityId= auctionItem["charityId"]
            status = auctionItem["status"]
            web_auctionItem = AuctionItem(
                title,description, startingPrice, currentPrice, fileName, imageData, auctionEndDate, categoryId, charityId, status, _id=_id
            )
            list_auctionItems.append(web_auctionItem)
        return list_auctionItems


    # find  auction item data by title
    def getAuctionItemByTitle(self, title):
        query = {"title": title}
        auctionItem = self.coll.find_one(query)
        return auctionItem

    # check whether the auction item with the ID exists
    def auctionItemExistsById(self, auctionItem_id):
        query = {"_id": ObjectId(auctionItem_id)}
        auctionItem = self.coll.find_one(query)
        if auctionItem:
            return True
        return False

    # find auction item data by ID
    def getAuctionItemById(self, auctionItem_id):
        query = {"_id": ObjectId(auctionItem_id)}
        auctionItem = self.coll.find_one(query)
        return auctionItem

    # create auctionItem and add to database
    def createAuctionItem(self, auctionItem):
        #  check is auction item exists by tittle ?

        imageFile = {
            "fileName": auctionItem.fileName,
            "imageData": auctionItem.imageData
        }

        new_auctionItem = {
            "title": auctionItem.title,
            "description": auctionItem.description,
            "startingPrice": auctionItem.startingPrice,
            "currentPrice": auctionItem.currentPrice,
            "imageFile": imageFile,
            "auctionEndDate": auctionItem.auctionEndDate,
            "categoryId": auctionItem.categoryId,
            "charityId": auctionItem.charityId,
            "status": auctionItem.status
        }
        result = self.coll.insert_one(new_auctionItem)
        return result.inserted_id

    # delete auction item  by ID
    def deleteAuctionItemByID(self, auctionItem_id):
        result = self.coll.delete_one({"_id": ObjectId(auctionItem_id)})
        if result.deleted_count > 0:
            return True
        return False

    # update auction item's data using ID
    def updateAuctionItem(self, auctionItem, auctionItem_id):
        imageFile = {
            "fileName": auctionItem.fileName,
            "imageData": auctionItem.imageData
        }

        result = self.coll.update_one(
            {"_id": ObjectId(auctionItem_id)},
            {
                "$set": {
                    "title": auctionItem.title,
                    "description": auctionItem.description,
                    "startingPrice": auctionItem.startingPrice,
                    "currentPrice": auctionItem.currentPrice,
                    "imageFile": imageFile,
                    "auctionEndDate": auctionItem.auctionEndDate,
                    "categoryId": auctionItem.categoryId,
                    "charityId": auctionItem.charityId,
                    "status": auctionItem.status
                }
            },
        )

        if result.modified_count > 0:
            return True
        return False
