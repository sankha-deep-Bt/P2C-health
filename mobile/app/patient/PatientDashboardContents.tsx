import React from "react";
import { View, Text, Button } from "react-native";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import styles from "./styles";
import { HealthDataType } from "@/hooks/useUser";

interface PatientDashboardContentProps {
  healthData: HealthDataType | null;
  onAddHealthData?: () => void;
}

export const PatientDashboardContent: React.FC<
  PatientDashboardContentProps
> = ({ healthData, onAddHealthData }) => {
  if (!healthData) {
    return (
      <Card title="Health Data Not Available">
        <Text style={{ ...styles.smallText, marginBottom: 8 }}>
          No health data found. Please fill in your health information to see a
          complete summary.
        </Text>
        <Button title="Add Health Data" onPress={onAddHealthData} />
      </Card>
    );
  }

  return (
    <>
      {/* Medical History */}
      <Card title="Medical History" iconName="❤️">
        <Text style={styles.boldText}>Key Conditions:</Text>
        <View style={styles.badgeContainer}>
          {(healthData.medicalHistory?.pastHistory?.conditions || []).map(
            (item: any, idx: number) => (
              <Badge key={idx} text={item.condition || "Condition"} />
            )
          )}
        </View>

        <Text style={[styles.boldText, { marginTop: 8 }]}>Medications:</Text>
        <View style={styles.badgeContainer}>
          {(healthData.medicalHistory?.medications?.prescribed || []).map(
            (med: any, idx: number) => (
              <Badge key={idx} text={med.name || "Medication"} />
            )
          )}
        </View>
      </Card>

      {/* Lifestyle */}
      <Card title="Lifestyle Assessment" iconName="🏃">
        <Text style={styles.smallText}>
          Diet: {healthData.lifestyleAssessment?.diet?.dietType || "N/A"}
        </Text>
        <Text style={styles.smallText}>
          Activity: {healthData.lifestyleAssessment?.activity?.level || "N/A"}
        </Text>
        <Text style={styles.smallText}>
          Stress: {healthData.lifestyleAssessment?.stress?.level || "N/A"}
        </Text>
      </Card>

      {/* Patient Improvement Review */}
      <Card title="Symptom Severity Trend">
        {(healthData.patientImprovementReview || []).length > 0 ? (
          (healthData.patientImprovementReview || []).map(
            (review: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <Text style={styles.smallText}>
                  {review.symptom || "Symptom"}: {review.review ?? "N/A"}/10 (
                  {review.recoveryPercentage ?? 0}% recovery)
                </Text>
              </View>
            )
          )
        ) : (
          <Text style={styles.smallText}>No improvement records yet.</Text>
        )}
      </Card>
    </>
  );
};
