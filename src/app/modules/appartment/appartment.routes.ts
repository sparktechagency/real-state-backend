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
  fileUploadHandler(),
  parseEmbeddedJson(["contact", "features"]),
  handleApartmentPayload,
  apartmentController.createApartment
);

router.get("/", apartmentController.getAllApartment);
router.get("/:id", apartmentController.getSingleOne);

router.delete(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN),
  apartmentController.deleteApartment
);

export const apartmentRouter = router;
