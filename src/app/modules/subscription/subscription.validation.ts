import { z } from "zod";

const createSubscriptionZod = z.object({
  body: z.object({
    product_id: z.string({
      required_error: "Package ID is required",
    }),
    purchase_id: z.string({
      required_error: "Purchase ID is required",
    }),
    transaction_date: z.string({
      required_error: "Transaction date is required",
    }),
    expiry_date: z
      .string({
        required_error: "Expiry date is required",
      })
      .optional(),
    platform: z.string({
      required_error: "Platform is required",
    }),
    receipt: z.string({
      required_error: "Receipt is required",
    }),
    source: z.string({
      required_error: "Source is required",
    }),
  }),
});
export const SubscriptionValidation = {
  createSubscriptionZod,
};
