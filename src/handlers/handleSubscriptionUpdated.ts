import Stripe from "stripe";
import stripe from "../config/stripe";
import { User } from "../app/modules/user/user.model";
import { Subscription } from "../app/modules/subscription/subscription.model";
import { Package } from "../app/modules/package/package.model";
export const handleSubscriptionUpdated = async (data: Stripe.Subscription) => {
  // Retrieve the subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(data.id);

  // Retrieve the customer associated with the subscription
  const customer = (await stripe.customers.retrieve(
    subscription.customer as string
  )) as Stripe.Customer;

  // Extract price ID from subscription items
  const priceId = subscription.items.data[0]?.price?.id;

  // Retrieve the invoice to get the transaction ID and amount paid
  const invoice = await stripe.invoices.retrieve(
    subscription.latest_invoice as string
  );

  const trxId = invoice?.payment_intent;
  const amountPaid = invoice?.total / 100;

  if (customer?.email) {
    // Find the user by email
    const existingUser = await User.findOne({ email: customer?.email });

    if (existingUser) {
      // Find the pricing plan by priceId
      const pricingPlan = await Package.findOne({ priceId });

      if (pricingPlan) {
        // Find the current active subscription
        const currentActiveSubscription = await Subscription.findOne({
          user: existingUser?._id,
          status: "active",
        });

        if (currentActiveSubscription) {
          if (
            currentActiveSubscription?.package.toString() !==
            pricingPlan._id.toString()
          ) {
            // Deactivate the old subscription
            await Subscription.findByIdAndUpdate(
              currentActiveSubscription._id,
              { status: "deactivated" },
              { new: true }
            );

            // Create a new subscription
            const newSubscription = new Subscription({
              userId: existingUser._id,
              customerId: customer?.id,
              packageId: pricingPlan._id,
              status: "active",
              trxId,
              amountPaid,
            });

            await newSubscription.save();
          }
        } else {
          // If no active subscription found, check for a deactivated one with the same priceId
          const deactivatedSubscription = await Subscription.findOne({
            user: existingUser._id,
            status: "deactivated",
          });

          if (deactivatedSubscription) {
            await Subscription.findByIdAndUpdate(
              deactivatedSubscription._id,
              { status: "active" },
              { new: true }
            );
          }
        }
      } else {
        // throw new ApiError(StatusCodes.NOT_FOUND, `Pricing plan with Price ID: ${priceId} not found!`);

        console.log(`Pricing plan with Price ID: ${priceId} not found!`);
        return;
      }
    } else {
      console.log(`User with Email: ${customer.email} not found!`);
      return;
    }
  } else {
    console.log("No email found for the customer!");
    return;
  }
};
