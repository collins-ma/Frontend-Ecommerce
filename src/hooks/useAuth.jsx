import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";

import {jwtDecode} from "jwt-decode"

const useAuth = () => {
  let isAdmin = false;
  let isUser = false;
  let username = "";
  let status = "User";
  let userId = "";
  let roles = [];
  let currentSessionId = ""; // <-- add this

  const token = useSelector(selectCurrentToken);

  if (token) {
    try {
      const decoded = jwtDecode(token);

      roles = decoded?.roles || [];
      isAdmin = roles.includes("admin");
      isUser = roles.includes("user");
      username = decoded?.username || "";
      userId = decoded?._id || "";
      currentSessionId = decoded?.sessionId || ""; // <-- decode sessionId

      if (isAdmin) status = "Admin";
    } catch (err) {
      console.error("Failed to decode token:", err);

      return {
        isAdmin: false,
        isUser: false,
        username: "",
        status: "User",
        roles: [],
        userId: "",
        currentSessionId: ""
      };
    }
  }

  return {
    isAdmin,
    isUser,
    username,
    status,
    roles,
    userId,
    currentSessionId, // <-- return it
  };
};

export default useAuth;
