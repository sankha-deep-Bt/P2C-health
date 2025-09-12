import mongoose, { Document } from "mongoose";

export interface MessageType {
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId; // for 1-to-1
  chatId?: mongoose.Types.ObjectId; // for group chats
  content: string;
  isRead: boolean;
}

export interface MessageDocument extends Document {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  chatId?: mongoose.Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<MessageDocument>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // optional → used only in direct 1-to-1 messages
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    }, // optional → used only for group messages
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<MessageDocument>("Message", messageSchema);
export default MessageModel;
