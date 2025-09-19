import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import styles from "./styles";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput.";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I help you today?", sender: "doctor" },
    {
      id: "2",
      text: "I wanted to ask about my prescription.",
      sender: "patient",
    },
  ]);

  const handleSend = (text: string) => {
    if (text.trim().length === 0) return;
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: "patient", // hardcoded for now
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}
