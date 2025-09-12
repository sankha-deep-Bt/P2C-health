import MessageModel, { MessageType } from "../models/message.model";

/* -------------------- Create Message -------------------- */
export const createMessage = async (data: {
  senderId: string;
  receiverId: string;
  content: string;
}): Promise<MessageType> => {
  const newMessage = new MessageModel(data);
  await newMessage.save();
  return newMessage;
};

/* -------------------- Find messages between two users -------------------- */
export const findMessagesByChatId = async (
  user1: string,
  user2: string
): Promise<MessageType[]> => {
  return await MessageModel.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 },
    ],
  })
    .sort({ createdAt: 1 }) // oldest → newest
    .exec();
};

/* -------------------- Find single message -------------------- */
export const findMessageById = async (
  id: string
): Promise<MessageType | null> => {
  return await MessageModel.findById(id).exec();
};

/* -------------------- Delete a message -------------------- */
export const deleteMessageById = async (
  messageId: string,
  userId: string
): Promise<void> => {
  await MessageModel.findOneAndDelete({ _id: messageId, senderId: userId });
};

/* -------------------- Mark all messages in a chat as read -------------------- */
export const markMessagesAsRead = async (
  userId: string,
  userToChatId: string
): Promise<{ modifiedCount: number }> => {
  const result = await MessageModel.updateMany(
    { senderId: userToChatId, receiverId: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
  return { modifiedCount: result.modifiedCount };
};

/* -------------------- Count unread messages for user -------------------- */
export const countUnreadMessages = async (userId: string): Promise<number> => {
  return await MessageModel.countDocuments({
    receiverId: userId,
    isRead: false,
  });
};

/* -------------------- Get all chats (chat list) -------------------- */
export const findUserChats = async (userId: string) => {
  // Aggregate to get distinct chat partners
  const chats = await MessageModel.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }],
      },
    },
    {
      $project: {
        chatPartner: {
          $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"],
        },
        content: 1,
        createdAt: 1,
        isRead: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$chatPartner",
        lastMessage: { $first: "$content" },
        lastMessageAt: { $first: "$createdAt" },
        isRead: { $first: "$isRead" },
      },
    },
    {
      $lookup: {
        from: "users", // assumes users collection
        localField: "_id",
        foreignField: "_id",
        as: "chatPartner",
      },
    },
    {
      $unwind: "$chatPartner",
    },
  ]);

  return chats;
};
