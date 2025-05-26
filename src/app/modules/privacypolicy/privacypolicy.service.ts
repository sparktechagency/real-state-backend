import { PrivacyPolicy } from "./privacypolicy.model";

const createPrivacyPolicyToDB = async (payload: string) => {
  const privacyPolicy = await PrivacyPolicy.create(payload);
  if (!privacyPolicy) {
    throw new Error("Failed to created Privacy policy");
  }
};
const getPrivacyPolicyFromDB = async () => {
  const privacyPolicy = await PrivacyPolicy.find({});
  return privacyPolicy;
};
// const updatePrivacyPolicyToDB = async (id: string, payload: string) => {
const updatePrivacyPolicyToDB = async (payload: string) => {
  const result = await PrivacyPolicy.findOneAndUpdate({}, { content: payload }, {
    new: true,
  });
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
