import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();


router.get("/all-user-list", auth(USER_ROLES.SUPER_ADMIN), adminController.getAllUser);

export const adminRoutes = router;