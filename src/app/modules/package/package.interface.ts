import { Model, Types } from "mongoose";

export type IPackage = {
  _id?: Types.ObjectId;
  title: string;
  description: string[];
  price: number;
  duration: "1 month" | "1 year";
  paymentType: "Monthly" | "Yearly";
  paymentLink?: string;
  status: "Active" | "Delete";
  stripeProductId?: string;
  priceId?: string;
};

export type PackageModel = Model<IPackage, Record<string, unknown>>;
