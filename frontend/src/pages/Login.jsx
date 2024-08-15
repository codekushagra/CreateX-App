import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../components/Footer";
import { VscEyeClosed } from "react-icons/vsc";
import { FaEye } from "react-icons/fa";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Show 'Verifying credentials' toast immediately
    toast.info("Verifying credentials...", {
      autoClose: 8000,
    });

    try {
      const res = await axios.post(URL + "/api/auth/login", { email, password }, { withCredentials: true });
      setUser(res.data);
      toast.dismiss();  // Dismiss the 'Verifying credentials...' toast
      toast.success(`Welcome, ${res.data.username}!`); // Show 'Welcome user' toast
      navigate("/");
    } catch (err) {
      setError(true);
      toast.error("Something went wrong!");
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-between px-6 md:px-[200px] py-4">
        <Link to="/">
          <img src="LOGO.png" alt="Logo" />
        </Link>
        <h3>
          <Link to="/register">Register</Link>
        </h3>
      </div>
      <div className="bg-gray-100 w-full flex justify-center items-center h-[80vh]">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Log in to your account</h1>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="text"
            placeholder="Enter your email"
          />
          <div className="relative w-full">
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black outline-0"
              type={showPassword ? "text" : "password"} // Toggle input type
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <span className='text-red-600'><VscEyeClosed /></span>
              ) : (
                <span className='text-green-600'><FaEye /></span>
              )}
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black"
          >
            Log in
          </button>
          {error && <h3 className="text-red-500 text-sm">Something went wrong</h3>}
          <div className="flex justify-center items-center space-x-3">
            <p>New here?</p>
            <p className="text-gray-500 hover:text-black">
              <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Login;
