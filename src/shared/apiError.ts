import axios from "axios";

/** Returns the message sent by the server, or a simple fallback. */
export const getErrorMessage = (
  error: unknown,
  fallback = "Kuch masla aa gaya. Dobara koshish karein.",
): string => {
  if (axios.isAxiosError(error)) {
    const dataMessage = error.response?.data?.message;
    if (Array.isArray(dataMessage) && dataMessage.length > 0) {
      return String(dataMessage[0]);
    }
    if (typeof dataMessage === "string" && dataMessage.trim()) {
      return dataMessage.trim();
    }
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      const isEnglish = fallback.includes("admin") || fallback.includes("Failed");
      return isEnglish
        ? "Cannot connect to server. Please ensure the backend is running."
        : "Server se rabta nahi ho saka. Internet ya backend check karein.";
    }
    if (typeof error.response?.data?.error === "string") {
      return error.response.data.error;
    }
    return fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};
