class Question(object):
    def __init__(self, _id, quizId, text):
        self.__id = _id
        self.__quizId = quizId
        self.__text = text

    @property
    def id(self):
        return self.__id

    @property
    def quizId(self):
        return self.__quizId

    @property
    def text(self):
        return self.__text

    @quizId.setter
    def quizId(self, quizId):
        self.__quizId = quizId

    @text.setter
    def text(self, text):
        self.__text = text
