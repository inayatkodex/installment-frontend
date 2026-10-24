import axios from "axios";

/** Returns the message sent by the server, or a simple fallback. */
export const getErrorMessage = (
  error: unknown,
  fallback = "Kuch masla aa gaya. Dobara koshish karein.",
): string => {
  if (axios.isAxiosError(error))
    return (error.response?.data?.message as string) || fallback;
  return fallback;
};
