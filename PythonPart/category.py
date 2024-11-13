class Category(object):
    def __init__(self, _id, categoryName):
        self.__categoryId = _id
        self.__categoryName = categoryName

    @property
    def id(self):
        return self.__categoryId
