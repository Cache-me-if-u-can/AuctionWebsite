from quiz import *
from bson.objectid import ObjectId


class QuizRepository:
    def __init__(self, db):
        self.coll = db.quiz

    # create quiz and add to database
    def createQuiz(self, quiz, charityConnection):
        if charityConnection.charityExistsById(quiz.charityId) == True:
            new_quiz = {
                "name": quiz.quizName,
                "charityId": quiz.charityId,
            }
            result = self.coll.insert_one(new_quiz)
            return result.inserted_id
        else:
            return None

    # get list of all quizes from database
    def getListOfQuizes(self):
        all_quizes = self.coll.find()
        list_quizes = []
        for quiz in all_quizes:
            quiz_el = quiz
            quiz_el["_id"] = str(quiz["_id"])
            list_quizes.append(quiz_el)
        return list_quizes

    # check whether the quiz with the ID exists
    def quizExistsById(self, quiz_id):
        query = {"_id": ObjectId(quiz_id)}
        quiz = self.coll.find_one(query)
        if quiz:
            return True
        return False

    # get list of quizes for charity
    def getListOfQuizesForCharity(self, charityId):
        all_quizes = self.coll.find({"charityId": ObjectId(charityId)})
        list_quizes = []
        for quiz in all_quizes:
            quiz_el = quiz
            quiz_el["_id"] = str(quiz["_id"])
            list_quizes.append(quiz_el)
        return list_quizes

    # delete quiz by ID
    def deleteQuizByID(self, quiz_id):
        result = self.coll.delete_one({"_id": ObjectId(quiz_id)})
        if result.deleted_count > 0:
            return True
        return False

    # delete all charity's quizes
    def deleteAllCharityQUizes(self, charityId):
        result = self.coll.delete_many({"charityId": ObjectId(charityId)})
        return result.deleted_count

    # update quiz's`s data using ID
    def updateQuiz(self, quiz, quiz_id):
        result = self.coll.update_one(
            {"_id": ObjectId(quiz_id)},
            {
                "$set": {
                    "name": quiz.quizName,
                    "charityId": quiz.charityId,
                }
            },
        )

        if result.modified_count > 0:
            return True
        return False

    # find quiz data by ID
    def getQuizById(self, quizId):
        query = {"_id": ObjectId(quizId)}
        quiz = self.coll.find_one(query)
        return quiz

    def getQuizByCharityId(self, charityId):
        query = {"charityId": ObjectId(charityId)}
        quiz = self.coll.find_one(query)
        return quiz
