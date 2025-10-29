import { INotification } from "../app/modules/notification/notification.interface";
import { NotificationModel } from "../app/modules/notification/notification.model";

export const sendNotifications = async (data: any): Promise<INotification> => {
  // console.log("result =>>>", data);
  const result = await NotificationModel.create(data);

  //@ts-ignore
  const socketIo = global.io;

  if (socketIo && Array.isArray(data.receiver)) {
    for (const receiverId of data.receiver) {
      socketIo.emit(`get-notification::${receiverId}`, result);
    }
  }

  return result;
};
