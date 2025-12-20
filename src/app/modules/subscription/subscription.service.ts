import { Jwt, JwtPayload } from "jsonwebtoken";
import { Package } from "../package/package.model";
import { ISubscription } from "./subscription.interface";
import { Subscription } from "./subscription.model";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { calculateExpiryDate } from "../../../helpers/calculateExpiryDate";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";

const addSubscriberIntoDB = async (
  payload: ISubscription,
  user: JwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Parallel fetch: user + package
    const [userData, packageData] = await Promise.all([
      User.findById(user.id).select("_id").session(session),
      Package.findOne({ product_id: payload.product_id })
        .select("_id duration")
        .session(session),
    ]);

    if (!userData)
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized user");
    if (!packageData)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Package not found");

    // Check for active subscription
    // Use the package _id from DB to avoid mismatch
    const activeSub = await Subscription.findOne({
      user: user.id,
      package: packageData._id,
      status: "active",
    })
      .select("expiry_date")
      .session(session);

    if (activeSub) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        `You already have an active subscription until ${activeSub.expiry_date!.toLocaleString()}`
      );
    }

    // Calculate expiry date using Date type
    const expiryDate = calculateExpiryDate(
      payload.transaction_date,
      packageData.duration
    );

    // Build subscription object (immutable)
    const subscriptionData: ISubscription = {
      ...payload,
      user: user.id,
      package: packageData._id,
      expiry_date: expiryDate, // Date type
      status: "active",
      transaction_date: payload.transaction_date, // convert to Date
    };

    // Create subscription in transaction (atomic)
    const subscription = await Subscription.create([subscriptionData], {
      session,
    });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return subscription[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    // Duplicate key safe
    if (error.code === 11000) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Active subscription already exists or payment already processed"
      );
    }

    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAllSubscriptionsFromDB = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  const userData = await User.findById(user.id).select("_id");
  if (!userData)
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized user");
  const subscriptions = new QueryBuilder(Subscription.find(), query)
    .filter()
    .sort();
  const data = await subscriptions.modelQuery;
  const meta = await subscriptions.getPaginationInfo();
  return { data, meta };
};

const specipicSubscriberFromDB = async (user: JwtPayload) => {
  const subscription = await Subscription.findById({ user: user.id });
  if (!subscription) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Subscription not found");
  }
  return subscription;
};

export const SubscriptionService = {
  addSubscriberIntoDB,
  getAllSubscriptionsFromDB,
  specipicSubscriberFromDB,
};
