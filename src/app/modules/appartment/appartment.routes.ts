import { Router } from "express";
import { apartmentController } from "./appartment.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { parseEmbeddedJson } from "./apartment.parseEmbeddedJson";
import { handleApartmentPayload } from "./apartment.handleApartmentPayload ";

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

export const apartmentRouter = router;
