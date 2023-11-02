import axios from "axios";

const photoTagApi = axios.create({
  // baseURL: "https://phototagapi-production.up.railway.app/",
  baseURL: "http://localhost:3500/",
  withCredentials: true,
});

export default photoTagApi;
