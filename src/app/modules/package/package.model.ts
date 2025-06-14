import { model, Schema } from "mongoose"; 
import { IPackage, PackageModel } from "./package.interface"; 

const packageSchema = new Schema<IPackage, PackageModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      enum: ["1 month", "1 year"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["Monthly", "Yearly"],
      required: true,
    },
    paymentLink: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Delete"],
      default: "Active",
    },
    stripeProductId: {
      type: String,
      required: false,
    },
    priceId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
); 

export const Package = model<IPackage, PackageModel>("Package", packageSchema);
