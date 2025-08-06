import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const checkPasswordStrength = (password) => {
  if (password.length < 6) return "Weak";
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "Strong";
  return "Medium";
};

const strengthColors = {
  Weak: "bg-red-400",
  Medium: "bg-yellow-400",
  Strong: "bg-green-500",
};

export default function Auth() {
  const { signup, login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (currentUser) navigate("/feed");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateEmail(form.email)) newErrors.email = "Invalid email";
    if (form.password.length < 6) newErrors.password = "Min 6 characters required";
    if (!isLogin && form.password !== form.confirm) newErrors.confirm = "Passwords don’t match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      isLogin ? await login(form.email, form.password) : await signup(form.email, form.password);
      navigate("/feed");
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = checkPasswordStrength(form.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center px-4 relative">

      {/* 🏠 Floating Home Icon */}
      <button onClick={() => navigate("/")} className="absolute top-4 left-4 text-indigo-600 hover:text-indigo-800 transition">
        <FaHome size={24} />
      </button>

      <motion.div
        className="bg-white/30 border border-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? "Welcome Back 👋" : "Join EchoSphere 🚀"}
        </h2>

        {errors.general && (
          <p className="text-red-600 text-sm text-center mb-3">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute top-3 left-3 text-gray-400"
            >
              <FaEnvelope />
            </motion.span>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-3 left-3 text-gray-400"
            >
              <FaLock />
            </motion.span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <span
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}

            {form.password && (
              <div className="mt-2">
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full ${strengthColors[passwordStrength]} transition-all`}
                    style={{
                      width:
                        passwordStrength === "Weak"
                          ? "33%"
                          : passwordStrength === "Medium"
                          ? "66%"
                          : "100%",
                    }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">Strength: {passwordStrength}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative"
              >
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  name="confirm"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirm}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                {errors.confirm && <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          {isLogin ? "Don’t have an account?" : "Already a user?"}{" "}
          <button
            onClick={() => setIsLogin((prev) => !prev)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
