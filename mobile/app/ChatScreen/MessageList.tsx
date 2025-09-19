import React from "react";
import { FlatList } from "react-native";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: { id: string; text: string; sender: string }[];
};

export default function MessageList({ messages }: Props) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageBubble text={item.text} sender={item.sender} />
      )}
      contentContainerStyle={{ padding: 10 }}
    />
  );
}
