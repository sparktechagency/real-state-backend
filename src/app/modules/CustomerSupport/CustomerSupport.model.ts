import { model, Schema } from "mongoose";
import { ICustomerSupport } from "./CustomerSupport.interface";

const CustomerSupport = new Schema<ICustomerSupport>(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CustomerSupportModel = model("CustomerSupport", CustomerSupport);
