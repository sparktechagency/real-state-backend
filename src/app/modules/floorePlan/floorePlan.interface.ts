import { Types } from "mongoose";

export type IFloorPlan = {
  apartmentId: Types.ObjectId;
  floorPlan: string;
  price: number;
  badSize: number;
  floorPlanImage: string;
};
