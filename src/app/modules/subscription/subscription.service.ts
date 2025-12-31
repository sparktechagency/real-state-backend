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
import verifyAndroidSubscription from "../../../util/androidPublisher.utils";
import verifyIosSubscription from "../../../util/verifyIosSubscription";

const addSubscriberIntoDB = async (
  payload: ISubscription,
  user: JwtPayload
) => {
  const session = await mongoose.startSession();
  let subscription: any;

  try {
    await session.withTransaction(async () => {
      let verifiedExpiryDate: Date | null = null;

      // VERIFY SUBSCRIPTION
      if (payload.platform === "android") {
        const result = await verifyAndroidSubscription(
          payload.product_id,
          payload.receipt
        );

        if (!result.valid || !result.expiryDate) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Invalid Android subscription"
          );
        }

        verifiedExpiryDate = result.expiryDate;
      } else if (payload.platform === "ios") {
        const result = await verifyIosSubscription(
          payload.receipt,
          payload.product_id
        );
        console.log("IOS VERIFICATION RESULT:", result);

        if (!result.valid || !result.expiryDate) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Invalid iOS subscription"
          );
        }

        verifiedExpiryDate = result.expiryDate;
      } else {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Unsupported platform");
      }

      // FETCH USER & PACKAGE
      const [userData, packageData] = await Promise.all([
        User.findById(user.id).select("_id").session(session),
        Package.findOne({ product_id: payload.product_id })
          .select("_id")
          .session(session),
      ]);

      if (!userData)
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized user");

      if (!packageData)
        throw new ApiError(StatusCodes.BAD_REQUEST, "Package not found");

      // CHECK ACTIVE SUBSCRIPTION
      const activeSub = await Subscription.findOne({
        user: userData._id,
        package: packageData._id,
        status: "active",
      }).session(session);

      if (activeSub) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "You already have an active subscription"
        );
      }

      // SAVE SUBSCRIPTION (STORE VERIFIED EXPIRY)
      subscription = await new Subscription({
        ...payload,
        user: user.id,
        package: packageData._id,
        expiry_date: verifiedExpiryDate.toISOString(),
        status: "active",
        source: payload.platform === "android" ? "google" : "apple",
      }).save({ session });

      // UPDATE USER
      await User.findByIdAndUpdate(user.id, { isSubscribe: true }, { session });
    });

    return subscription;
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

const mySubscriptionPackageIntoDB = async (user: JwtPayload) => {
  const subscription = await Subscription.findOne({ user: user.id }).populate(
    "package"
  );
  if (!subscription) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Subscription not found");
  }
  return subscription;
};

export const SubscriptionService = {
  addSubscriberIntoDB,
  getAllSubscriptionsFromDB,
  specipicSubscriberFromDB,
  mySubscriptionPackageIntoDB,
};
