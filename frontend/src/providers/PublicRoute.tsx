import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, logoutUser } from "../stores/Slices/UserSlices";
export default function PublicRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(" https://note-app-7cn6.onrender.com/auth/check", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.isLoggedIn) {
          dispatch(setUser(res.data.user));
          navigate("/");
        }
        setLoading(false);
      })
      .catch(() => {
        dispatch(logoutUser());
        setLoading(false);
      });
  }, [navigate]);
  if (loading) return <p>Loading...</p>;
  return children;
}
