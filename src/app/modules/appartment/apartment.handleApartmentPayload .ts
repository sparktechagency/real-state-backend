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
    console.log("req.body", req.body);

    let preservedImages = JSON.stringify(req.body.existImage) || [];

    const uploadedImages = getMultipleFilesPath(req.files, "apartmentImage") || [];
    let finalImageArray: string[] = [];
    const preservedArray = typeof preservedImages === "string" ? [preservedImages] : preservedImages;
    // Merge preserved + new uploaded
    finalImageArray = [...preservedArray, ...uploadedImages];

    const qualitySpecificationPDF = getMultipleFilesPath(req.files, "qualitySpecificationPDF");
    const paymentPlanPDF = getSingleFilePath(req.files, "paymentPlanPDF");
    const pricePdf = getSingleFilePath(req.files, "pricePdf");

    req.body = {
      ...payload,
      apartmentImage: finalImageArray,
      qualitySpecificationPDF,
      paymentPlanPDF,
      pricePdf,
    };

    next();
  } catch (error) {
    console.error("Apartment payload error:", error);
    res.status(500).json({ message: "Failed to process apartment payload" });
  }
};
