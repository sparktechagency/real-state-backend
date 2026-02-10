import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { AboutController } from "./about.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FaqValidation } from "./about.validation";
const router = express.Router();

router
  .route("/")
  .post(
    validateRequest(FaqValidation.createFaqZodSchema),
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY, USER_ROLES.SUB_ADMIN),
    AboutController.createFaq
  )
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY, USER_ROLES.SUB_ADMIN),
    AboutController.getFaqs
  );

router
  .route("/:id")
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY, USER_ROLES.SUB_ADMIN),
    AboutController.deleteFaq
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY, USER_ROLES.SUB_ADMIN),
    AboutController.updateFaq
  );

export const AboutRoutes = router;
