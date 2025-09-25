import React from "react";
import { View, Text, Image } from "react-native";
import { Card } from "@/components/Card";
import styles from "./styles";

interface UserProfileProps {
  name?: string;
  uniqueId?: string;
  profilePic?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, uniqueId }) => {
  return (
    <Card title="Patient Overview" iconName="👤">
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{
            uri:
              "https://ui-avatars.com/api/?name=" +
              (name || "Guest") +
              "&background=007AFF&color=fff",
          }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.boldText}>{name || "Guest User"}</Text>
          <Text style={styles.mutedText}>ID: {uniqueId || "N/A"}</Text>
        </View>
      </View>
    </Card>
  );
};

// import React, { useEffect, useState } from "react";
// import { View, Text, Image } from "react-native";
// import { Card } from "@/components/Card";
// import styles from "./styles";

// interface UserProfileProps {
//   name?: string;
//   uniqueId?: string;
//   profilePic?: string;
//   onProfilePicChange?: (uri: string) => void; // callback to send profilePic to backend
// }

// export const UserProfile: React.FC<UserProfileProps> = ({
//   name,
//   uniqueId,
//   profilePic,
//   onProfilePicChange,
// }) => {
//   const [avatarUri, setAvatarUri] = useState<string>("");

//   useEffect(() => {
//     const uri =
//       profilePic ||
//       `https://ui-avatars.com/api/?name=${encodeURIComponent(
//         name || "Guest"
//       )}&background=007AFF&color=fff`;

//     setAvatarUri(uri);

//     // Send avatarUri to backend if no custom profilePic exists
//     if (!profilePic && onProfilePicChange) {
//       onProfilePicChange(uri);
//     }
//   }, [name, profilePic, onProfilePicChange]);

//   return (
//     <Card title="Patient Overview" iconName="👤">
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <Image
//           source={{ uri: avatarUri }}
//           style={styles.avatar}
//           resizeMode="cover"
//         />
//         <View style={{ marginLeft: 12 }}>
//           <Text style={styles.boldText}>{name || "Guest User"}</Text>
//           <Text style={styles.mutedText}>ID: {uniqueId || "N/A"}</Text>
//         </View>
//       </View>
//     </Card>
//   );
// };
