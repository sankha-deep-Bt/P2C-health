export type MedicalHistoryType = {
  chiefComplaints?: {
    complaint?: string;
    duration?: string;
    order?: string;
  }[];
  historyOfPresentIllness?: {
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
  pastHistory?: {
    conditions?: {
      condition?: string;
      date?: string;
      cured?: boolean;
    }[];
    trauma?: string;
    bloodTransfusions?: string;
    allergies?: string;
    immunizations?: string;
  };
  medications?: {
    prescribed?: {
      name?: string;
      dosage?: string;
      description?: string;
    }[];
    supplements?: string;
    compliance?: string;
    recentChanges?: string;
  };
  familyHistory?: {
    conditions?: string[];
    familyHealthStatus?: string;
    consanguinity?: string;
  };
  documents?: {
    reports?: string;
    prescriptions?: string;
    photos?: string;
  };
};
