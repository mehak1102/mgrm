import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import API from "../api";
import AnimatedLotus from "../components/AnimatedLotus";
import ThemeSelector from "../components/ThemeSelector";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import {
  SectionLabel,
  SectionHeading,
  FadeUpText,
} from "../components/typography/TypographyMotion";

export default function Register() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      toast.success("Account created successfully");
      // alert("Account created. Please login.");
      navigate("/login");
    } catch (err) {
      // alert(err.response?.data?.msg || "Register failed");
      toast.error(err.response?.data?.msg || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={
        isDark
          ? "relative min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 p-5 grid place-items-center transition-colors duration-300"
          : "relative min-h-screen bg-app-gradient p-5 grid place-items-center transition-colors duration-300"
      }
    >
      <div className="absolute top-6 right-6 z-20">
        <ThemeSelector />
      </div>
      <section
        className={
          isDark
            ? "w-full max-w-6xl min-h-[720px] bg-[#111827]/80 backdrop-blur-xl rounded-[46px] shadow-[0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] border border-white/10 transition-colors duration-300"
            : "w-full max-w-6xl min-h-[720px] bg-card/95 backdrop-blur-xl rounded-[46px] shadow-theme-lg overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] border border-edge transition-colors duration-300"
        }
      >
        <div className="hidden lg:block p-5 transition-colors duration-300">
          <div className="relative h-full rounded-[36px] overflow-hidden border border-slate-200 dark:border-white/10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.45)] transition-colors duration-300">
            <AnimatedLotus />
          </div>
        </div>

        <div
          className={
            isDark
              ? "p-8 md:p-14 flex flex-col justify-center bg-[#0b1020]/60 border-l border-white/10 transition-colors duration-300"
              : "p-8 md:p-14 flex flex-col justify-center bg-surface-elevated/80 border-l border-edge transition-colors duration-300"
          }
        >
          <Link to="/" className="mb-10 inline-flex">
            <img src="/logo.png" alt="MGRM Medicare" className="h-14 object-contain" />
          </Link>

          <SectionLabel className="text-purple-700 dark:text-cyan-400 font-black tracking-widest text-sm transition-colors duration-300">
            CREATE ACCOUNT
          </SectionLabel>
          <SectionHeading
            text="Join MGRM"
            as="h1"
            className="text-5xl font-black mt-3 text-slate-950 dark:text-zinc-50"
          />
          <FadeUpText className="text-gray-500 dark:text-slate-300 mt-3 transition-colors duration-300">
            Create your account for faster checkout and order tracking.
          </FadeUpText>

          <form onSubmit={submit} className="mt-9 space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-4 text-gray-400 dark:text-slate-400 transition-colors duration-300" size={20} />
              <input
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-4 outline-none text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-400/40 transition-colors duration-300"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-5 top-4 text-gray-400 dark:text-slate-400 transition-colors duration-300" size={20} />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-4 outline-none text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-400/40 transition-colors duration-300"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-4 text-gray-400 dark:text-slate-400 transition-colors duration-300" size={20} />
              <input
                required
                type={show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-14 outline-none text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-400/40 transition-colors duration-300"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-5 top-4 text-gray-400 dark:text-slate-400 transition-colors duration-300"
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full btn-primary rounded-2xl py-4 font-black shadow-xl dark:shadow-[0_0_30px_rgba(34,211,238,0.32)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 dark:text-slate-300 transition-colors duration-300">
            Already have an account?{" "}
            <Link to="/login" className="font-black text-purple-700 dark:text-cyan-400 transition-colors duration-300">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}