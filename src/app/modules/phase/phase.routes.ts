import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { PhaseController } from "./phase.controller";
import { PhaseValidation } from "./phase.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router()
router.post("/create", auth(USER_ROLES.SUPER_ADMIN), validateRequest(PhaseValidation.createPhaseZodSchema), PhaseController.createPhase)
router.get("/", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.AGENCY), PhaseController.getAllPhase)
router.patch("/:id", auth(USER_ROLES.SUPER_ADMIN), validateRequest(PhaseValidation.updatePhaseZodSchema), PhaseController.updatePhase)
export const PhaseRouter = router;