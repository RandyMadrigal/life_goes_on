import { Router } from "express";
import subscriberRoutes from "./subscriber.routes";
import quotesRoutes from "./quotes.routes";
import moodsRoutes from "./moods.routes";
import adminRoutes from "./admin.routes";
import jobsRoutes from "./jobs.routes";

const router = Router();

router.use("/subscribe", subscriberRoutes);
router.use("/quotes", quotesRoutes);
router.use("/moods", moodsRoutes);
router.use("/admin", adminRoutes);
router.use("/internal/jobs", jobsRoutes);

export default router;
