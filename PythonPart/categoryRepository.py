from category import *
from bson.objectid import ObjectId


class CategoryRepository:
    def __init__(self, db):
        self.coll = db.category

    # find category data by name
    def getCategoryByName(self, categoryName):              
        query = {'categoryName': categoryName}
        category = self.coll.find_one(query)
        return category
    
    # find category data by ID
    def getCategoryById(self, categoryId):              
        query = {'_id': ObjectId(categoryId)}
        category = self.coll.find_one(query)
        return category
    
     # check whether the category with the ID exists
    def categoryExistsById(self, categoryId):          
        query = {'_id': ObjectId(categoryId)}
        category=self.coll.find_one(query)
        if(category!=None):
            return True
        else:
            return False
        
    def getListOfCategories(self):
        all_categories = self.coll.find()
        list_categories = [category["categoryName"] for category in all_categories]
        return list_categories

    # get list of all categories from database
    def getCategories(self):
        """Get all categories with their IDs and names"""
        try:
            return list(self.coll.find())
        except Exception as e:
            print(f"Error getting categories: {e}")
            return []
