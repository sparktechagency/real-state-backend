import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { About } from "./about.model";
import mongoose from "mongoose";
import { IAbout } from "./about.interface";

const createAboutToDB = async (payload: IAbout): Promise<IAbout> => {
  const existingData = await About.findOne({});

  if (!existingData) {
    const newAbout = await About.create(payload);
    if (!newAbout) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create About");
    }
    return newAbout;
  } else {
    const updatedAbout = await About.findByIdAndUpdate(
      existingData._id,
      payload,
      { new: true }
    );
    if (!updatedAbout) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update About");
    }
    return updatedAbout;
  }
};
const AboutFromDB = async (): Promise<IAbout> => {
  const about = await About.findOne({});
  if (!about) {
    throw new ApiError(StatusCodes.NOT_FOUND, "About data not found");
  }
  return about;
};

const deleteAboutToDB = async (id: string): Promise<IAbout | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  await About.findByIdAndDelete(id);
  return;
};

const updateAboutToDB = async (
  id: string,
  payload: IAbout
): Promise<IAbout> => {
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
