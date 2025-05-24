import { model, Schema } from "mongoose";
import { IFaq, FaqModel } from "./faq.interface";

const faqSchema = new Schema<IFaq, FaqModel>(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Faq = model<IFaq, FaqModel>("Faq", faqSchema);
