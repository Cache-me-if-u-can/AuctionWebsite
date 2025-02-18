from answer import *
from bson.objectid import ObjectId


class AnswerRepository:

    def __init__(self, db):
        self.coll = db.answer

    # get all question answers
    def getListOfQuestionAnswers(self, questionId):
        question_answers = self.coll.find({"questionId": ObjectId(questionId)})
        list_answers = []
        for answer in question_answers:
            answer_el = answer
            answer_el["_id"] = str(answer["_id"])
            list_answers.append(answer_el)
        return list_answers

    # create new answer and add to database
    def createAnswer(self, answer, questionConnection):
        if questionConnection.questionExistsById(answer.questionId) == True:
            new_answer = {
                "questionId": answer.questionId,
                "text": answer.text,
                "correct": answer.correct,
            }
            result = self.coll.insert_one(new_answer)
            return result.inserted_id
        else:
            return None

    # delete answer by ID
    def deleteAnswerById(self, answerId):
        result = self.coll.delete_one({"_id": ObjectId(answerId)})
        if result.deleted_count == 1:
            return True
        else:
            return False

    # delete all questions's answers
    def deleteAllQuestionAnswers(self, questionId):
        result = self.coll.delete_many({"questionId": ObjectId(questionId)})
        return result.deleted_count

    # update answer's data using ID
    def updateAnswer(self, answer, answerId):
        result = self.coll.update_one(
            {"_id": ObjectId(answerId)},
            {
                "$set": {
                    "questionId": answer.questionId,
                    "text": answer.text,
                    "correct": answer.correct,
                }
            },
        )

        if result.modified_count > 0:
            return True
        else:
            return False

    # find answer data by ID
    def getNAswerById(self, answerId):
        query = {"_id": ObjectId(answerId)}
        answer = self.coll.find_one(query)
        return answer
