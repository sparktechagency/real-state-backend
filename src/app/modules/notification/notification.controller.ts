import { Request, Response } from "express";
import { NotificationServices } from "./notification.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getNotificationsForUser = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required!",
      });
    }

    const notifications = await NotificationServices.getNotificationsByUserId(
      { id: userId } as any,
      req.query
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User notifications retrieved successfully",
      pagination: notifications.meta,
      data: notifications.result,
    });
  }
);

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await NotificationServices.getNotificationsByUserId(
    req.user!,
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Notifications retrieved successfully",
    pagination: notifications.meta,
    data: notifications.result,
  });
});

const markNotificationAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required!",
      });
    }

    const updatedNotification = await NotificationServices.updateNotification(
      notificationId
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Notification marked as read successfully",
      data: updatedNotification,
    });
  }
);

export const NotificationController = {
  getNotificationsForUser,
  getNotifications,
  markNotificationAsRead,
};
