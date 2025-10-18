import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ICustomerSupport } from "./CustomerSupport.interface";
import { CustomerSupportModel } from "./CustomerSupport.model";

const createCustomerSupportIntoDB = async (
  payload: ICustomerSupport
): Promise<ICustomerSupport> => {
  const customerSupport = await CustomerSupportModel.create(payload);
  if (!customerSupport) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to created Support information"
    );
  }
  return customerSupport;
};

const getSupportInformation = async () => {
  const result = await CustomerSupportModel.findOne();
  return result || {};
};


export const customerSupportService = {
  createCustomerSupportIntoDB,
  getSupportInformation,
};
