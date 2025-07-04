import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { apartmentService } from "./appartment.service";

const createApartment = catchAsync(async (req: Request, res: Response) => {
  const result = req.body;
  const data = await apartmentService.createApartmentIntoDB(result);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Successfully create",
    data: data,
  });
});

const getAllApartment = catchAsync(async (req: Request, res: Response) => {
  const result = await apartmentService.getAllApartmentFromDB(req.query);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Successfully retrived",
    pagination: result.meta,
    data: result.data,
  });
});
const getSingleOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await apartmentService.getSingleApartment(id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Successfully retrieved",
    data: result,
  });
});

const deleteApartment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await apartmentService.deleteApartmentFromDB(id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Successfully retrieved",
    data: result,
  });
});

const updateApartmentDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await apartmentService.updateApartmentDetailsFromDB(
    id,
    payload
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Successfully retrieved",
    data: result,
  });
});


export const apartmentController = {
  createApartment,
  getAllApartment,
  getSingleOne,
  deleteApartment,
  updateApartmentDetails
};
