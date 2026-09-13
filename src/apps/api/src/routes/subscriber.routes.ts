import { Router } from "express";
import { subscribe, unsubscribe } from "../controllers/subscriber.controller";
import { subscribeLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/", subscribeLimiter, subscribe);
router.get("/unsubscribe", unsubscribe);

export default router;
