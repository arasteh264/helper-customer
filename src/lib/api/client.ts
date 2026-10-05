import axios from "axios";
import { normalizeError } from "./error";
import { API_BASE_URL } from "./base-url";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.set("Content-Type", false);
  }

  return config;
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
