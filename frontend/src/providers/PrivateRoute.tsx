import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, logoutUser } from "../stores/Slices/UserSlices";
import axios from "axios";
export default function PrivateRoute({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get("https://note-app-7cn6.onrender.com/auth/check", { withCredentials: true })
      .then((res) => {
        dispatch(setUser(res.data.user));
        return setAuth(res.data.user);
      })
      .catch(() => {
        dispatch(logoutUser());
        return setAuth("false");
      });
  }, []);
  if (auth == "") return;
  if (auth == "false") return <Navigate to={"/auth/login"} />;
  return children;
}
