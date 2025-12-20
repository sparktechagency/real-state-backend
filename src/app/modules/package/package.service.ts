import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";

const createPackageToDB = async (payload: IPackage) => {
  const result = await Package.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Package");
  }

  return result;
};

const getAllPackage = async () => {
  const result = await Package.find();
  if (!result) {
    return [];
  }
  return result;
};





export const PackageService = {
  createPackageToDB,
  getAllPackage,
};
