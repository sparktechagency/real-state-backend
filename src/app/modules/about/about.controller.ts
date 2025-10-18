import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AboutService } from "./about.service";

const createFaq = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AboutService.createAboutToDB(payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faq Created Successfully",
    data: result,
  });
});

const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await AboutService.updateAboutToDB(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faq Updated Successfully",
    data: result,
  });
});

const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AboutService.deleteAboutToDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faq Deleted Successfully",
    data: result,
  });
});

const getFaqs = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutService.AboutFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faq retrieved Successfully",
    data: result,
  });
});

export const AboutController = {
  createFaq,
  updateFaq,
  deleteFaq,
  getFaqs,
};
