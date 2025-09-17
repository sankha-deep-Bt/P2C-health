import ChatModel, { ChatDocument } from "../models/chat.model";
import MessageModel, { MessageDocument } from "../models/message.model";

// Create a group chat
export const createGroupChat = async (
  name: string,
  members: string[],
  creatorId: string
): Promise<ChatDocument> => {
  const chat = new ChatModel({
    name,
    isGroup: true,
    members,
    admins: [creatorId],
  });
  return chat.save();
};

// Find all chats for a user
export const findUserChats = async (
  userId: string
): Promise<ChatDocument[]> => {
  return ChatModel.find({ members: userId })
    .populate("members", "name email")
    .populate("lastMessage")
    .exec();
};

// Add message to chat
export const addMessageToChat = async (
  chatId: string,
  senderId: string,
  content: string
): Promise<MessageDocument> => {
  const message = new MessageModel({ chatId, senderId, content });
  await message.save();

  await ChatModel.findByIdAndUpdate(chatId, { lastMessage: message._id });
  return message;
};

export const findChatById = async (
  chatId: string
): Promise<ChatDocument | null> => {
  return ChatModel.findById(chatId)
    .populate("members", "name email")
    .populate("lastMessage")
    .exec();
};

export const deleteChatById = async (chatId: string): Promise<void> => {
  await ChatModel.findByIdAndDelete(chatId);
  await MessageModel.deleteMany({ chatId });
};

export const updateChat = async (
  chatId: string,
  chat: ChatDocument
): Promise<ChatDocument | null> => {
  return ChatModel.findByIdAndUpdate(chatId, chat, { new: true }).exec();
};
