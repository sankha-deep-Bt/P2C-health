import mongoose, { Document } from "mongoose";

export interface ChatType {
  name?: string; // only for group chats
  isGroup: boolean;
  members: mongoose.Types.ObjectId[]; // userIds
  admins?: mongoose.Types.ObjectId[]; // group admins (optional)
  lastMessage?: mongoose.Types.ObjectId; // reference to last message
}

export interface ChatDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name?: string;
  isGroup: boolean;
  members: mongoose.Types.ObjectId[];
  admins?: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new mongoose.Schema<ChatDocument>(
  {
    name: {
      type: String,
      trim: true,
    },
    isGroup: {
      type: Boolean,
      default: false, // false → 1-to-1, true → group
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model<ChatDocument>("Chat", chatSchema);
export default ChatModel;
