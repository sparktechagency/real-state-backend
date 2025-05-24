import { model, Schema } from "mongoose";
import { IFaq, FaqModel } from "./about.interface";

const aboutSchema = new Schema<IFaq, FaqModel>(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const About = model<IFaq, FaqModel>("About", aboutSchema);
