import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { customerSupportController } from "./CustomerSupport.controller";

const router = Router();
router.post(
  "/",
  auth(USER_ROLES.SUPER_ADMIN),
  customerSupportController.createCustomerSupport
);
// get All
router.get(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY),
  customerSupportController.getAllSupportInfo
);

export const customerSupportRouter = router;
