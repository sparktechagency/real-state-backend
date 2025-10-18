import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PushNotificationService } from "./pushnotification.service";

const createPushNotification = catchAsync(async (req, res) => {
    const result = await PushNotificationService.createPushNotificationDto(req.user!, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Push Notification created successfully",
        data: result,
    });
});

export const PushNotificationController = {
    createPushNotification
}