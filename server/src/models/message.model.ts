import mongoose, { Document } from "mongoose";
// import { hashValue } from "../utils/hash";

export interface MessageType {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface MessageDocument extends Document {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
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
      required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<MessageDocument>("Message", messageSchema);
export default MessageModel;
