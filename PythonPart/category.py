class Category(object):
    def __init__(self, _id, categoryName):
        self.__categoryId = _id
        self.__categoryName = categoryName

    @property
    def id(self):
        return self.__categoryId
    
    @property
    def categoryName(self):
        return self.__categoryName
    
    @categoryName.setter
    def categoryName(self, categoryName):
        self.__categoryName = categoryName
    

