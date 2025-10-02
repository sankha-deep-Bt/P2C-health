import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createGroupChatHandler,
  deleteGroupChatHandler,
  getUserChatsHandler,
  leaveGroupChatHandler,
  sendGroupMessageHandler,
} from "../controllers/chat.controller";

const router = Router();

router.use(authenticate);

router.post("/create-group", createGroupChatHandler);
router.get("/", getUserChatsHandler);
router.post("/:chatId/message", sendGroupMessageHandler);
router.delete("/:chatId", deleteGroupChatHandler);
router.put("/:chatId/leave", leaveGroupChatHandler);


export default router;
