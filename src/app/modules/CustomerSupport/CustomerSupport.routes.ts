import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { customerSupportController } from "./CustomerSupport.controller";

const router = Router();
// router.post(
//   "/",
//   auth(USER_ROLES.SUPER_ADMIN),
//   customerSupportController.createCustomerSupport
// );
// // get All
// router.get("/", customerSupportController.getAllSupportInfo);
router
  .route("/")
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY),
    customerSupportController.createCustomerSupport
  )
  .get(customerSupportController.getAllSupportInfo);

export const customerSupportRouter = router;
