from datetime import datetime

class Review(object):
    def __init__(self, _id, customerId, auctionId, comment, review_date):
        self.__id = _id
        self.__customerId = customerId
        self.__auctionId = auctionId
        self.__comment = comment
        self.__review_date = review_date if review_date else datetime.now()

    @property
    def reviewId(self):
        return self.__id

    @reviewId.setter
    def reviewId(self, _id):
        self.__id = _id

    @property
    def customerId(self):
        return self.__customerId

    @customerId.setter
    def customerId(self, customerId):
        self.__customerId = customerId

    @property
    def serviceId(self):
        return self.__auctionId

    @serviceId.setter
    def serviceId(self, auctionId):
        self.__auctionId = auctionId

    @property
    def comment(self):
        return self.__comment

    @comment.setter
    def comment(self, comment):
        self.__comment = comment

    @property
    def review_date(self):
        return self.__review_date

    @review_date.setter
    def review_date(self, review_date):
        if isinstance(review_date, datetime):
            self.__review_date = review_date
        else:
            raise ValueError("review_date must be a datetime object")

