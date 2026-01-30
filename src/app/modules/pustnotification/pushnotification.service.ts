import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPushNotification } from "./pushnotification.interface";
import { pushNotificationModel } from "./pushnotification.model";
import { JwtPayload } from "jsonwebtoken";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { User } from "../user/user.model";
import { INotification } from "../notification/notification.interface";
import { sendNotificationToFCM } from "../../../helpers/firebaseHelperFMC";

const createPushNotificationDto = async (
  userId: JwtPayload,
  payload: IPushNotification,
) => {
  payload.sender = userId.id;

  // collect all verified users except sender
  const allUsers = await User.find({
    verified: true,
    _id: { $ne: userId.id },
  })
    .select("+deviceToken +deviceId")
    .lean();

  if (!allUsers.length) return [];

  // save notification for each user individually
  const notifications = await Promise.all(
    allUsers.map(async (user) => {
      const doc = await pushNotificationModel.create({
        ...payload,
        sender: userId.id,
        receiver: user._id, // new: each user gets separate receiver
      });
      // new: Send push notification (FCM)

      try {
        if (user.deviceToken) {
          await sendNotificationToFCM({
            token: user.deviceToken,
            title: payload.title || "You have a new notification",
            body: payload.description || "",
            data: doc.toObject(),
          });
        }
      } catch (err) {
        console.error("FCM failed for user:", user._id, err);
      }

      // new: Send socket notification to single user
      await sendNotifications({
        sender: userId.id,
        receiver: user._id,
        title: payload.title,
        description: payload.description,
        image: payload.image,
        isRead: false,
        message: payload.title || "You have a new notification",
      });

      return doc;
    }),
  );

  return notifications; // returns array of saved notifications
};

export const PushNotificationService = {
  createPushNotificationDto,
};
