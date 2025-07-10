import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPhase } from "./phase.interface";
import { Phase } from "./phase.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { query } from "express";
import { SendResponse } from "firebase-admin/lib/messaging/messaging-api";

const createPhaseIntoDB = async (payload: IPhase) => {
  const result = await Phase.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create phase");
  }
  return result;
};

const getAllPhaseFromDB = async (
  query: Record<string, any>
): Promise<SendResponse> => {
  const queryBuilder = new QueryBuilder(Phase.find(), query)
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await queryBuilder.modelQuery;
  const pagination = await queryBuilder.getPaginationInfo();

  return {
    // @ts-ignore
    meta: pagination,
    data: result,
  };
};

const updatePhaseFromDB = async (id: string, payload: Partial<IPhase>) => {
  const result = await Phase.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update phase");
  }
  return result;
};

// delete phase by id
const deletePhaseFromDB = async (id: string) => {
  const result = await Phase.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found");
  }
  return result;
};

export const PhaseService = {
  createPhaseIntoDB,
  getAllPhaseFromDB,
  updatePhaseFromDB,
  deletePhaseFromDB,
};
