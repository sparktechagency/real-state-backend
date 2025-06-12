import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { apartmentRouter } from "../modules/appartment/appartment.routes";
import { FloorePlanRoutes } from "../modules/floorePlan/floorePlan.routes";
import { PackageRoutes } from "../modules/package/package.routes";
import { FaqRoutes } from "../modules/faq/faq.route";
import { AboutRoutes } from "../modules/about/about.route";
import { PrivacyPolicyRoutes } from "../modules/privacypolicy/privacypolicy.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { customerSupportRouter } from "../modules/CustomerSupport/CustomerSupport.routes";
const router = express.Router();

const apiRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/apartment", route: apartmentRouter },
  { path: "/floor", route: FloorePlanRoutes },
  { path: "/package", route: PackageRoutes },
  { path: "/faq", route: FaqRoutes },
  { path: "/about", route: AboutRoutes },
  { path: "/privacy-policy", route: PrivacyPolicyRoutes },
  { path: "/dashboard", route: DashboardRoutes },
  { path: "/customer-support", route: customerSupportRouter },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
