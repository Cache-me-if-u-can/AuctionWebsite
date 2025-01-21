class Bid(object):
    def __init__(self, _id, auctionId, customerId, bidAmount, bidDate):
        self.__id = _id
        self.__auctionId = auctionId
        self.__customerId = customerId
        self.__bidAmount = bidAmount
        self.__bidDate = bidDate


    @property
    def id(self):
        return self.__id

    @property
    def auctionItemId(self):
        return self.__auctionId

    @auctionItemId.setter
    def auctionItemId(self, auctionId):
        self.__auctionId = auctionId

    @property
    def customerId(self):
        return self.__customerId

    @customerId.setter
    def customerId(self, customerId):
        self.__customerId = customerId

    @property
    def bidAmount(self):
        return self.__bidAmount

    @bidAmount.setter
    def bidAmount(self, bidAmount):
        self.__bidAmount = bidAmount

    @property
    def bidDate(self):
        return self.__bidDate

    @bidDate.setter
    def bidDate(self, bidDate):
        self.__bidDate = bidDate