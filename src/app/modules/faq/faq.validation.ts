import { z } from "zod";

const createFaqZodSchema = z.object({
  body: z.object({
    question: z.string({ required_error: "question is required" }),
    ans: z.string({ required_error: "ans is required" }),
  }),
});

export const FaqValidation = {
  createFaqZodSchema,
};
