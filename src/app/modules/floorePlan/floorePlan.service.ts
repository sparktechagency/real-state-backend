import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IFloorPlan } from "./floorePlan.interface";
import { FloorPlan } from "./floorePlan.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createFloorPlan = async (payload: IFloorPlan): Promise<IFloorPlan> => {
  const result = await FloorPlan.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create floor plan");
  }
  return result;
};

const getAllFlans = async (query: Record<string, any>) => {
  const queryBuilder = new QueryBuilder(FloorPlan.find(), query)
    .filter()
    .search(["floorPlan"])
    .sort()
    .paginate()
    .fields()
    .populate(["apartmentId"], { apartmentId: "" });

  const result = await queryBuilder.modelQuery;
  const paginationInfo = await queryBuilder.getPaginationInfo();

  return {
    meta: paginationInfo,
    data: result,
  };
};

const getSingleFloorPlan = async (id: string): Promise<IFloorPlan | null> => {
  const result = await FloorPlan.findById(id).populate("apartmentId");
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Have no Floor Plan");
  }
  return result;
};
export const FloorPlanService = {
  createFloorPlan,
  getAllFlans,
  getSingleFloorPlan,
};
