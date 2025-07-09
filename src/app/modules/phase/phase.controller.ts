import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PhaseService } from "./phase.service";
import sendResponse from "../../../shared/sendResponse";

const createPhase = catchAsync(async (req: Request, res: Response) => {
    const result = await PhaseService.createPhaseIntoDB(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Successfully create Phase",
        data: result
    })
})


const getAllPhase = catchAsync(async (req: Request, res: Response) => {
    const result = await PhaseService.getAllPhaseFromDB()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Successfully retrieve Phase",
        data: result
    })
})

const updatePhase = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await PhaseService.updatePhaseFromDB(id, req.body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Successfully update Phase",
        data: result
    })
})


// delete phase by id
const deletePhase = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await PhaseService.deletePhaseFromDB(id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Successfully delete Phase",
        data: result
    })
})

export const PhaseController = {
    createPhase,
    getAllPhase,
    updatePhase,
    deletePhase
}