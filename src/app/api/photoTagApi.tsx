import axios from "axios";

const photoTagApi = axios.create({
  baseURL: "https://sunset-chance-production.up.railway.app/",
  withCredentials: true,
});

export default photoTagApi;
