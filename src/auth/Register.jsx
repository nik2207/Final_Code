import React, { useState } from "react";
import { sendSmsOtp, signInWithGoogle } from "./authService";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isSignInClicked, setIsSignInClicked] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!phone.startsWith("+91")) {
      setError("Please enter phone number in format: +91XXXXXXXXXX");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendSmsOtp(phone, "recaptcha-container");
      localStorage.setItem("myezz_pending_user", JSON.stringify({ name, email, phone }));
      navigate("/otp-verify");
    } catch (error) {
      setError("Failed to send OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError("");
    
    try {
      const user = await signInWithGoogle();
      
      const userData = {
        uid: user.uid,
        phone: user.phoneNumber || "",
        displayName: user.displayName || "",
        email: user.email || "",
      };
      
      localStorage.setItem("myezz_user", JSON.stringify(userData));
      
      setToast({
        show: true,
        message: `Welcome to MyEzz, ${user.displayName || 'User'}! 🎉`,
        type: "success"
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {
      setError(`Sign-up failed: ${error.message}`);
      
      setToast({
        show: true,
        message: "Sign-up failed. Please try again.",
        type: "error"
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignInClick = () => {
    setIsSignInClicked(true);
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  const closeToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 to-red-500 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center items-center px-12 w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">Welcome to MyEzz</h1>
            <p className="text-xl opacity-90 text-white drop-shadow-md">Food delivery at your seat</p>
          </div>
          
          <div className="flex justify-between items-center w-full max-w-md">
            <div className="flex justify-center items-center">
              <img src="/spoonandfork355-zham.svg" alt="Spoon" className="w-48 h-48 transform -rotate-12" />
            </div>
            
            <div className="flex justify-center items-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-gray-200"></div>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <img src="/spoonandfork322-728kk.svg" alt="Fork" className="w-48 h-48 transform rotate-12" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">MyEzz</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join MyEzz and start ordering delicious food</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 py-4 px-6 rounded-xl text-lg font-medium shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed mb-6"
          >
            {googleLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                Creating account...
              </>
            ) : (
              <>
                <img 
                  src="/googlelogo354-ccx-200w.png" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </button>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Enter your phone number with country code</p>
            </div>

            <div id="recaptcha-container" className="flex justify-center"></div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-4 px-6 rounded-xl text-lg font-medium shadow-sm transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button 
                onClick={handleSignInClick}
                className={`text-orange-500 hover:text-orange-600 font-medium transition-all duration-300 ${
                  isSignInClicked 
                    ? 'scale-110 ring-4 ring-orange-200 bg-orange-50 px-3 py-1 rounded-lg' 
                    : 'hover:scale-105'
                }`}
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={closeToast}
      />
    </div>
  );
}
