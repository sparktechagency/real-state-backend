import { Types } from "mongoose"

export type IPhase = {
    apartment: Types.ObjectId;
    phase: string;
    date: Date
}