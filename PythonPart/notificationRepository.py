from notification import Notification
from bson.objectid import ObjectId


class NotificationRepository:
    def __init__(self, db):
        print(f"Initializing NotificationRepository with database: {db.name}")
        self.collection = db.notifications

    def create_notification(self, notification):
        try:
            notification_data = {
                "userId": notification.userId,
                "message": notification.message,
                "type": notification.type,
                "auctionId": notification.auctionId,
                "read": notification.read,
                "createdAt": notification.createdAt,
            }
            print(f"Attempting to create notification: {notification_data}")
            result = self.collection.insert_one(notification_data)
            print(f"Notification created with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating notification: {e}")
            print(f"Notification data was: {notification_data}")
            return None

    def get_user_notifications(self, user_id):
        notifications = self.collection.find({"userId": user_id}).sort("createdAt", -1)
        return list(notifications)

    def mark_as_read(self, notification_id):
        try:
            result = self.collection.update_one(
                {"_id": ObjectId(notification_id)}, {"$set": {"read": True}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error marking notification as read: {e}")
            return False
