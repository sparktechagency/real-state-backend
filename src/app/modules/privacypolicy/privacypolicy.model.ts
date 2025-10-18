import { Schema, model } from "mongoose";
import { IPrivacyPolicy, PrivacyPolicyModel } from "./privacypolicy.interface";

const PrivacyPolicySchema = new Schema<IPrivacyPolicy, PrivacyPolicyModel>({
  text: {
    type: String,
    required: true,
  },
});

export const PrivacyPolicy = model<IPrivacyPolicy, PrivacyPolicyModel>(
  "PrivacyPolicy",
  PrivacyPolicySchema
);
