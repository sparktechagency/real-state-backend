import { Router } from "express";
import { PushNotificationController } from "./pushnotification.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();
// create push notification

router.post("/create", auth(USER_ROLES.SUPER_ADMIN), PushNotificationController.createPushNotification);

export const PushNotificationRoutes = router;