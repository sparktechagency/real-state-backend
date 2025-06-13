import { z } from "zod";

const createPhaseZodSchema = z.object({
    body: z.object({
        apartment: z.string({ required_error: "Project id is required" }),
        phase: z.string({ required_error: 'phase is required' }),
        date: z.string({
            required_error: "date is required",
        })
    })
})
const updatePhaseZodSchema = z.object({
    body: z.object({
        apartment: z.string({ required_error: "Project id is required" }).optional(),
        phase: z.string({ required_error: 'phase is required' }).optional(),
        date: z.string({
            required_error: "date is required",
        }).optional()
    })
})




export const PhaseValidation = {
    createPhaseZodSchema,
    updatePhaseZodSchema
}