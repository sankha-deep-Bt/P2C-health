import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getMessages, sendMessage } from "../controllers/message.controller";

const router = Router();

// Apply auth middleware to all routes in this router
router.use(authenticate);

router.get("/:userToChatId", getMessages);
router.post("/:userToChatId", sendMessage);

export default router;
