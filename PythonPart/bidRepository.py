from bid import *
from bson.objectid import ObjectId


class BidRepository:

    def __init__(self, db):
        self.coll = db.bid

    # get all bids for auction item
    def getListOfBids(self, auctionId):
        auctionItem_bids = self.coll.find({"auctionItemId": ObjectId(auctionId)})

        list_bids = []
        for bid in auctionItem_bids:
            _id = bid["_id"]
            auctionId = bid["auctionItemId"]
            customerId = bid["customerId"]
            bidAmount = bid["bidAmount"]
            bidDate = bid["bidDate"]
            bidAnonymous = bid["isAnonymous"]

            auctionItemBid = Bid(
                _id, auctionId, customerId, bidAmount, bidDate, bidAnonymous
            )
            list_bids.append(auctionItemBid)

        return list_bids

    # create new bid and add to database
    def createBid(self, bid, customerConnection, auctionItemConnection):
        if (
            customerConnection.customerExistsById(bid.customerId) == True
            and auctionItemConnection.auctionItemExistsById(bid.auctionItemId) == True
        ):
            new_bid = {
                "auctionItemId": bid.auctionItemId,
                "customerId": bid.customerId,
                "bidAmount": bid.bidAmount,
                "bidDate": bid.bidDate,
                "isAnonymous": bid.isAnonymous,
            }
            result = self.coll.insert_one(new_bid)
            return result.inserted_id
        else:
            return None

    # delete bid by ID
    def deleteBidById(self, bidId):
        result = self.coll.delete_one({"_id": ObjectId(bidId)})
        if result.deleted_count == 1:
            return True
        else:
            return False

    # delete all auction item's bids
    def deleteAllAuctionItemBids(self, auctionItemId):
        result = self.coll.delete_many({"auctionItemId": ObjectId(auctionItemId)})
        return result.deleted_count

    # delete all customer's bids
    def deleteAllCustomerBids(self, customerId):
        result = self.coll.delete_many({"customerId": ObjectId(customerId)})
        return result.deleted_count

    # update bid's data using ID
    def updateBid(self, bid, bidId):
        result = self.coll.update_one(
            {"_id": ObjectId(bidId)},
            {
                "$set": {
                    "auctionItemId": bid.auctionItemId,
                    "customerId": bid.customerId,
                    "bidAmount": bid.bidAmount,
                    "bidDate": bid.bidDate,
                    "isAnonymous": bid.isAnonymous,
                }
            },
        )

        if result.modified_count > 0:
            return True
        else:
            return False

    # find  bid data by ID
    def getBidById(self, bidId):
        query = {"_id": ObjectId(bidId)}
        bid = self.coll.find_one(query)
        return bid

    # get current highest bid amount for auction item
    def getCurrentBid(self, auctionId):
        try:
            print(f"Querying current highest bid for auction ID: {auctionId}")
            highest_bid = self.coll.find_one(
                {"auctionItemId": auctionId}, sort=[("bidAmount", -1)]
            )
            if highest_bid:
                print(f"Highest bid found: {highest_bid['bidAmount']}")
                return highest_bid["bidAmount"]
            print("No bids found for this auction item.")
            return None
        except Exception as e:
            print(f"Error querying current highest bid for auction ID {auctionId}: {e}")
            return None

    # get top three bids with user info
    def getTopThreeBids(self, auctionId, customerConnection):
        top_bids = self.coll.find(
            {"auctionItemId": auctionId}, sort=[("bidAmount", -1)]
        ).limit(3)
        results = []
        for bid in top_bids:
            print(f"Processing bid: {bid}")
            customer = customerConnection.getCustomerById(bid["customerId"])
            if not customer:
                continue
            user_name = (
                "Anonymous User"
                if bid.get("isAnonymous", False)
                else f"{customer['name']} {customer['surname']}"
            )
            results.append({"userName": user_name, "bidAmount": bid["bidAmount"]})
        return results

    def getBidsByCustomerId(self, customer_id):
        try:
            bids = list(self.coll.find({"customerId": customer_id}))
            return bids
        except Exception as e:
            print(f"Error querying bids for customer ID {customer_id}: {e}")
            return []
