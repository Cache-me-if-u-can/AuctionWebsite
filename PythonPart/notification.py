from datetime import datetime, timezone


class Notification:
    def __init__(self, userId, message, type, auctionId, read=False, _id=None):
        self.__id = _id
        self.__userId = userId
        self.__message = message
        self.__type = type
        self.__auctionId = auctionId
        self.__read = read
        self.__createdAt = datetime.now(timezone.utc).isoformat()

    @property
    def id(self):
        return self.__id

    @property
    def userId(self):
        return self.__userId

    @property
    def message(self):
        return self.__message

    @property
    def type(self):
        return self.__type

    @property
    def auctionId(self):
        return self.__auctionId

    @property
    def read(self):
        return self.__read

    @property
    def createdAt(self):
        return self.__createdAt
