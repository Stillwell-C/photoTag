import axios from "axios";

const photoTagApi = axios.create({
  baseURL: "https://phototagapi-production.up.railway.app/",
  withCredentials: true,
});

export default photoTagApi;
