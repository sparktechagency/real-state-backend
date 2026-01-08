import { IPackage } from "../app/modules/package/package.interface";
import stripe from "../config/stripe";
import config from "../config";
import ApiError from "../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Package } from "../app/modules/package/package.model";

export const updateSubscriptionProduct = async (
  existing: IPackage,
  updates: Partial<IPackage>
): Promise<{ paymentLink?: string }> => {
  const titleChanged = updates.title && updates.title !== existing.title;
  const priceChanged = updates.price && updates.price !== existing.price;
  const durationChanged =
    updates.duration && updates.duration !== existing.duration;

  if (!titleChanged && !priceChanged && !durationChanged) return {};
  // @ts-ignore
  if (titleChanged && existing.stripeProductId) {
    try {
      // @ts-ignore
      await stripe.products.update(existing.stripeProductId, {
        name: updates.title!,
      });
    } catch (error) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to update product name in Stripe"
      );
    }
  }

  if (priceChanged || durationChanged) {
    // @ts-ignore
    if (!existing.stripeProductId) {
      const product = await stripe.products.create({
        name: existing.title,
      });

      await Package.findByIdAndUpdate(existing._id, {
        stripeProductId: product.id,
      });
// @ts-ignore
      existing.stripeProductId = product.id;
    }

    const interval = updates.duration === "1 year" ? "year" : "month";

    try {
      const price = await stripe.prices.create({
        // @ts-ignore
        product: existing.stripeProductId,
        unit_amount: Number(updates.price || existing.price) * 100,
        currency: "usd",
        recurring: {
          interval,
          interval_count: 1,
        },
      });

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
          type: "redirect",
          redirect: { url: config.stripe.paymentSuccess! },
        },
        // @ts-ignore
        metadata: { productId: existing.stripeProductId },
      });

      if (!paymentLink.url) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Failed to create payment link"
        );
      }

      return { paymentLink: paymentLink.url };
    } catch (error) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to create price or payment link in Stripe"
      );
    }
  }

  return {};
};
