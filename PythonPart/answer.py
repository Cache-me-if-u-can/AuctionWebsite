class Answer(object):
    def __init__(self, _id, questionId, text, correct):
        self.__id = _id
        self.__questionId = questionId
        self.__text = text
        self.__correct = correct

    @property
    def id(self):
        return self.__id

    @property
    def questionId(self):
        return self.__questionId

    @property
    def text(self):
        return self.__text

    @property
    def correct(self):
        return self.__correct

    @questionId.setter
    def questionId(self, questionId):
        self.__questionId = questionId

    @text.setter
    def text(self, text):
        self.__text = text

    @correct.setter
    def correct(self, correct):
        self.__correct = correct
