import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import ApiError from "../errors/ApiErrors";
import stripe from "../config/stripe";
import { User } from "../app/modules/user/user.model";
import { Package } from "../app/modules/package/package.model";
import { Subscription } from "../app/modules/subscription/subscription.model";

export const handleSubscriptionCreated = async (data: Stripe.Subscription) => {
  // Retrieve the subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(data.id);

  // Retrieve the customer associated with the subscription
  const customer = (await stripe.customers.retrieve(
    subscription.customer as string
  )) as Stripe.Customer;

  // Extract the price ID from the subscription items
  const priceId = subscription.items.data[0]?.price?.id;
  // Retrieve the invoice to get the transaction ID and amount paid
  const invoice = await stripe.invoices.retrieve(
    subscription.latest_invoice as string
  );

  const trxId = invoice?.payment_intent;
  const amountPaid = invoice?.total / 100;

  if (customer?.email) {
    const existingUser = await User.findOne({ email: customer?.email });

    if (existingUser) {
      // Find the pricing plan by priceId
      const pricingPlan = await Package.findOne({ priceId });

      if (pricingPlan) {
        // Find the current active subscription
        const currentActiveSubscription = await Subscription.findOne({
          user: existingUser._id,
          status: "active",
        });

        if (currentActiveSubscription) {
          console.log("User already has an active subscription!");
          return;
        }

        // Create a new subscription record
        const newSubscription = new Subscription({
          user: existingUser._id,
          customerId: customer?.id,
          package: pricingPlan._id,
          price: amountPaid,
          trxId,
          subscriptionId: subscription.id,
          currentPeriodStart: new Date(
            subscription.current_period_start * 1000
          ).toISOString(),
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          remaining: pricingPlan.duration === "1 year" ? 365 : 30,
          status: "active",
        });

        await newSubscription.save();

        // Update the user to reflect the active subscription
        await User.findByIdAndUpdate(
          existingUser._id,
          {
            isSubscribed: true,
            hasAccess: true,
          },
          { new: true }
        );
      } else {
        console.error("Pricing plan not found!");
        return;
      }
    } else {
      console.error("User not found!");
      return;
    }
  } else {
    console.error("Customer email not found!");
    return;
  }
};
