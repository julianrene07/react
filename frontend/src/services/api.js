import axios from "axios";

const api = axios.create({
  baseURL: "https://ominous-adventure-g4xvpww776q9397x4-3000.app.github.dev",
  withCredentials: true,
});

export default api;