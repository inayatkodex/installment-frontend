/**
 * Simple form validator.
 * rules: { fieldName: "Message to show when empty" }
 */
export const validateForm = (
  formData: Record<string, unknown>,
  rules: Record<string, string>,
  numberFields: string[] = [],
  emailFields: string[] = [],
  passwordFields: Record<string, number> = {},
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((key) => {
    const value = formData[key];
    if (value === null || value === undefined || value.toString().trim() === "") {
      errors[key] = rules[key];
      return;
    }
    if (typeof value === "boolean") return;

    if (numberFields.includes(key) && (isNaN(Number(value)) || Number(value) <= 0)) {
      errors[key] = rules[key];
      return;
    }
    if (emailFields.includes(key) && !/^\S+@\S+\.\S+$/.test(String(value))) {
      errors[key] = "Email sahi nahi hai";
      return;
    }
    if (passwordFields[key] !== undefined && String(value).trim().length < passwordFields[key]) {
      errors[key] = `Password kam az kam ${passwordFields[key]} huroof ka hona chahiye`;
    }
  });

  return errors;
};
