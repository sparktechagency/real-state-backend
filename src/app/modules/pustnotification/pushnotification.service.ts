import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPushNotification } from "./pushnotification.interface"
import { pushNotificationModel } from "./pushnotification.model";
import { JwtPayload } from "jsonwebtoken";

const createPushNotificationDto = async (user: JwtPayload, payload: IPushNotification) => {
    payload.sender = user.id;


    const result = await pushNotificationModel.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Can't create Push Notification");
    }
    return result;
}


export const PushNotificationService = {
    createPushNotificationDto
}