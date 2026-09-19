import { Router } from "express";
import { subscribe, unsubscribe, unsubscribeConfirm } from "../controllers/subscriber.controller";
import { subscribeLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/", subscribeLimiter, subscribe);
// GET = confirmation page only; POST performs the deletion (see controller).
router.get("/unsubscribe", unsubscribeConfirm);
router.post("/unsubscribe", unsubscribe);

export default router;
