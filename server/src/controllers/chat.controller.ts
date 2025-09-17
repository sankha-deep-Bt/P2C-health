import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import {
  createGroupChat,
  findUserChats,
  addMessageToChat,
  findChatById,
  deleteChatById,
  updateChat,
} from "../services/chat.services";

// Create a group chat
export const createGroupChatHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, members } = req.body;
    const creatorId = req.user?.userId;

    if (!creatorId) return res.status(401).json({ message: "Unauthorized" });
    if (!name || !members || members.length < 2) {
      return res
        .status(400)
        .json({ message: "Group must have a name and at least 2 members" });
    }

    const chat = await createGroupChat(
      name,
      [...members, creatorId],
      creatorId
    );
    return res.status(201).json({ success: true, data: chat });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating group chat",
      error: (error as Error).message,
    });
  }
};

// Get all chats for logged-in user
export const getUserChatsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const chats = await findUserChats(userId);
    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching chats",
      error: (error as Error).message,
    });
  }
};

// Send message in a group chat
export const sendGroupMessageHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const senderId = req.user?.userId;
    const { chatId } = req.params;
    const { content } = req.body;

    if (!senderId) return res.status(401).json({ message: "Unauthorized" });
    if (!content)
      return res.status(400).json({ message: "Message content is required" });

    const message = await addMessageToChat(chatId, senderId, content);
    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    return res.status(500).json({
      message: "Error sending message",
      error: (error as Error).message,
    });
  }
};

export const deleteGroupChatHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.userId;
    const chat = await findChatById(chatId);
    const message = !chatId ? "Chat ID is required" : "Chat not found";

    if (!chatId || !chat) return res.status(400).json({ message: message });

    if (
      !chat?.admins ||
      chat.admins.length === 0 ||
      userId !== chat.admins[0]?._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Only admins can delete the group chat" });
    }
    await deleteChatById(chatId);

    return res
      .status(200)
      .json({ success: true, message: "Group chat deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting group chat",
      error: (error as Error).message,
    });
  }
};

export const leaveGroupChatHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.userId;
    const chat = await findChatById(chatId);
    const message = !chatId ? "Chat ID is required" : "Chat not found";

    if (!chatId || !chat) return res.status(400).json({ message: message });

    if (!chat?.members || chat.members.length === 0) {
      return res.status(400).json({ message: "No members in the chat" });
    }

    if (!userId || !chat.members.find((m) => m._id.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group chat" });
    }

    // Remove user from members
    chat.members = chat.members.filter((m) => m._id.toString() !== userId);

    // If user is admin, remove from admins
    if (chat.admins && chat.admins.length > 0) {
      chat.admins = chat.admins.filter((a) => a._id.toString() !== userId);
      chat.members = chat.members.filter((m) => m._id.toString() !== userId);
    }

    await updateChat(chatId, chat);

    return res
      .status(200)
      .json({ success: true, message: "Left the group chat successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error leaving group chat",
      error: (error as Error).message,
    });
  }
};
