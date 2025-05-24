import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FloorPlanService } from "./floorePlan.service";

const createFloorePlan = catchAsync(async (req, res) => {
  const result = await FloorPlanService.createFloorPlan(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Floore Plan created successfully",
    data: result,
  });
});

const getAllFloorePlan = catchAsync(async (req, res) => {
  const result = await FloorPlanService.getAllFlans(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Floore Plan retrieved successfully",
    data: result,
  });
});

const getSingleFloor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FloorPlanService.getSingleFloorPlan(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Floore Plan retrieved successfully",
    data: result,
  });
});

export const FloorePlanController = {
  createFloorePlan,
  getAllFloorePlan,
  getSingleFloor,
};
