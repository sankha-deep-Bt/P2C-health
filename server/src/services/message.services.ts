import MessageModel from "../models/message.model";

export const findMessagesByChatId = async (
  userToChatId: string,
  senderId: string
) => {
  return MessageModel.find({
    $or: [
      { senderId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: senderId },
    ],
  });
};

export const createMessage = async (messageData: {
  senderId: string;
  receiverId: string;
  content: string;
}) => {
  const message = new MessageModel(messageData);
  return message.save();
};

export const deleteMessageById = async (messageId: string, userId: string) => {
  const message = await MessageModel.findById(messageId);
  if (!message) return false;
  if (
    message.senderId.toString() !== userId &&
    message.receiverId.toString() !== userId
  )
    return false;
  await MessageModel.findByIdAndDelete(messageId);
  return true;
};

export const findMessageById = async (messageId: string) => {
  return MessageModel.findById(messageId);
};
