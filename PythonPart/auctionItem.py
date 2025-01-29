class AuctionItem(object):
    def __init__(
        self,
        title,
        description,
        startingPrice,
        currentPrice,
        image,
        auctionEndDate,
        categoryId,
        charityId,
        status,
        _id=0,
    ):
        self.__id = _id
        self.__title = title
        self.__description = description
        self.__startingPrice = startingPrice
        self.__currentPrice = currentPrice
        self.__image = image
        self.__auctionEndDate = auctionEndDate
        self.__categoryId = categoryId
        self.__charityId = charityId
        self.__status = status

    @property
    def id(self):
        return self.__id

    @property
    def title(self):
        return self.__title

    @title.setter
    def title(self, title):
        self.__title = title

    @property
    def description(self):
        return self.__description

    @description.setter
    def description(self, description):
        self.__description = description

    @property
    def startingPrice(self):
        return self.__startingPrice

    @startingPrice.setter
    def startingPrice(self, startingPrice):
        self.__startingPrice = startingPrice

    @property
    def currentPrice(self):
        return self.__currentPrice

    @currentPrice.setter
    def currentPrice(self, currentPrice):
        self.__currentPrice = currentPrice

    @property
    def image(self):
        return self.__image

    @image.setter
    def image(self, image):
        self.__image = image

    @property
    def auctionEndDate(self):
        return self.__auctionEndDate

    @auctionEndDate.setter
    def auctionEndDate(self, auctionEndDate):
        self.__auctionEndDate = auctionEndDate

    @property
    def categoryId(self):
        return self.__categoryId

    @categoryId.setter
    def categoryId(self, categoryId):
        self.__categoryId = categoryId

    @property
    def charityId(self):
        return self.__charityId

    @charityId.setter
    def charityId(self, charityId):
        self.__charityId = charityId

    @property
    def status(self):
        return self.__status

    @status.setter
    def status(self, status):
        self.__status = status
