export type DocKey = "cnicFront" | "cnicBack" | "other";

export interface ItemRow {
  key: number;
  name: string;
  price: string;
  photo?: File; // optional picture of the item
}

export interface CustomerFormState {
  name: string;
  fatherName: string;
  mobile: string;
  cnic: string;
  address: string;
  photo?: File;
  docs: Partial<Record<DocKey, File>>;
  items: ItemRow[];
  down: string;
  months: number;
  firstDue: string;
}

export type FormErrors = Record<string, string>;

export interface StepProps {
  form: CustomerFormState;
  errors: FormErrors;
  update: (patch: Partial<CustomerFormState>) => void;
}
