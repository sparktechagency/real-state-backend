import { model, Schema } from "mongoose";
import { IFloorPlan } from "./floorePlan.interface";

const floorPlanSchema = new Schema<IFloorPlan>(
  {
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    floorPlan: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    badSize: {
      type: Number,
      required: true,
    },
    floorPlanPDF: {
      type: String,
      required: true,
    },
    seeView: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const FloorPlan = model<IFloorPlan>("FloorPlan", floorPlanSchema);
