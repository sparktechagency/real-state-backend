import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPhase } from "./phase.interface";
import { Phase } from "./phase.model";

const createPhaseIntoDB = async (payload: IPhase) => {
    const result = await Phase.create(payload)
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create phase")
    }
    return result
}


const getAllPhaseFromDB = async () => {
    const result = await Phase.find();
    if (!result) {
        return []
    }
    return result
}


const updatePhaseFromDB = async (id: string, payload: Partial<IPhase>) => {
    const result = await Phase.findByIdAndUpdate(id, payload, { new: true })
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update phase")
    }
    return result
}



// delete phase by id
const deletePhaseFromDB = async (id: string) => {
    const result = await Phase.findByIdAndDelete(id)
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete phase")
    }
    return result
}

export const PhaseService = {
    createPhaseIntoDB,
    getAllPhaseFromDB,
    updatePhaseFromDB,
    deletePhaseFromDB
}