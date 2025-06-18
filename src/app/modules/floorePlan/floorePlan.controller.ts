import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FloorPlanService } from "./floorePlan.service";
import { Request, Response } from "express";

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
    message: "Apartments with Floor Plans fetched successfully",
    statusCode: StatusCodes.OK,
    pagination: result.pagination,
    data: {
      apartments: result.apartments,
    },
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

const getLocationPropertyTypeSalesCompanyCompletionYear = catchAsync(
  async (req, res) => {
    const result =
      await FloorPlanService.getLocationPropertyTypeSalesCompanyCompletionYearFromDB();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Apartment fields fetched successfully",
      data: result,
    });
  }
);

const updateFloorePlan = catchAsync(async (req: Request, res: Response) => {
  const result = await FloorPlanService.updateFloorPlanFromDB(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Floore Plan updated successfully",
    data: result,
  })
})


export const FloorePlanController = {
  createFloorePlan,
  getAllFloorePlan,
  getSingleFloor,
  getLocationPropertyTypeSalesCompanyCompletionYear,
  updateFloorePlan
};
