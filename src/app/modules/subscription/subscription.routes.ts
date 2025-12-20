import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { SubscriptionController } from "./subscription.controller";
const router = express.Router();

router
  .route("/user")
  .post(auth(USER_ROLES.AGENCY), SubscriptionController.subscriptions)
  .get(
    auth(USER_ROLES.SUPER_ADMIN),
    SubscriptionController.getAllSubscriptions
  );

router
  .route("/subscribe/data")
  .get(
    auth(USER_ROLES.SUPER_ADMIN),
    SubscriptionController.getSpecificSubscriber
  );
export const SubscriptionRoutes = router;
