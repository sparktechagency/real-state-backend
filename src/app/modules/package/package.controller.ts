import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PackageService } from "./package.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.createPackageToDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Package created Successfully",
    data: result,
  });
});

const getPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getAllPackage();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Package Retrieved Successfully",
    data: result,
  });
});

const editPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.editPackageFromDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Package updated successfully",
    data: result,
  });
});

export const PackageController = {
  createPackage,
  getPackage,
  editPackage,
};
