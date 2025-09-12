import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createGroupChatHandler,
  getUserChatsHandler,
  sendGroupMessageHandler,
} from "../controllers/chat.controller";

const router = Router();

router.post("/group", authenticate, createGroupChatHandler);
router.get("/", authenticate, getUserChatsHandler);
router.post("/:chatId/message", authenticate, sendGroupMessageHandler);

export default router;
