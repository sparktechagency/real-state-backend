import { z } from "zod";

const createFaqZodSchema = z.object({
  body: z.object({
    text: z.string({ required_error: "text is required" }),
  }),
});

export const FaqValidation = {
  createFaqZodSchema,
};
