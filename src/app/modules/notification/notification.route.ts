import express from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

// 🔹 Fetch notifications for the logged-in user
router.get(
  "/all",
  auth(USER_ROLES.AGENCY, USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN),
  NotificationController.getNotifications
);

// 🔹 Admin can fetch notifications for a specific user
router.get(
  "/:userId",
  auth(USER_ROLES.AGENCY, USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN),
  NotificationController.getNotificationsForUser
);

router.patch(
  "/:notificationId",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY, USER_ROLES.SUB_ADMIN),
  NotificationController.markNotificationAsRead
);
export const NotificationRoutes = router;
