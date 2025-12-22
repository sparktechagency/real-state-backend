import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createPackageToDB = async (payload: IPackage) => {
  const result = await Package.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Package");
  }

  return result;
};

const getAllPackage = async (query: Record<string, any>) => {
  const qb = new QueryBuilder(
    Package.find({ status: "Active", disable: false }).lean(),
    query
  )
    .sort()
    .paginate();
  const result = await qb.modelQuery;
  const meta = await qb.getPaginationInfo();
  return { result: result || [], meta };
};

const editPackageIntoDB = async (id: string, payload: Partial<IPackage>) => {
  const result = await Package.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update Package");
  }
  return result;
};

export const PackageService = {
  createPackageToDB,
  getAllPackage,
  editPackageIntoDB,
};
