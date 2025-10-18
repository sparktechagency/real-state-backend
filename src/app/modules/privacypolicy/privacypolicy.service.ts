import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { PrivacyPolicy } from "./privacypolicy.model";
import { IPrivacyPolicy } from "./privacypolicy.interface";

const createPrivacyPolicyToDB = async (payload: IPrivacyPolicy) => {
  const existingData = await PrivacyPolicy.findOne({});

  if (!existingData) {
    // If no data exists, create new
    const newPolicy = await PrivacyPolicy.create({ text: payload.text });
    if (!newPolicy) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to create PrivacyPolicy"
      );
    }
    return newPolicy;
  } else {
    const updatedPolicy = await PrivacyPolicy.findByIdAndUpdate(
      existingData._id,
      { text: payload.text },
      { new: true }
    );
    if (!updatedPolicy) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to update PrivacyPolicy"
      );
    }
    return updatedPolicy;
  }
};
const getPrivacyPolicyFromDB = async () => {
  const privacyPolicy = await PrivacyPolicy.findOne({});
  return privacyPolicy;
};
const updatePrivacyPolicyToDB = async (payload: string) => {
  const result = await PrivacyPolicy.findOneAndUpdate(
    {},
    { content: payload },
    {
      new: true,
    }
  );
  return result;
};
const deletePrivacyPolicyFromDB = async (id: string) => {
  const result = await PrivacyPolicy.findByIdAndDelete(id);
  return result;
};
export const PrivacyPolicyService = {
  createPrivacyPolicyToDB,
  getPrivacyPolicyFromDB,
  updatePrivacyPolicyToDB,
  deletePrivacyPolicyFromDB,
};
