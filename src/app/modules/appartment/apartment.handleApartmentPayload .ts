import { Request, Response, NextFunction } from "express";
import {
  getMultipleFilesPath,
  getSingleFilePath,
} from "../../../shared/getFilePath";

export const handleApartmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const apartmentImage = getMultipleFilesPath(req.files, "apartmentImage");
    const qualitySpecificationPDF = getMultipleFilesPath(
      req.files,
      "qualitySpecificationPDF"
    );
    const paymentPlanPDF = getSingleFilePath(req.files, "paymentPlanPDF");

    req.body = {
      ...payload,
      apartmentImage,
      qualitySpecificationPDF,
      paymentPlanPDF,
    };

    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to process apartment payload" });
  }
};
