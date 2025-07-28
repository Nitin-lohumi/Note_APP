import { useDispatch } from "react-redux";
import { logoutUser } from "../stores/Slices/UserSlices";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { API } from "./SignUp";
import { toast } from "react-toastify";
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignout = async () => {
    try {
      await API.get("/auth/logout");
      navigate("/auth/login");
      toast.success("logout sucess");
      dispatch(logoutUser());
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-between items-center w-full p-2 md:mt-1 mt-3">
      <div className="flex justify-center items-center">
        <Logo />
        <p className="text-xl md:font-semibold font-bold">DashBord</p>
      </div>
      <div className="text-blue-600 underline cursor-pointer" onClick={handleSignout}>
        signout
      </div>
    </div>
  );
}

export default Header;
