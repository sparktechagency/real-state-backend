import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { PackageController } from "./package.controller";
const router = express.Router();

router
  .route("/")
  .post(auth(USER_ROLES.SUPER_ADMIN), PackageController.createPackage)
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY),
    PackageController.getPackage
  );

router
  .route("/admin")
  .get(auth(USER_ROLES.SUPER_ADMIN), PackageController.getAllPackageForAdmin);

// edit package
router
  .route("/:id")
  .patch(auth(USER_ROLES.SUPER_ADMIN), PackageController.editPackage);

export const PackageRoutes = router;
