import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsersFromDB(req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Users retrieved successfully',
        pagination: result.paginationInfo,
        data: result.data,
    });
});


export const adminController = {
    getAllUser
}