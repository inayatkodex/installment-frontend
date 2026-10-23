export interface SignupFormState {
  shopName: string;
  city: string;
  address: string;
  ownerName: string;
  mobile: string;
  cnic: string;
  email: string;
  password: string;
  profilePic?: File;
}

export type SignupErrors = Record<string, string>;

export interface SignupStepProps {
  form: SignupFormState;
  errors: SignupErrors;
  update: (patch: Partial<SignupFormState>) => void;
}

export const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Gujranwala", "Sialkot", "Hyderabad", "Doosra shehar"];
