import { Model, Types } from "mongoose";

export type IPackage = {
  _id?: Types.ObjectId;
  title: string;
  description: string[];
  price: number;
  duration: "1 month" | "1 year";
  paymentType: "Monthly" | "Yearly";
  status: "Active" | "Delete";
  product_id: string;
  disable: boolean;
};

export type PackageModel = Model<IPackage, Record<string, unknown>>;
