import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubscriptionService } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const subscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.addSubscriberIntoDB(
    req.body,
    req.user!
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subscription added successfully",
    data: result,
  });
});

const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getAllSubscriptionsFromDB(
    req.user!,
    req.query
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subscriptions retrieved successfully",
    pagination: result.meta,
    data: result.data,
  });
});

const getSpecificSubscriber = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.specipicSubscriberFromDB(
      req.user!
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Subscription retrieved successfully",
      data: result,
    });
  }
);

const mySubscriptionPackage = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.mySubscriptionPackageIntoDB(
      req.user!
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Subscription package retrieved successfully",
      data: result,
    });
  }
);

export const SubscriptionController = {
  subscriptions,
  getAllSubscriptions,
  getSpecificSubscriber,
  mySubscriptionPackage,
};
