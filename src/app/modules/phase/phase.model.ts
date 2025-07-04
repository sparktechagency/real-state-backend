import { model, Schema } from "mongoose";
import { IPhase } from "./phase.interface";

const phaseSchema = new Schema<IPhase>({
    apartment: {
        type: Schema.Types.ObjectId,
        required: true
    },
    phase: {
        type: String,
        enum: ["Q1", "Q2", "Q3", "Q4"],
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})
export const Phase = model('Phase', phaseSchema);