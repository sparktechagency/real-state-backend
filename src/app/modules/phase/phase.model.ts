import { model, Schema } from "mongoose";
import { IPhase } from "./phase.interface";

const phaseSchema = new Schema<IPhase>({
    apartment: {
        type: Schema.Types.ObjectId,
        required: true
    },
    phase: {
        type: String,
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