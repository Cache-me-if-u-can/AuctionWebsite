from question import *
from bson.objectid import ObjectId


class QuestionRepository:

    def __init__(self, db):
        self.coll = db.question

    # get all quiz questions
    def getListOfQuizQuestions(self, quizId):
        quiz_questions = self.coll.find({"quizId": ObjectId(quizId)})
        list_questions = []
        for question in quiz_questions:
            question_el = question
            question_el["_id"] = str(question["_id"])
            list_questions.append(question_el)
        return list_questions

    # create new question and add to database
    def createQuestion(self, question, quizConnection):
        if quizConnection.quizExistsById(question.quizId) == True:
            new_question = {
                "quizId": question.quizId,
                "text": question.text,
            }
            result = self.coll.insert_one(new_question)
            return result.inserted_id
        else:
            return None

    # delete question by ID
    def deleteQuestionById(self, questionId):
        result = self.coll.delete_one({"_id": ObjectId(questionId)})
        if result.deleted_count == 1:
            return True
        else:
            return False

    # delete all quiz's questions
    def deleteAllQuizQuesstions(self, quizId):
        result = self.coll.delete_many({"quizId": ObjectId(quizId)})
        return result.deleted_count

    # update question's data using ID
    def updateQuestion(self, question, questionId):
        result = self.coll.update_one(
            {"_id": ObjectId(questionId)},
            {
                "$set": {
                    "quizId": question.quizId,
                    "text": question.text,
                }
            },
        )

        if result.modified_count > 0:
            return True
        else:
            return False

    # find question data by ID
    def getQuestionById(self, questionId):
        query = {"_id": ObjectId(questionId)}
        question = self.coll.find_one(query)
        return question

    # check whether the question with the ID exists
    def questionExistsById(self, question_id):
        query = {"_id": ObjectId(question_id)}
        question = self.coll.find_one(query)
        if question:
            return True
        return False
