import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import axios from 'axios';
import { URL } from '../url';
import { useNavigate } from "react-router-dom";
import zxcvbn from 'zxcvbn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VscEyeClosed } from "react-icons/vsc";
import { FaEye } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${URL}/api/auth/register`, { username, email, password });
      setUsername('');
      setEmail('');
      setPassword('');
      setError(false);
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(true);
      toast.error('Registration failed. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const result = zxcvbn(newPassword);
    setPasswordStrength({
      score: result.score,
      feedback: result.feedback.suggestions.join(' ')
    });
  };

  const getStrengthClass = (score) => {
    switch (score) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return '';
    }
  };

  const handlePasswordGeneratorClick = () => {
    window.open('https://rpg-kushagra.onrender.com', '_blank'); 
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
          <h1 className="md:text-xl text-lg font-extrabold text-cyan-300">
            <Link to="/">
              <img src="/LOGO.png" className="text-sm" alt="Logo" />
            </Link>
          </h1>
          <h3>
            <Link to="/login">Login</Link>
          </h3>
        </div>
        <div className='w-full flex justify-center items-center h-[80vh]'>
          <div className='flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]'>
            <h1 className='text-xl font-bold text-left'>Create an Account</h1>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder='Enter your username'
              className='w-full px-4 py-2 border-2 border-black outline-0'
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder='Enter your Email'
              className='w-full px-4 py-2 border-2 border-black outline-0'
            />
            <div className='relative w-full'>
              <input
                onChange={handlePasswordChange}
                value={password}
                type={passwordVisible ? 'text' : 'password'}
                placeholder='Enter your Password'
                className='w-full px-4 py-2 border-2 border-black outline-0'
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className='absolute inset-y-0 right-0 flex items-center px-3'
              >
                {passwordVisible ? (
                  <span className='text-green-600'><FaEye /></span>
                ) : (
                  <span className='text-red-600'><VscEyeClosed /></span>
                )}
              </button>
            </div>
            <p
              onClick={handlePasswordGeneratorClick}
              className='text-blue-500 cursor-pointer mt-2'
            >
              Need a random password? Click me!
            </p>
            <div className='w-full mt-2'>
              <div className={`h-2 ${getStrengthClass(passwordStrength.score)} rounded-full`} style={{ width: `${(passwordStrength.score + 1) * 20}%` }}></div>
              <p className='text-sm text-gray-500 mt-1'>{passwordStrength.feedback}</p>
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className='w-full px-4 py-4 text-xl font-bold text-white bg-black rounded-lg hover:bg-blue-600 hover:text-white disabled:opacity-50'
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            {error && <h3 className="text-red-500 text-sm">Something went wrong</h3>}
            <div className='flex justify-center items-center space-x-3'>
              <p>Already have an account?</p>
              <p className="text-gray-500">
                <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
