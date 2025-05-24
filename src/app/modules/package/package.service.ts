import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import { createSubscriptionProduct } from "../../../helpers/createSubscriptionProductHelper";

const createPackageToDB = async (
  payload: IPackage
): Promise<IPackage | null> => {
  const productPayload = {
    title: payload.title,
    duration: payload.duration,
    price: payload.price,
  };

  const data = await createSubscriptionProduct(productPayload);

  if (!data) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create subscription product"
    );
  }

  payload.paymentLink = data.paymentLink;
  const result = await Package.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Package");
  }

  return result;
};

export const PackageService = {
  createPackageToDB,
};
