import express from "express";
import { PrivacyPolicyController } from "./privacypolicy.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLES.SUPER_ADMIN),
  PrivacyPolicyController.createPrivacyPolicy
);
router.get(
  "/",
  auth(USER_ROLES.AGENCY, USER_ROLES.SUPER_ADMIN),
  PrivacyPolicyController.getAllPrivacyPolicy
);

export const PrivacyPolicyRoutes = router;
