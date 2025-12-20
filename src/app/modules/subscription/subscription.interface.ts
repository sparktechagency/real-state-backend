import { Model, Types } from "mongoose";

export type ISubscription = {
  product_id: string;
  purchase_id: string;
  transaction_date: string;
  expiry_date?: string;
  platform: "ios" | "android";
  receipt: string;
  source: "apple" | "google";
  status: "active" | "cancelled";
  package: Types.ObjectId;
  user: Types.ObjectId;
};

export type SubscriptionModel = Model<ISubscription, Record<string, unknown>>;
