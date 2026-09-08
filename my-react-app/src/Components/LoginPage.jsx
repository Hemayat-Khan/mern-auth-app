import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import bgImage from "../assets/Mountains.jpg";
import { loginUser } from "../redux/authSlice";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Required";
    if (!form.password) next.password = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(loginUser({ email: form.email, password: form.password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard"); // change to wherever a logged-in user should land
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/25" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md shadow-2xl px-8 py-9"
      >
        <h1 className="text-center text-2xl font-bold text-white mb-6 tracking-tight">
          login
        </h1>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 focus-within:border-white/60 transition-colors">
              <Mail size={16} className="text-white/70 shrink-0" />
              <input
                type="email"
                placeholder="email"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full bg-transparent outline-none text-white placeholder-white/60 text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-red-200 text-xs mt-1 ml-3">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 focus-within:border-white/60 transition-colors">
              <Lock size={16} className="text-white/70 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={form.password}
                onChange={handleChange("password")}
                className="w-full bg-transparent outline-none text-white placeholder-white/60 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-white/60 hover:text-white shrink-0"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-200 text-xs mt-1 ml-3">{errors.password}</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-200 text-xs text-center mt-4">{error}</p>
        )}

        <div className="flex items-center justify-between mt-4 text-xs text-white/80">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember((r) => !r)}
              className="accent-white/80 w-3.5 h-3.5"
            />
            remember me
          </label>
          <button type="button" className="hover:text-white transition-colors">
            forgot password
          </button>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full mt-6 rounded-full bg-white text-gray-900 font-semibold text-sm py-2.5 hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {status === "loading" ? "logging in..." : "login"}
        </button>

        <p className="text-center text-xs text-white/80 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="font-semibold text-white hover:underline">
            register
          </a>
        </p>
      </form>
    </div>
  );
}