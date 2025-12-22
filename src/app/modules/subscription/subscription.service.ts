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
  let subscription: any;

  try {
    await session.withTransaction(async () => {
      // Fetch user and package
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

      const activeSub = await Subscription.findOne({
        user: userData?._id,
        package: packageData._id,
        status: "active",
      })
        .select("expiry_date")
        .session(session);

      if (activeSub) {
        const expiry = activeSub.expiry_date
          ? new Date(activeSub.expiry_date).toLocaleString()
          : "unknown";
        throw new ApiError(
          StatusCodes.CONFLICT,
          `You already have an active subscription until ${expiry}`
        );
      }

      //  Calculate expiry date
      const expiryDate = calculateExpiryDate(
        payload.transaction_date,
        packageData.duration
      );

      const subscriptionData: ISubscription = {
        ...payload,
        user: user.id,
        package: packageData._id,
        expiry_date: expiryDate,
        status: "active",
        transaction_date: payload.transaction_date,
      };

      // Create subscription safely
      subscription = await new Subscription(subscriptionData).save({ session });

      // Update user
      await User.findByIdAndUpdate(
        user.id,
        { $set: { isSubscribe: true } },
        { session }
      );
    });

    return subscription;
  } catch (err: any) {
    if (err.code === 11000) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Active subscription already exists or payment already processed"
      );
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  } finally {
    session.endSession();
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
  const subscription = await Subscription.findOne({ user: user.id });
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
