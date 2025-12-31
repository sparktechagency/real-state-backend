import { model, Schema } from "mongoose";
import { ISubscription, SubscriptionModel } from "./subscription.interface";

const subscriptionSchema = new Schema<ISubscription, SubscriptionModel>(
  {
    product_id: {
      type: String,
      required: true,
    },
    purchase_id: {
      type: String,
      required: true,
    },
    transaction_date: {
      type: String,
      required: true,
    },
    expiry_date: {
      type: String,
      required: false,
    },
    platform: {
      type: String,
      enum: ["ios", "android"],
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["apple", "google"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = model<ISubscription, SubscriptionModel>(
  "Subscription",
  subscriptionSchema
);
