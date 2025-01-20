from review import *
from bson.objectid import ObjectId


class ReviewRepository:

    def __init__(self, db):
        self.coll = db.review

    # get all reviews about auction item 
    def getListOfAuctionItemReviews(self, auctionId):
        auctionItem_reviews = self.coll.find({'auctionItemId': ObjectId(auctionId)})
        
        list_reviews=[]
        for review in auctionItem_reviews:
            _id=review["_id"]
            customerId=review["customerId"]
            auctionId= review["auctionItemId"]
            comment = review["comment"]
            review_date= review["review_date"]
            
            auctionItemReview= Review(_id,customerId, auctionId, comment, review_date)
            list_reviews.append(auctionItemReview)
        
        return list_reviews

    #create new review and add to database
    def createReview(self,review, customerConnection, auctionItemConnection):
        if(customerConnection.customerExistsById(review.customerId)==True and  auctionItemConnection.auctionItemExistsById(review.auctionItemId)==True):
            new_review={ "customerId": review.customerId, "auctionItemId":review.auctionItemId, "comment": review.comment, "review_date": review.review_date}
            result=self.coll.insert_one(new_review)
            return result.inserted_id
        else: 
            return None 

    # delete review by ID
    def deleteReviewById(self, reviewId):
        result = self.coll.delete_one({'_id': ObjectId(reviewId)})
        if(result.deleted_count==1):
            return True
        else:
            return False
    

    #delete all auction item's reviews 
    def deleteAllAuctionItemReviews(self, auctionItemId):
        result = self.coll.delete_many({'auctionItemId': ObjectId(auctionItemId)})
        return result.deleted_count
    

    #delete all customer's reviews 
    def deleteAllCustomerReviews(self, customerId):
        result = self.coll.delete_many({'customerId': ObjectId(customerId)})
        return result.deleted_count


    # update review's data using ID
    def updateReview(self , review, reviewId):          
        result = self.coll.update_one(
        {'_id': ObjectId(reviewId)},
        {'$set': {
            'customerId': review.customerId,
            'auctionItemId': review.auctionItemId,
            'comment': review.comment,
            'review_date': review.review_date
        }}
        )

        if result.modified_count > 0:
            return True
        else:
            return False
        
   # find review data by ID
    def getReviewById(self, reviewId):              
        query = {'_id': ObjectId(reviewId)}
        review = self.coll.find_one(query)
        return review