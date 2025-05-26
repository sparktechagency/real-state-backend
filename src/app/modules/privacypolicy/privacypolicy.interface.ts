import { Model } from "mongoose";

export type IPrivacyPolicy = {
  text: string;
};

export type PrivacyPolicyModel = Model<IPrivacyPolicy>;
