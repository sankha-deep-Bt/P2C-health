// import { AuthRequest } from "../middleware/auth.middleware";
// import {
//   deleteMessageById,
//   findMessageById,
//   findMessagesByChatId,
// } from "../services/message.services";
// import { Response } from "express";
// import { createMessage } from "../services/message.services";

// export const getMessages = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?.userId;
//     const { userToChatId } = req.params;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const messages = await findMessagesByChatId(userToChatId, userId);
//     return res.status(200).json({ messages });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error retrieving messages",
//       error: (error as Error).message,
//     });
//   }
// };

// export const sendMessage = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?.userId;
//     const { userToChatId } = req.params;
//     const { content } = req.body;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     if (!content || !userToChatId) {
//       return res
//         .status(400)
//         .json({ message: "Content and receiverId are required" });
//     }

//     const newMessage = await createMessage({
//       senderId: userId,
//       receiverId: userToChatId,
//       content,
//     });

//     return res.status(201).json({ message: newMessage });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error sending message",
//       error: (error as Error).message,
//     });
//   }
// };

// export const deleteMessage = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?.userId;
//     const { messageId } = req.params;

//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const message = await findMessageById(messageId);

//     if (!message) return res.status(404).json({ message: "Message not found" });
//     if (message.senderId.toString() !== userId)
//       return res.status(403).json({ message: "Not allowed" });

//     await deleteMessageById(messageId, userId);
//     return res.status(200).json({ message: "Message deleted" });
//   } catch (error) {
//     return res.status(500).json({ message: "Error deleting message" });
//   }
// };

import { AuthRequest } from "../middleware/auth.middleware";
import {
  deleteMessageById,
  findMessageById,
  findMessagesByChatId,
  findUserChats,
  markMessagesAsRead,
  countUnreadMessages,
  createMessage,
} from "../services/message.services";
import { Response } from "express";

/* -------------------- Get messages between two users -------------------- */
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { userToChatId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const messages = await findMessagesByChatId(userToChatId, userId);
    if (!messages) {
      return res.status(404).json({ message: "No messages found" });
    }
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching messages",
      error: (error as Error).message,
    });
  }
};

/* -------------------- Send a new message -------------------- */
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { userToChatId } = req.params;
    const { content } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!content || !userToChatId) {
      return res
        .status(400)
        .json({ message: "Content and receiverId are required" });
    }

    const newMessage = await createMessage({
      senderId: userId,
      receiverId: userToChatId,
      content,
    });

    return res.status(201).json({ success: true, content: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error sending message",
      error: (error as Error).message,
    });
  }
};

/* -------------------- Delete a message -------------------- */
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { messageId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const message = await findMessageById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.senderId.toString() !== userId)
      return res.status(403).json({ message: "Not allowed" });

    await deleteMessageById(messageId, userId);
    return res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting message" });
  }
};

/* -------------------- Mark all messages as read -------------------- */
export const markChatAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { userToChatId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await markMessagesAsRead(userId, userToChatId);

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error marking messages as read" });
  }
};

/* -------------------- Get unread message count -------------------- */
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const count = await countUnreadMessages(userId);
    return res.status(200).json({ success: true, unreadCount: count });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching unread count" });
  }
};

/* -------------------- Get all user chats (chat list) -------------------- */
export const getUserChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const chats = await findUserChats(userId);
    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching chats" });
  }
};
