// // screens/DoctorDashboard.tsx
// import React, { useEffect, useState } from "react";
// import { ScrollView, ActivityIndicator, View } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DoctorProfile from "./DoctorProfile";
// import { BASE_URL } from "../constants";
// import { Text } from "react-native-gesture-handler";

// const DoctorDashboard = () => {
//   const [user, setUser] = useState<{
//     data: {
//       name: string;
//       email: string;
//       specialization: string;
//       qualification: string;
//       bio: string;
//       clinicName: string;
//       experience: string;
//       phone: string;
//       patientList: string[];
//       availability: {
//         day: string;
//         startTime: string;
//         endTime: string;
//       }[];
//       address: string;
//       profilePic: string;
//     };
//   } | null>(null);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       setLoading(true);
//       try {
//         // 1️⃣ Load from AsyncStorage first
//         const storedUser = await AsyncStorage.getItem("user");
//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//         }

//         // 2️⃣ Fetch latest data from API
//         const token = await AsyncStorage.getItem("refreshToken");
//         const res = await fetch(`${BASE_URL}/api/user/profile`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch user data");

//         const data = await res.json();

//         setUser(data);

//         // 3️⃣ Update AsyncStorage with latest user data
//         await AsyncStorage.setItem("user", JSON.stringify(data));
//       } catch (error) {
//         console.error("Error loading user:", error);
//       } finally {
//         setLoading(false);
//         console.log("user", user);
//       }
//     };
//     loadUser();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView>
//       {user ? (
//         <DoctorProfile
//           name={user.data?.name}
//           specialization={user.data?.specialization}
//           profilePic={user.data?.profilePic}
//           clinicAddress={user.data?.address}
//           availability={user.data?.availability} // pass array directly
//           experience={user.data?.experience}
//           qualification={user.data?.qualification}
//           contact={user.data?.phone}
//           bio={user.data?.bio}
//           clinicName={user.data?.clinicName}
//           patientList={user.data?.patientList} // array
//         />
//       ) : (
//         <Text>Loading doctor data...</Text>
//       )}
//     </ScrollView>
//   );
// };

// export default DoctorDashboard;

// screens/DoctorDashboard.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DoctorProfile from "./DoctorProfile";
import { BASE_URL } from "../constants";

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface DoctorData {
  data: {
    name: string;
    email: string;
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
  };
}

const DoctorDashboard = () => {
  const [user, setUser] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          console.log("Loaded from storage:", parsed);

          // ensure correct nesting
          setUser(parsed.data || parsed);
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
        console.log("API response", apiResponse);

        // If your API returns { data: { ...doctorFields } }
        const doctor = apiResponse.data || apiResponse;

        // Map directly without converting numbers to strings
        setUser({
          data: {
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization,
            profilePic: doctor.profilePic,
            experience: doctor.experience,
            qualification: doctor.qualification,
            bio: doctor.bio,
            clinicName: doctor.clinicName,
            phone: doctor.phone,
            address: doctor.address,
            availability: doctor.availability || [],
            patientList: doctor.patientList || [],
          },
        });

        // always store flattened doctor
        await AsyncStorage.setItem("user", JSON.stringify(doctor));
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No doctor data found</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <DoctorProfile
        name={user?.data?.name}
        specialization={user?.data?.specialization}
        profilePic={user?.data?.profilePic}
        clinicAddress={user?.data?.address}
        availability={user?.data?.availability}
        experience={user?.data?.experience}
        qualification={user?.data?.qualification}
        contact={user?.data?.phone}
        bio={user?.data?.bio}
        clinicName={user?.data?.clinicName}
        patientList={user?.data?.patientList}
      />
    </ScrollView>
  );
};

export default DoctorDashboard;
