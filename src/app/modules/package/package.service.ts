import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import { createSubscriptionProduct } from "../../../helpers/createSubscriptionProductHelper";
import { updateSubscriptionProduct } from "../../../helpers/updateSubscriptionProductHelper";

const createPackageToDB = async (
  payload: IPackage
): Promise<IPackage | null> => {
  const productPayload = {
    title: payload.title,
    duration: payload.duration,
    price: payload.price,
    priceId: payload.priceId,
  };

  const data = await createSubscriptionProduct(productPayload);

  if (!data || !data.productId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create subscription product"
    );
  }

  const packageData = {
    ...payload,
    paymentLink: data.paymentLink,
    stripeProductId: data.productId,
    // @ts-ignore
    priceId: data?.priceId,
  };

  const result = await Package.create(packageData);
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

const editPackageFromDB = async (id: string, payload: Partial<IPackage>) => {
  const existing = await Package.findById(id);
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Package not found");
  }

  const updates = { ...payload };

  const { paymentLink } = await updateSubscriptionProduct(existing, updates);

  if (paymentLink) {
    updates.paymentLink = paymentLink;
  }

  const updated = await Package.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update Package");
  }

  return updated;
};

export const PackageService = {
  createPackageToDB,
  getAllPackage,
  editPackageFromDB,
};
