import { Router } from "express";
import { FloorePlanController } from "./floorePlan.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getSingleFilePath } from "../../../shared/getFilePath";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();
router.post(
  "/create",
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  (req, res, next) => {
    try {
      const floorPlanPDF = getSingleFilePath(req.files, "floorPlanPDF");
      if (!floorPlanPDF) {
        return res
          .status(400)
          .json({ success: false, message: "Floor plan image is required." });
      }

      req.body.floorPlanPDF = floorPlanPDF;
      next();
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to upload image" });
    }
  },
  FloorePlanController.createFloorePlan
);

router.get(
  "/filter",
  auth(USER_ROLES.AGENCY, USER_ROLES.SUPER_ADMIN),
  FloorePlanController.getLocationPropertyTypeSalesCompanyCompletionYear
);

router.get(
  "/",
  auth(USER_ROLES.AGENCY, USER_ROLES.SUPER_ADMIN),
  FloorePlanController.getAllFloorePlan
);
router.get(
  "/:id",
  auth(USER_ROLES.AGENCY, USER_ROLES.SUPER_ADMIN),
  FloorePlanController.getSingleFloor
);


router.patch("/:id", auth(USER_ROLES.SUPER_ADMIN), FloorePlanController.updateFloorePlan);

export const FloorePlanRoutes = router;
