import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { apartmentRouter } from "../modules/appartment/appartment.routes";
import { FloorePlanRoutes } from "../modules/floorePlan/floorePlan.routes";
const router = express.Router();

const apiRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/apartment", route: apartmentRouter },
  { path: "/floor", route: FloorePlanRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
