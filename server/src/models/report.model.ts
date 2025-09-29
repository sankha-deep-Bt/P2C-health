import mongoose, { Schema } from "mongoose";

// export interface IReportModel extends mongoose.Model<IReport> {

// }

const ReportSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    medicalHistory: {
      chiefComplaints: [
        {
          complaint: { type: String, required: false },
          duration: { type: String, required: false },
          order: { type: String, required: false },
        },
      ],
      historyOfPresentIllness: {
        symptoms: { type: String, required: false },
        onset: { type: String, required: false },
        duration: { type: String, required: false },
        frequencyTiming: { type: String, required: false },
        progression: { type: String, required: false },
        location: { type: String, required: false },
        radiation: { type: String, required: false },
        character: { type: String, required: false },
        severity: { type: Number, required: false },
        associatedSymptoms: { type: String, required: false },
        aggravatingFactors: { type: String, required: false },
        relievingFactors: { type: String, required: false },
        previousEpisodes: { type: String, required: false },
        impact: { type: String, required: false },
      },
      pastHistory: {
        conditions: [
          {
            condition: { type: String, required: false },
            date: { type: String, required: false },
            cured: { type: Boolean, required: false },
          },
        ],
        trauma: { type: String, required: false },
        bloodTransfusions: { type: String, required: false },
        allergies: { type: String, required: false },
        immunizations: { type: String, required: false },
      },
      medications: {
        prescribed: [
          {
            name: { type: String, required: false },
            dosage: { type: String, required: false },
            description: { type: String, required: false },
          },
        ],
        supplements: { type: String, required: false },
        compliance: { type: String, required: false },
        recentChanges: { type: String, required: false },
      },
      familyHistory: {
        conditions: [{ type: String, required: false }],
        familyHealthStatus: { type: String, required: false },
        consanguinity: { type: String, required: false },
      },
      documents: {
        reports: { type: String, required: false },
        prescriptions: { type: String, required: false },
        photos: { type: String, required: false },
      },
    },

    lifestyleAssessment: {
      sleep: {
        bedtime: { type: String, required: false },
        wakeTime: { type: String, required: false },
        quality: { type: String, required: false },
        issues: [{ type: String, required: false }],
        dreamFrequency: { type: String, required: false },
        notes: { type: String, required: false },
      },
      diet: {
        dietType: { type: String, required: false },
        waterIntake: { type: Number, required: false },
        hungerLevel: { type: Number, required: false },
        favoriteFood: { type: String, required: false },
        foodAllergies: { type: String, required: false },
        tastes: {
          sweet: { type: Boolean, required: false },
          sour: { type: Boolean, required: false },
          salty: { type: Boolean, required: false },
          bitter: { type: Boolean, required: false },
          pungent: { type: Boolean, required: false },
          astringent: { type: Boolean, required: false },
        },
        thirstLevel: { type: String, required: false },
        notes: { type: String, required: false },
      },
      activity: {
        level: { type: String, required: false },
        notes: { type: String, required: false },
      },
      stress: {
        level: { type: String, required: false },
        caffeineIntake: { type: String, required: false },
        primaryEmotion: { type: String, required: false },
        emotionNotes: { type: String, required: false },
        notes: { type: String, required: false },
      },
      substance: {
        smokingStatus: { type: String, required: false },
        alcoholConsumption: { type: String, required: false },
        notes: { type: String, required: false },
      },
      stool: {
        color: { type: String, required: false },
        type: { type: String, required: false },
        problems: [{ type: String, required: false }],
        notes: { type: String, required: false },
      },
      urine: {
        color: { type: String, required: false },
        dayFrequency: { type: String, required: false },
        nightFrequency: { type: String, required: false },
        problems: [{ type: String, required: false }],
        notes: { type: String, required: false },
      },
      menstruation: {
        lastPeriodDate: { type: String, required: false },
        cycleLength: { type: Number, required: false },
        duration: { type: Number, required: false },
        isRegular: { type: String, required: false },
        flow: { type: String, required: false },
        bloodColor: { type: String, required: false },
        symptoms: [{ type: String, required: false }],
        painLevel: { type: Number, required: false },
        notes: { type: String, required: false },
      },
    },

    patientImprovementReview: [
      {
        symptom: { type: String, required: false },
        date: { type: String, required: false },
        doctorName: { type: String, required: false },
        review: { type: Number, required: false },
        status: { type: String, required: false },
        recoveryPercentage: { type: Number, required: false },
      },
    ],

    caseHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        type: { type: String, required: false },
        description: { type: String, required: false },
        details: { type: Schema.Types.Mixed, required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ReportModel = mongoose.model("Report", ReportSchema);
