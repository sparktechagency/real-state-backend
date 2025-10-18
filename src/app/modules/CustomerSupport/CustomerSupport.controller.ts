import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { customerSupportService } from "./CustomerSupport.service";
import sendResponse from "../../../shared/sendResponse";

const createCustomerSupport = catchAsync(
  async (req: Request, res: Response) => {
    const result = await customerSupportService.createCustomerSupportIntoDB(
      req.body
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Create support",
      data: result,
    });
  }
);

const getAllSupportInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await customerSupportService.getSupportInformation();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Retrieve support",
    data: result,
  });
});

export const customerSupportController = {
  createCustomerSupport,
  getAllSupportInfo,
};
