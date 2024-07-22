import axios from "axios";
const AxiosInstance = axios.create({
  baseURL: "http://119.235.112.154:3003/api/v1",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});
const AxiosInstanceFormData = axios.create({
  baseURL: "http://119.235.112.154:3003/api/v1",
  timeout: 100000,
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  },
});
export { AxiosInstance };
export { AxiosInstanceFormData };