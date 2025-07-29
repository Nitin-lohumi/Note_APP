import { motion } from "framer-motion";
import Logo from "./Logo";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../stores/Slices/UserSlices";
import { useDispatch } from "react-redux";
import axios from "axios";
export const API = axios.create({
  baseURL: "https://note-app-7cn6.onrender.com",
  withCredentials: true,
});
function SignUp() {
  const dispatch = useDispatch();
  const router = useNavigate();
  const [isOtpSend, setIsOtpSend] = useState(false);
  useEffect(() => {}, []);
  const [Data, setData] = useState({
    name: "",
    email: "",
    dob: "",
    otp: "",
  });
  const [isError, setIsError] = useState({
    name: "",
    email: "",
    dob: "",
    otp: "",
  });
  const Validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Data.name) {
      setIsError((prev) => ({
        ...prev,
        name: "Name is Required",
        email: "",
        dob: "",
      }));
      return false;
    }
    if (!Data.dob) {
      setIsError((prev) => ({
        ...prev,
        email: "",
        name: "",
        dob: "DOB is Required",
      }));
      setIsOtpSend(false);
      return false;
    }
    if (!Data.email) {
      setIsError((prev) => ({
        ...prev,
        email: "Email is Required",
        name: "",
        dob: "",
      }));
      setIsOtpSend(false);
      return false;
    }

    if (!emailRegex.test(Data.email)) {
      setIsError((prev) => ({
        ...prev,
        email: "Email is not Vaild",
        name: "",
        dob: "",
      }));
      setIsOtpSend(false);
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
      name: "",
      email: "",
      dob: "",
      otp: "",
    }));
    try {
      const res = await API.post("/api/auth/signup/otp", { email: Data.email });
      console.log("OTP sent:", res.data);
      toast.success("otp send In Provided email valid For 5 min");
      setIsOtpSend(true);
    } catch (err: any) {
      console.error("OTP send error:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  }

  const HandleSingup = async () => {
    if (!Validate()) {
      return;
    }
    if (!Data.otp) {
      setIsError((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }
    try {
      const res = await API.post("/api/auth/signup/verify", {
        email: Data.email,
        otp: Data.otp,
        name: Data.name,
        DOB: Data.dob,
      });
      console.log("Signup success:", res.data);
      toast.success("Signup successful!");
      router("/");
    } catch (err: any) {
      dispatch(logoutUser());
      console.error("Signup error:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <motion.div className="md:grid flex md:grid-cols-2 p-2 md:h-auto w-full rounded-2xl md:shadow-gray-600 md:shadow-xl">
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
              Sign up
            </h2>
            <p className="text-gray-400 md:text-start text-center">
              Sign up to enjoy the feature of HD
            </p>
            <div className="mt-8 md:mt-2">
              <TextField
                label="Your Name"
                variant="outlined"
                fullWidth
                value={Data.name}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, name: e.target.value }))
                }
                sx={{
                  input: { fontSize: "19px" },
                  label: { fontSize: "17px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <span className="text-red-500">{isError.name}</span>
            </div>
            <div className="mt-5 md:mt-3">
              <TextField
                label="Date of birth"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={Data.dob}
                variant="outlined"
                fullWidth
                onChange={(e) =>
                  setData((prev) => ({ ...prev, dob: e.target.value }))
                }
                sx={{
                  input: { fontSize: "19px" },
                  label: { fontSize: "17px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <span className="text-red-500">{isError.dob}</span>
            </div>
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
            {isOtpSend && (
              <>
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
                  <span>{isError.otp}</span>
                </div>
                <button
                  onClick={handleGetOtp}
                  className="cursor-pointer border mt-2 p-1 text-xl capitalize w-fit"
                  disabled={!isOtpSend}
                >
                  resend Otp
                </button>
              </>
            )}

            <div className="mt-5 mb-4 md:mt-2 md:mb-2">
              <Button
                variant="contained"
                color="primary"
                className="w-full"
                onClick={isOtpSend ? HandleSingup : handleGetOtp}
                sx={{
                  borderRadius: "8px",
                  fontSize: "17px",
                  fontWeight: "600 ",
                }}
              >
                {!isOtpSend ? "Get OTP" : "Signup"}
              </Button>
            </div>
            <div className=" flex items-center justify-center mt-3 md:mt-1">
              <p className="text-gray-600">Already have an account??</p>{" "}
              <Link to="/auth/login" className="text-blue-700 font-semibold">
                Sign in
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

export default SignUp;
