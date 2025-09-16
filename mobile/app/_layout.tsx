// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack />;
// }

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  // preload custom fonts (optional)
  // const [loaded, error] = useFonts({
  //   Inter: require("../assets/fonts/Inter-Regular.ttf"),
  //   InterBold: require("../assets/fonts/Inter-Bold.ttf"),
  // });

  // useEffect(() => {
  //   if (loaded || error) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded, error]);

  // if (!loaded && !error) {
  //   return null;
  // }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1E40AF" }, // blue header
        headerTintColor: "#fff", // white text/icons
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#f9fafb" }, // screen bg
      }}
    >
      {/* You can also configure specific screens */}
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="auth/login"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen name="chat/[id]" options={{ title: "Chat" }} />
    </Stack>
  );
}
