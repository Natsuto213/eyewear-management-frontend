import axios from "axios";

const HARD_CODE_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkZXZ0ZXJpYS5jb20iLCJzdWIiOiJhbm5ndXllbiIsImV4cCI6MTc2OTU3MzE2NSwiaWF0IjoxNzY5NTY5NTY1LCJzY29wZSI6IlJPTEVfQURNSU4ifQ.GPb4LXVSfXOCM6oxfvv8uaJS0P_aThCwS5OcbxcywaMlNyLxfpvnfSKO37fH3LNKYDt9EYeX9zHWUG_loriN_g";

  const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  config.headers.set("Authorization", `Bearer ${HARD_CODE_TOKEN}`);
  return config;
});

export default api;
