import { Types } from "mongoose"

export type IPhase = {
    apartment: Types.ObjectId;
    phase: "Q1" | "Q2" | "Q3" | "Q4";
    date: string
}