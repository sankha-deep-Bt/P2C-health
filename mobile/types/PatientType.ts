export type PatientType = {
  uniqueId: string; // uniqueId from backend
  avatar?: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height?: number;
  weight?: number;
  email?: string;
  phoneNumber?: string;
  address?: {
    [key: string]: string | undefined;
    line1?: string;
    line2?: string;
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt?: string;
};
