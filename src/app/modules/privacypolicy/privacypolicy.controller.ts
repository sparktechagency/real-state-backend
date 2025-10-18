import { Request, Response, NextFunction } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PrivacyPolicyService } from "./privacypolicy.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
const createPrivacyPolicy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...privacyPolicyData } = req.body;
    const result = await PrivacyPolicyService.createPrivacyPolicyToDB(
      privacyPolicyData
    );
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Privacy Policy created successfully",
      data: result,
    });
  }
);

const getAllPrivacyPolicy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PrivacyPolicyService.getPrivacyPolicyFromDB();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Privacy Policy retrieved successfully",
      data: result,
    });
  }
);
const updatePrivacyPolicy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await PrivacyPolicyService.updatePrivacyPolicyToDB(
      id,
      // @ts-ignore
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Privacy Policy updated successfully",
      data: result,
    });
  }
);
const deletePrivacyPolicy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await PrivacyPolicyService.deletePrivacyPolicyFromDB(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Privacy Policy deleted successfully",
      data: result,
    });
  }
);
export const PrivacyPolicyController = {
  createPrivacyPolicy,
  getAllPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
