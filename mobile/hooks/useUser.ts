import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/app/constants";

export interface HealthDataType {
  patientId: string;
  medicalHistory: {
    chiefComplaints: {
      complaint?: string;
      duration?: string;
      order?: string;
    }[];
    historyOfPresentIllness: {
      symptoms?: string;
      onset?: string;
      duration?: string;
      frequencyTiming?: string;
      progression?: string;
      location?: string;
      radiation?: string;
      character?: string;
      severity?: number;
      associatedSymptoms?: string;
      aggravatingFactors?: string;
      relievingFactors?: string;
      previousEpisodes?: string;
      impact?: string;
    };
    pastHistory: {
      conditions: {
        condition?: string;
        date?: string;
        cured?: boolean;
      }[];
      trauma?: string;
      bloodTransfusions?: string;
      allergies?: string;
      immunizations?: string;
    };
    medications: {
      prescribed: {
        name?: string;
        dosage?: string;
        description?: string;
      }[];
      supplements?: string;
      compliance?: string;
      recentChanges?: string;
    };
    familyHistory: {
      conditions: string[];
      familyHealthStatus?: string;
      consanguinity?: string;
    };
    documents: {
      reports?: string;
      prescriptions?: string;
      photos?: string;
    };
  };

  lifestyleAssessment: {
    sleep: {
      bedtime?: string;
      wakeTime?: string;
      quality?: string;
      issues?: string[];
      dreamFrequency?: string;
      notes?: string;
    };
    diet: {
      dietType?: string;
      waterIntake?: number;
      hungerLevel?: number;
      favoriteFood?: string;
      foodAllergies?: string;
      tastes: {
        sweet?: boolean;
        sour?: boolean;
        salty?: boolean;
        bitter?: boolean;
        pungent?: boolean;
        astringent?: boolean;
      };
      thirstLevel?: string;
      notes?: string;
    };
    activity: {
      level?: string;
      notes?: string;
    };
    stress: {
      level?: string;
      caffeineIntake?: string;
      primaryEmotion?: string;
      emotionNotes?: string;
      notes?: string;
    };
    substance: {
      smokingStatus?: string;
      alcoholConsumption?: string;
      notes?: string;
    };
    stool: {
      color?: string;
      type?: string;
      problems?: string[];
      notes?: string;
    };
    urine: {
      color?: string;
      dayFrequency?: string;
      nightFrequency?: string;
      problems?: string[];
      notes?: string;
    };
    menstruation: {
      lastPeriodDate?: string;
      cycleLength?: number;
      duration?: number;
      isRegular?: string;
      flow?: string;
      bloodColor?: string;
      symptoms?: string[];
      painLevel?: number;
      notes?: string;
    };
  };

  patientImprovementReview: {
    symptom?: string;
    date?: string;
    doctorName?: string;
    review?: number;
    status?: string;
    recoveryPercentage?: number;
  }[];

  caseHistory: {
    timestamp: string;
    type?: string;
    description?: string;
    details?: any;
  }[];
}

export function useUser() {
  // types/health.ts

  const [user, setUser] = useState<{
    name: string;
    email: string;
    uniqueId: string;
  } | null>(null);
  const [healthData, setHealthData] = useState<HealthDataType | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) {
          console.warn("No user found in AsyncStorage");
          return;
        }
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id;

        if (!userId) {
          console.warn("No userId found in stored user");
          return;
        }
        // Fetch health data from backend
        // If health data is found in storage, use it and skip fetching
        {
          const res = await fetch(`${BASE_URL}/api/patients/${userId}/health`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await AsyncStorage.getItem(
                "accessToken"
              )}`,
            },
          });

          if (res.ok) {
            const data: HealthDataType[] = await res.json();
            console.log("Fetched health data:", data);
            if (data.length > 0) {
              setHealthData(data[0]);
            } else {
              setHealthData(null);
            }
            console.error("Failed to fetch health data:", res.statusText);
          }

          // setHealthData(data);
          return null;
        }
      } catch (err) {
        console.error("Error fetching health data:", err);
      }
    };
    fetchHealthData();
  }, []);

  return { user, healthData };
}
