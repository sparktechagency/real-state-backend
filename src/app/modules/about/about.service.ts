import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IFaq } from "./about.interface";
import { About } from "./about.model";
import mongoose from "mongoose";

const createAboutToDB = async (payload: IFaq): Promise<IFaq> => {
  const faq = await About.create(payload);
  if (!faq) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Faq");
  }

  return faq;
};

const AboutFromDB = async (): Promise<IFaq[]> => {
  const faqs = await About.find({});
  return faqs;
};

const deleteAboutToDB = async (id: string): Promise<IFaq | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  await About.findByIdAndDelete(id);
  return;
};

const updateAboutToDB = async (id: string, payload: IFaq): Promise<IFaq> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const updatedAbout = await About.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!updatedAbout) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to updated Faq");
  }

  return updatedAbout;
};

export const AboutService = {
  createAboutToDB,
  AboutFromDB,
  deleteAboutToDB,
  updateAboutToDB,
};
