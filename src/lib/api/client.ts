import axios from "axios";
import { normalizeError } from "./error";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeError(error);
    const hasBearerToken =
      axios.isAxiosError(error) &&
      Boolean(
        axios.AxiosHeaders.from(error.config?.headers).get("Authorization"),
      );

    if (
      normalizedError.status === 401 &&
      hasBearerToken &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.replace("/login?reason=session-expired");
    }

    return Promise.reject(normalizedError);
  },
);
