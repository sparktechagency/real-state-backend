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

const getFloorsByApartmentId = catchAsync(async (req, res) => {
  const { apartmentId } = req.params;
  const result = await FloorPlanService.getFloorPlansByApartmentId(apartmentId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Floor plans retrieved successfully",
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
  const { id } = req.params
  const data = req.body
  const result = await FloorPlanService.updateFloorPlanFromDB(id, data);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Floore Plan updated successfully",
    data: result,
  })
})

const deleteFloorePlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params 
  const result = await FloorPlanService.deleteFloorPlanFromDB(id);
  sendResponse(res, { 
    success: true,
    statusCode: StatusCodes.OK,
    message: "Floore Plan deleted successfully",
    data: result,
  });
});


export const FloorePlanController = {
  createFloorePlan,
  getAllFloorePlan,
  getFloorsByApartmentId,
  getLocationPropertyTypeSalesCompanyCompletionYear,
  updateFloorePlan,
  deleteFloorePlan
};
