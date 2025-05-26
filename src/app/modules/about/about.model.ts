import { model, Schema } from "mongoose";
import { AboutModel, IAbout } from "./about.interface";

const aboutSchema = new Schema<IAbout, AboutModel>(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const About = model<IAbout, AboutModel>("About", aboutSchema);
