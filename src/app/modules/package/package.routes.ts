import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { PackageController } from "./package.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
const router = express.Router();

router.route("/").post(
  fileUploadHandler(),
  auth(USER_ROLES.SUPER_ADMIN),
  // validateRequest(PackageValidation.createPackageZodSchema),
  PackageController.createPackage
);
router.get(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY),
  PackageController.getPackage
);

router.patch(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN),
  PackageController.editPackage
);

export const PackageRoutes = router;
