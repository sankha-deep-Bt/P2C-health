import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "./ChatListScreen";
import ChatScreen from "./ChatScreen";

const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={{ title: "My Chats" }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ title: "Chat" }}
      />
    </Stack.Navigator>
  );
}
