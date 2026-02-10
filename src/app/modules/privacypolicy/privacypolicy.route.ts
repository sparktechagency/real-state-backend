import express from "express";
import { PrivacyPolicyController } from "./privacypolicy.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN),
  PrivacyPolicyController.createPrivacyPolicy
);
router.get(
  "/",
  PrivacyPolicyController.getAllPrivacyPolicy
);

export const PrivacyPolicyRoutes = router;
