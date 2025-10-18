import { Request } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import ApiError from "../../errors/ApiErrors";

const fileUploadHandler = () => {
  //create upload folder
  const baseUploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  //folder create for different file
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  //create filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case "image":
          uploadDir = path.join(baseUploadDir, "image");
          break;
        case "paymentPlanImage":
          uploadDir = path.join(baseUploadDir, "paymentPlanImage");
          break;
        case "qualitySpecificationPDF":
          uploadDir = path.join(baseUploadDir, "qualitySpecificationPDF");
          break;
        case "apartmentImage":
          uploadDir = path.join(baseUploadDir, "apartmentImage");
          break;
        case "paymentPlanPDF":
          uploadDir = path.join(baseUploadDir, "paymentPlanPDF");
          break;
        case "floorPlanPDF":
          uploadDir = path.join(baseUploadDir, "floorPlanPDF");
          break;
        case "pricePdf":
          uploadDir = path.join(baseUploadDir, "pricePdf");
          break;
        case "apartmentImagesPdf":
          uploadDir = path.join(baseUploadDir, "apartmentImagesPdf");
          break;
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, "File is not supported");
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  //file filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => { 
    if (
      file.fieldname === "image" ||
      file.fieldname === "paymentPlanImage" ||
      file.fieldname === "apartmentImage"
    ) {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only .jpeg, .png, .jpg file supported"
          )
        );
      }
    } else if (
      file.fieldname === "qualitySpecificationPDF" ||
      file.fieldname === "floorPlanPDF" ||
      file.fieldname === "paymentPlanPDF" ||
      file.fieldname === "pricePdf" ||
      file.fieldname === "apartmentImagesPdf"
    ) {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only .pdf files are supported for qualitySpecificationPDF"
          )
        );
      }
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, "Unsupported file field"));
    }
  };

  const upload = multer({ storage: storage, fileFilter: filterFilter }).fields([
    { name: "image", maxCount: 1 },
    { name: "paymentPlanPDF", maxCount: 1 },
    { name: "qualitySpecificationPDF", maxCount: 5 },
    { name: "apartmentImage", maxCount: 50 },
    { name: "floorPlanPDF", maxCount: 1 },
    { name: "pricePdf", maxCount: 1 },
    { name: "apartmentImagesPdf", maxCount: 1 },
  ]);
  return upload;
};

export default fileUploadHandler;
