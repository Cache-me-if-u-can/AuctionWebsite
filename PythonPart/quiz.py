class Quiz(object):
    def __init__(self, _id, quizName, charityId):
        self.__id= _id
        self.__quizName = quizName
        self.__charityId= charityId

    @property
    def id(self):
        return self.__id
    
    @property
    def quizName(self):
        return self.__quizName
    
    @property
    def charityId(self):
        return self.__charityId

    @quizName.setter
    def quizName(self, quizName):
        self.__quizName = quizName
    
    @charityId.setter
    def charityId(self, charityId):
        self.__charityId = charityId


    