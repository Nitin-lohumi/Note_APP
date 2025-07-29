import { Checkbox, FormControlLabel } from "@mui/material";
import { motion } from "framer-motion";
import Logo from "./Logo";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "./SignUp";
import { toast } from "react-toastify";
import { logoutUser } from "../stores/Slices/UserSlices";
import { useDispatch } from "react-redux";
function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isKeepLogedIn, setisKeepLogedin] = useState(false);
  const [isReSend, setIsReSend] = useState(false);
  const [Data, setData] = useState({
    email: "",
    otp: "",
  });
  const [isError, setIsError] = useState({
    email: "",
    otp: "",
  });
  const Validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Data.email) {
      setIsError((prev) => ({
        ...prev,
        email: "Email is Required",
        otp: "",
      }));
      return false;
    }
    if (!emailRegex.test(Data.email)) {
      setIsError((prev) => ({
        ...prev,
        email: "Email is not Vaild",
        otp: "",
      }));
      return false;
    }
    return true;
  };

  async function handleGetOtp() {
    if (!Validate()) {
      return;
    }
    setIsError((prev) => ({
      ...prev,
      email: "",
      otp: "",
    }));
    setIsReSend(true);
    try {
      await API.post("/api/auth/login/otp", { email: Data.email });
      toast.success("otp send In Provided email ,valid For 5 min");
      if (isReSend) setData((prev) => ({ ...prev, otp: "" }));
    } catch (err: any) {
      console.error("OTP send error:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  }

  async function handleLogin() {
    if (!Validate()) {
      return;
    }
    if (!Data.otp) {
      setIsError((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }
    try {
      const res = await API.post("/api/auth/login/verify", {
        email: Data.email,
        otp: Data.otp,
        keepMeLoggedIn: isKeepLogedIn,
      });
      toast.success("login successful!");
      console.log(res);
      navigate("/");
    } catch (err: any) {
      dispatch(logoutUser());
      console.error("login error:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "login failed");
    }
  }

  const handleChange = () => {
    setisKeepLogedin((prev) => !prev);
  };

  return (
    <motion.div className="md:grid flex md:grid-cols-2 md:h-auto w-full p-2  rounded-2xl md:shadow-gray-600 md:shadow-xl">
      <motion.div className="col-span-1 flex flex-col w-full">
        <div className="h-[40px] mb-1 mt-5 md:px-4 md:mt-3 flex md:justify-start justify-center items-center">
          <Logo />
          <p className=" font-bold text-2xl">HD</p>
        </div>
        <div
          className="flex justify-center md:items-center mt-4 md:mt-0"
          style={{ minHeight: "calc(100% - 50px)" }}
        >
          <motion.div
            initial={{ opacity: 0, x: 250 }}
            animate={{ opacity: [0.1, 0.3, 0.5, 0.7, 1], x: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="w-full md:mx-10 mx-2 md:p-2 flex flex-col gap-1"
          >
            <h2 className="font-bold md:text-xl text-3xl text-gray-900  my-2 md:my-0 md:text-start text-center">
              Sign in
            </h2>
            <p className="text-gray-400 md:text-start text-center">
              Please login to continue to your account.
            </p>
            <div className="mt-5 md:mt-3">
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={Data.email}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
                sx={{
                  input: { fontSize: "19px" },
                  label: { fontSize: "17px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <span className="text-red-500">{isError.email}</span>
            </div>
            <div className="mt-5 md:mt-3">
              <TextField
                label="OTP"
                type="number"
                variant="outlined"
                fullWidth
                value={Data.otp}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, otp: e.target.value }))
                }
                sx={{
                  input: { fontSize: "19px" },
                  label: { fontSize: "17px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <span className="text-red-500">{isError.otp}</span>
            </div>
            <button
              className="underline text-blue-500 inline text-start w-fit mt-2 mb-2 cursor-pointer"
              onClick={handleGetOtp}
            >
              {isReSend ? "Resend otp" : "Send otp"}
            </button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isKeepLogedIn}
                  onChange={handleChange}
                  color="primary"
                  size="medium"
                  sx={{ borderRadius: 1 }}
                />
              }
              label="Keep me logged in"
            />
            <div className="mt-5 mb-4 md:mt-2 md:mb-2">
              <Button
                variant="contained"
                color="primary"
                className="w-full"
                onClick={handleLogin}
                sx={{
                  borderRadius: "8px",
                  fontSize: "17px",
                  fontWeight: "600 ",
                }}
              >
                Sign in
              </Button>
            </div>
            <div className=" flex items-center justify-center mt-3 md:mt-1">
              <p className="text-gray-600">Need an account?</p>{" "}
              <Link to="/auth/signup" className="text-blue-700 font-semibold">
                Create one
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="p-2 md:block hidden col-span-1 h-auto z-10">
        <div className="h-auto">
          <img src="/sideImage.png" alt="SideImage" className="h-auto" />
        </div>
      </motion.div>
    </motion.div>
  );
}
export default LoginPage;
