import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import { INotification } from "./notification.interface";
import { NotificationModel } from "./notification.model";

const createNotification = async (payload: INotification) => {
  const notification = await NotificationModel.create(payload);
  return notification;
};

const getNotificationsByUserId = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  // Set default sort to show recent notifications first if not provided
  if (!query.sort) {
    query.sort = "-createdAt";
  }

  const queryBuilder = new QueryBuilder(
    NotificationModel.find({ receiver: user.id }),
    query
  );

  // Apply all query builder methods in order
  queryBuilder.filter().sort().paginate().fields();

  // Execute the query
  const data = await queryBuilder.modelQuery;

  // Get pagination info with filtered results
  const meta = await queryBuilder.getPaginationInfo();

  // Get unread notification count
  const unreadCount = await NotificationModel.countDocuments({
    receiver: user.id,
    isRead: false,
  });

  // Map data and add unreadCount to each notification
  const result = data.map((notification) => {
    const notificationObj = notification.toObject();
    return {
      ...notificationObj,
      unreadCount,
    };
  });

  return {
    meta,
    result,
  };
};

const updateNotification = async (notificationId: string) => {
  return await NotificationModel.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
};

//

export const NotificationServices = {
  createNotification,
  getNotificationsByUserId,
  updateNotification,
};
