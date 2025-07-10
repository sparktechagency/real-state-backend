import { Router } from "express";
import { FloorePlanController } from "./floorePlan.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getSingleFilePath } from "../../../shared/getFilePath";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();
/**
 * @route POST /floorePlan/create
 * @desc Create a new floor plan
 * @access Private
 */
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

/**
 * @route GET /floorePlan/filter
 * @desc Get all location / property type / sales company / completion year
 * @access Private
 */

router.get(
  "/filter",
  auth(USER_ROLES.AGENCY, USER_ROLES.SUPER_ADMIN),
  FloorePlanController.getLocationPropertyTypeSalesCompanyCompletionYear
);
/**
 * @route GET /floorePlan
 *  @desc Get all floor plans
 * @access Private
 * @param {string} apartmentId - Optional query parameter to filter by apartment ID
 */

router.get(
  "/",
  auth(USER_ROLES.AGENCY, USER_ROLES.SUPER_ADMIN),
  FloorePlanController.getAllFloorePlan
);
// 

// Get floor plans by apartment ID
router.get(
  "/apartment/:apartmentId",
  FloorePlanController.getFloorsByApartmentId
);

router.patch(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  (req, res, next) => {
    try {
      const floorPlanPDF = getSingleFilePath(req.files, "floorPlanPDF");
      req.body.floorPlanPDF = floorPlanPDF;
      next();
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to upload image" });
    }
  },
  FloorePlanController.updateFloorePlan
);

router.delete(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN),
  FloorePlanController.deleteFloorePlan
);

export const FloorePlanRoutes = router;
