from notification import Notification
from bson.objectid import ObjectId

class NotificationRepository:
    def __init__(self, db):
        self.collection = db.notifications

    def create_notification(self, notification):
        notification_data = {
            "userId": notification.userId,
            "message": notification.message,
            "type": notification.type,
            "auctionId": notification.auctionId,
            "read": notification.read,
            "createdAt": notification.createdAt
        }
        result = self.collection.insert_one(notification_data)
        return str(result.inserted_id)

    def get_user_notifications(self, user_id):
        notifications = self.collection.find({"userId": user_id}).sort("createdAt", -1)
        return list(notifications)

    def mark_as_read(self, notification_id):
        result = self.collection.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"read": True}}
        )
        return result.modified_count > 0

