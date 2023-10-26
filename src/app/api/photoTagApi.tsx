import axios from "axios";

const photoTagApi = axios.create({
  baseURL: "http://phototagapi-production.up.railway.app/",
  withCredentials: true,
});

export default photoTagApi;
