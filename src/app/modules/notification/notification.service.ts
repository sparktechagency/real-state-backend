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
  const queryBuilder = new QueryBuilder(
    NotificationModel.find({ receiver: user.id }).sort({ createdAt: -1 }),
    query
  );

  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.getPaginationInfo();

  return {
    meta,
    data,
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
