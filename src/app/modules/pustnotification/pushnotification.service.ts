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
  payload: IPushNotification
) => {
  payload.sender = userId.id;

  // collect all users who have device tokens
  const allUsers = await User.find({
    deviceToken: { $exists: true, $ne: null },
  })
    .select("_id deviceToken")
    .lean();

  // collect all device tokens
  const allDeviceTokens = allUsers.flatMap((u) => u.deviceToken);
  // await sendNotifications(notificationPayload as any); and need to remove send notification user.
  const allUser = await User.find({
    verified: true,
    _id: { $ne: userId.id },
  }).lean();
  // console.log(
  //   "allUserIds",
  //   allUser.map((u) => u._id)
  // );
  // save notification in DB
  const pushNotificationPayload = {
    ...payload,
    sender: userId.id,
    receiver: allUser.map((u) => u._id),
  };

  const result = await pushNotificationModel.create(pushNotificationPayload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Can't create Push Notification"
    );
  }

  //  Send socket notification to all connected users at once
  const notificationPayload: INotification = {
    sender: userId.id,
    title: payload.title,
    receiver: allUser.map((u) => u._id),
    description: payload.description,
    image: payload.image,
    isRead: false,
    message: payload.title || "You have a new notification",
  };

  // broadcast to all connected users
  await sendNotifications(notificationPayload);

  // Send push notifications to all device tokens (FCM)
  for (const deviceToken of allDeviceTokens) {
    await sendNotificationToFCM({
      token: deviceToken!,
      title: payload.title || "You have a new notification",
      body: payload.description || "",
      data: result.toObject(),
    });
  }

  return result;
};

export const PushNotificationService = {
  createPushNotificationDto,
};
