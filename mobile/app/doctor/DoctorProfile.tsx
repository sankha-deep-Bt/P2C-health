// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
// } from "react-native";
// import { BASE_URL } from "../constants";
// import { Card } from "@/components/Card";
// import { Ionicons } from "@expo/vector-icons";

// const DoctorProfile = () => {
//   interface AvailabilitySlot {
//     day: string;
//     startTime: string;
//     endTime: string;
//   }

//   interface DoctorData {
//     name: string;
//     email: string;
//     uniqueId: string;
//     specialization: string;
//     qualification: string;
//     bio: string;
//     clinicName: string;
//     experience: number;
//     phone: string;
//     patientList: string[];
//     availability: AvailabilitySlot[];
//     address: string;
//     profilePic: string;
//   }

//   const [user, setUser] = useState<DoctorData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingCard, setEditingCard] = useState<string | null>(null);

//   useEffect(() => {
//     const loadUser = async () => {
//       setLoading(true);
//       try {
//         const storedUser = await AsyncStorage.getItem("user");
//         if (storedUser) {
//           const parsed = JSON.parse(storedUser);
//           setUser(parsed.user || parsed);
//         }

//         const token = await AsyncStorage.getItem("refreshToken");
//         const res = await fetch(`${BASE_URL}/api/user/profile`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch user data");

//         const apiResponse = await res.json();
//         const doctor = apiResponse.data || apiResponse;

//         // adjust structure depending on backend
//         setUser({
//           name: doctor.user.data.name || "",
//           email: doctor.user.data.email || "",
//           uniqueId: doctor.user.data.uniqueId || "",
//           specialization: doctor.user.data.specialization || "",
//           profilePic: doctor.user.data.profilePic || "",
//           experience: doctor.user.data.experience || 0,
//           qualification: doctor.user.data.qualification || "",
//           bio: doctor.user.data.bio || "",
//           clinicName: doctor.user.data.clinicName || "",
//           phone: doctor.user.data.phone || "",
//           address: doctor.user.data.address || "",
//           availability: doctor.user.data.availability || [],
//           patientList: doctor.user.data.patientList || [],
//         });

//         await AsyncStorage.setItem("user", JSON.stringify(doctor));
//       } catch (error) {
//         console.error("Error loading user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const handleSaveAllChanges = async () => {
//     if (!user) return;
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("accessToken");

//       const res = await fetch(`${BASE_URL}/api/user`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(user),
//       });

//       if (!res.ok) throw new Error("Failed to update user");

//       const responseData = await res.json();
//       await AsyncStorage.setItem(
//         "user",
//         JSON.stringify(responseData.data || user)
//       );

//       Alert.alert("Profile Updated", "Your changes have been saved.");
//       setIsEditMode(false);
//       setEditingCard(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//       Alert.alert("Error", "Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.center}>
//         <Text>No doctor data found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       {/* Top Edit / Done Button */}
//       <View style={styles.topBar}>
//         <Text style={styles.title}>Doctor Profile</Text>
//         <TouchableOpacity
//           style={styles.editToggleButton}
//           onPress={() => {
//             if (isEditMode) {
//               handleSaveAllChanges(); // Save all changes at once
//             } else {
//               setIsEditMode(true); // Enter edit mode
//               setEditingCard(null);
//             }
//           }}
//         >
//           <Ionicons
//             name={isEditMode ? "checkmark-done" : "create-outline"}
//             size={22}
//             color="#007bff"
//           />
//           <Text style={styles.editText}>
//             {isEditMode ? "Done" : "Edit Profile"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Doctor Info */}
//       <Card>
//         <View style={styles.cardHeader}>
//           <Text style={styles.cardTitle}>Doctor Info 👨‍⚕️</Text>
//           {isEditMode && (
//             <TouchableOpacity onPress={() => setEditingCard("info")}>
//               <Ionicons name="pencil" size={18} color="#007bff" />
//             </TouchableOpacity>
//           )}
//         </View>
//         <View style={styles.header}>
//           {user.profilePic ? (
//             <Image source={{ uri: user.profilePic }} style={styles.avatar} />
//           ) : (
//             <View style={[styles.avatar, styles.placeholderAvatar]}>
//               <Text>📷</Text>
//             </View>
//           )}
//           <View style={styles.headerText}>
//             {editingCard === "info" ? (
//               <>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter name"
//                   value={user.name}
//                   onChangeText={(text) => setUser({ ...user, name: text })}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter specialization"
//                   value={user.specialization}
//                   onChangeText={(text) =>
//                     setUser({ ...user, specialization: text })
//                   }
//                 />
//               </>
//             ) : (
//               <>
//                 <Text style={styles.name}>
//                   {user.name || "No name provided"}
//                 </Text>
//                 <Text style={styles.specialization}>
//                   {user.specialization || "No specialization"}
//                 </Text>
//                 <Text style={styles.uniqueId}>ID: {user.uniqueId}</Text>
//               </>
//             )}
//           </View>
//         </View>
//       </Card>

//       {/* Clinic Info */}
//       <Card>
//         <View style={styles.cardHeader}>
//           <Text style={styles.cardTitle}>Clinic Info 🏥</Text>
//           {isEditMode && (
//             <TouchableOpacity onPress={() => setEditingCard("clinic")}>
//               <Ionicons name="pencil" size={18} color="#007bff" />
//             </TouchableOpacity>
//           )}
//         </View>
//         {editingCard === "clinic" ? (
//           <>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter clinic name"
//               value={user.clinicName}
//               onChangeText={(text) => setUser({ ...user, clinicName: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Enter address"
//               value={user.address}
//               onChangeText={(text) => setUser({ ...user, address: text })}
//             />
//           </>
//         ) : (
//           <>
//             <Text>{user.clinicName || "No clinic name"}</Text>
//             <Text>{user.address || "No address"}</Text>
//           </>
//         )}
//       </Card>

//       {/* Contact Info */}
//       <Card>
//         <View style={styles.cardHeader}>
//           <Text style={styles.cardTitle}>Contact 📞</Text>
//           {isEditMode && (
//             <TouchableOpacity onPress={() => setEditingCard("contact")}>
//               <Ionicons name="pencil" size={18} color="#007bff" />
//             </TouchableOpacity>
//           )}
//         </View>
//         {editingCard === "contact" ? (
//           <TextInput
//             style={styles.input}
//             placeholder="Enter phone number"
//             value={user.phone}
//             onChangeText={(text) => setUser({ ...user, phone: text })}
//           />
//         ) : (
//           <Text>{user.phone || "No phone number"}</Text>
//         )}
//       </Card>

//       {/* Professional Info */}
//       <Card>
//         <View style={styles.cardHeader}>
//           <Text style={styles.cardTitle}>Professional Info 🎓</Text>
//           {isEditMode && (
//             <TouchableOpacity onPress={() => setEditingCard("professional")}>
//               <Ionicons name="pencil" size={18} color="#007bff" />
//             </TouchableOpacity>
//           )}
//         </View>
//         {editingCard === "professional" ? (
//           <>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter qualification"
//               value={user.qualification}
//               onChangeText={(text) => setUser({ ...user, qualification: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Enter experience (years)"
//               keyboardType="numeric"
//               value={String(user.experience || "")}
//               onChangeText={(text) =>
//                 setUser({ ...user, experience: Number(text) })
//               }
//             />
//           </>
//         ) : (
//           <>
//             <Text>Qualification: {user.qualification || "Not provided"}</Text>
//             <Text>Experience: {user.experience || "0"} years</Text>
//           </>
//         )}
//       </Card>

//       {/* Bio */}
//       <Card>
//         <View style={styles.cardHeader}>
//           <Text style={styles.cardTitle}>About 💬</Text>
//           {isEditMode && (
//             <TouchableOpacity onPress={() => setEditingCard("bio")}>
//               <Ionicons name="pencil" size={18} color="#007bff" />
//             </TouchableOpacity>
//           )}
//         </View>
//         {editingCard === "bio" ? (
//           <TextInput
//             style={[styles.input, { height: 80 }]}
//             placeholder="Enter bio"
//             multiline
//             value={user.bio}
//             onChangeText={(text) => setUser({ ...user, bio: text })}
//           />
//         ) : (
//           <Text>{user.bio || "No bio available"}</Text>
//         )}
//       </Card>
//     </ScrollView>
//   );
// };

// export default DoctorProfile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     padding: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   topBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   editToggleButton: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   editText: {
//     color: "#007bff",
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 8,
//     marginVertical: 4,
//     fontSize: 15,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginRight: 12,
//   },
//   placeholderAvatar: {
//     backgroundColor: "#eaeaea",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerText: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   specialization: {
//     fontSize: 16,
//     color: "#666",
//   },
//   uniqueId: {
//     fontSize: 14,
//     color: "#888",
//   },
// });

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { BASE_URL } from "../constants";
import { Card } from "@/components/Card";
import { Ionicons } from "@expo/vector-icons";

const DoctorProfile = () => {
  interface AvailabilitySlot {
    day: string;
    startTime: string;
    endTime: string;
  }

  interface DoctorData {
    name: string;
    email: string;
    uniqueId: string;
    specialization: string;
    qualification: string;
    bio: string;
    clinicName: string;
    experience: number;
    phone: string;
    patientList: string[];
    availability: AvailabilitySlot[];
    address: string;
    profilePic: string;
  }

  const [user, setUser] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed.user || parsed);
        }

        const token = await AsyncStorage.getItem("refreshToken");
        const res = await fetch(`${BASE_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const apiResponse = await res.json();
        const doctor = apiResponse.data || apiResponse;

        // adjust structure depending on backend
        setUser({
          name: doctor.user.data.name || "",
          email: doctor.user.data.email || "",
          uniqueId: doctor.user.data.uniqueId || "",
          specialization: doctor.user.data.specialization || "",
          profilePic: doctor.user.data.profilePic || "",
          experience: doctor.user.data.experience || 0,
          qualification: doctor.user.data.qualification || "",
          bio: doctor.user.data.bio || "",
          clinicName: doctor.user.data.clinicName || "",
          phone: doctor.user.data.phone || "",
          address: doctor.user.data.address || "",
          availability: doctor.user.data.availability || [],
          patientList: doctor.user.data.patientList || [],
        });

        await AsyncStorage.setItem("user", JSON.stringify(doctor));
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSaveAllChanges = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");

      const res = await fetch(`${BASE_URL}/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const responseData = await res.json();
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(responseData.data || user)
      );

      Alert.alert("Profile Updated", "Your changes have been saved.");
      setIsEditMode(false);
      setEditingCard(null);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No doctor data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Edit / Done Button */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Doctor Profile</Text>
        <TouchableOpacity
          style={styles.editToggleButton}
          onPress={() => {
            if (isEditMode) {
              handleSaveAllChanges(); // Save all changes at once
            } else {
              setIsEditMode(true); // Enter edit mode
              setEditingCard(null);
            }
          }}
        >
          <Ionicons
            name={isEditMode ? "checkmark-done" : "create-outline"}
            size={22}
            color="#007bff"
          />
          <Text style={styles.editText}>
            {isEditMode ? "Done" : "Edit Profile"}
          </Text>
          <Text style={styles.cancelText} onPress={() => setIsEditMode(false)}>
            {isEditMode ? " Cancel" : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Doctor Info */}
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Doctor Info 👨‍⚕️</Text>
          {isEditMode && (
            <TouchableOpacity onPress={() => setEditingCard("info")}>
              <Ionicons name="pencil" size={18} color="#007bff" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.header}>
          {user.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text>📷</Text>
            </View>
          )}
          <View style={styles.headerText}>
            {editingCard === "info" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={user.name}
                  onChangeText={(text) => setUser({ ...user, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter specialization"
                  value={user.specialization}
                  onChangeText={(text) =>
                    setUser({ ...user, specialization: text })
                  }
                />
              </>
            ) : (
              <>
                <Text style={styles.name}>
                  {user.name || "No name provided"}
                </Text>
                <Text style={styles.specialization}>
                  {user.specialization || "No specialization"}
                </Text>
                <Text style={styles.uniqueId}>ID: {user.uniqueId}</Text>
              </>
            )}
          </View>
        </View>
      </Card>

      {/* Clinic Info */}
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Clinic Info 🏥</Text>
          {isEditMode && (
            <TouchableOpacity onPress={() => setEditingCard("clinic")}>
              <Ionicons name="pencil" size={18} color="#007bff" />
            </TouchableOpacity>
          )}
        </View>
        {editingCard === "clinic" ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter clinic name"
              value={user.clinicName}
              onChangeText={(text) => setUser({ ...user, clinicName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={user.address}
              onChangeText={(text) => setUser({ ...user, address: text })}
            />
          </>
        ) : (
          <>
            <Text>{user.clinicName || "No clinic name"}</Text>
            <Text>{user.address || "No address"}</Text>
          </>
        )}
      </Card>

      {/* Contact Info */}
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Contact 📞</Text>
          {isEditMode && (
            <TouchableOpacity onPress={() => setEditingCard("contact")}>
              <Ionicons name="pencil" size={18} color="#007bff" />
            </TouchableOpacity>
          )}
        </View>
        {editingCard === "contact" ? (
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
          />
        ) : (
          <Text>{user.phone || "No phone number"}</Text>
        )}
      </Card>

      {/* Professional Info */}
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Professional Info 🎓</Text>
          {isEditMode && (
            <TouchableOpacity onPress={() => setEditingCard("professional")}>
              <Ionicons name="pencil" size={18} color="#007bff" />
            </TouchableOpacity>
          )}
        </View>
        {editingCard === "professional" ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter qualification"
              value={user.qualification}
              onChangeText={(text) => setUser({ ...user, qualification: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter experience (years)"
              keyboardType="numeric"
              value={String(user.experience || "")}
              onChangeText={(text) =>
                setUser({ ...user, experience: Number(text) })
              }
            />
          </>
        ) : (
          <>
            <Text>Qualification: {user.qualification || "Not provided"}</Text>
            <Text>Experience: {user.experience || "0"} years</Text>
          </>
        )}
      </Card>

      {/* Bio */}
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>About 💬</Text>
          {isEditMode && (
            <TouchableOpacity onPress={() => setEditingCard("bio")}>
              <Ionicons name="pencil" size={18} color="#007bff" />
            </TouchableOpacity>
          )}
        </View>
        {editingCard === "bio" ? (
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Enter bio"
            multiline
            value={user.bio}
            onChangeText={(text) => setUser({ ...user, bio: text })}
          />
        ) : (
          <Text>{user.bio || "No bio available"}</Text>
        )}
      </Card>
    </ScrollView>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  editToggleButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    color: "#007bff",
    fontWeight: "600",
    marginLeft: 4,
  },
  cancelText: {
    color: "#ff3300ff",
    fontWeight: "600",
    marginLeft: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    fontSize: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  placeholderAvatar: {
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  specialization: {
    fontSize: 16,
    color: "#666",
  },
  uniqueId: {
    fontSize: 14,
    color: "#888",
  },
});
