import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPushNotification } from "./pushnotification.interface"
import { pushNotificationModel } from "./pushnotification.model";
import { JwtPayload } from "jsonwebtoken";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { User } from "../user/user.model";
import { INotification } from "../notification/notification.interface";
import { sendNotificationToFCM } from "../../../helpers/firebaseHelperFMC";

const createPushNotificationDto = async (userId: JwtPayload, payload: IPushNotification) => {
    payload.sender = userId.id;

    const result = await pushNotificationModel.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Can't create Push Notification");
    }

    //   Collect all users who have device tokens
    const allUsers = await User.find({
        deviceToken: { $exists: true, $ne: null },
    })
        .select("_id deviceToken")
        .lean();
    // Collect all device tokens
    const allDeviceTokens = allUsers.flatMap((u) => u.deviceToken);
    // all user ids
    const allUserIds = allUsers.map((u) => u._id);
    for (const user of allUsers) {
        const notificationPayload: INotification = {
            sender: userId.id,
            title: payload.title,
            receiver: allUserIds.includes(user._id) ? user._id : undefined!,
            description: payload.description,
            image: payload.image,
            isRead: false,
            message: payload.title || "You have a new notification",
        };
        await sendNotifications(notificationPayload);
    }

    // send push notification to all device tokens
    for (const deviceToken of allDeviceTokens) {
        await sendNotificationToFCM({
            token: deviceToken!,
            title: payload.title || "You have a new notification",
            body: payload.description || "",
            data: result.toObject(),
        })
    }

    return result;
}


export const PushNotificationService = {
    createPushNotificationDto
}