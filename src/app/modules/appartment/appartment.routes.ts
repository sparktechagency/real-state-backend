import { Router } from "express";
import { apartmentController } from "./appartment.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { parseEmbeddedJson } from "./apartment.parseEmbeddedJson";
import { handleApartmentPayload } from "./apartment.handleApartmentPayload ";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();
router.post(
  "/create",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN),
  fileUploadHandler(),
  parseEmbeddedJson(["contact"]),
  handleApartmentPayload,
  apartmentController.createApartment
);

// get all apartments
router.get("/", apartmentController.getAllApartment);
router.get("/location", apartmentController.getAllApartmentLocation);
router.get("/location-property-type", apartmentController.getLocationPropertyType);
// get single apartment
router.get("/:id", apartmentController.getSingleOne);

// update apartment
router.patch(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN),
  fileUploadHandler(),
  handleApartmentPayload,
  parseEmbeddedJson(["contact"]),

  apartmentController.updateApartmentDetails
);



// delete apartment
router.delete(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN),
  apartmentController.deleteApartment
);

export const apartmentRouter = router;
