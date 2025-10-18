import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();
router.get(
  "/statistics",
  auth(USER_ROLES.SUPER_ADMIN),
  DashboardController.getDashboardStatistic
);
router.get(
  "/agency",
  auth(USER_ROLES.SUPER_ADMIN),
  DashboardController.getAgencyBaseOnMonth
);
router.get(
  "/total-subscriber",
  auth(USER_ROLES.SUPER_ADMIN),
  DashboardController.getTotalSubscriber
);
router.get(
  "/subscriber/:id",
  auth(USER_ROLES.SUPER_ADMIN),
  DashboardController.getSingleSubscriber
);

router.delete(
  "/subscriber/:id",
  auth(USER_ROLES.SUPER_ADMIN),
  DashboardController.deleteSubscriber
);

export const DashboardRoutes = router;
