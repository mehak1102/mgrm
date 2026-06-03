import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import API from "../api";
import AnimatedLotus from "../components/AnimatedLotus";
import ThemeSelector from "../components/ThemeSelector";
import toast from "react-hot-toast";

export default function Register() {
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
    <main className="relative min-h-screen bg-app-gradient p-5 grid place-items-center transition-colors duration-300">
      <div className="absolute top-6 right-6 z-20">
        <ThemeSelector />
      </div>
      <section className="w-full max-w-6xl min-h-[720px] bg-card/95 backdrop-blur-xl rounded-[46px] shadow-theme-lg overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] border border-edge transition-colors duration-300">
        <div className="hidden lg:block p-5 transition-colors duration-300">
          <div className="relative h-full rounded-[36px] overflow-hidden border border-edge shadow-theme-md transition-colors duration-300">
            <AnimatedLotus />
          </div>
        </div>

        <div className="p-8 md:p-14 flex flex-col justify-center bg-surface-elevated/80 border-l border-edge transition-colors duration-300">
          <Link to="/" className="mb-10 inline-flex">
            <img src="/logo.png" alt="MGRM Medicare" className="h-14 object-contain" />
          </Link>

          <p className="text-purple-700 text-brand font-black tracking-widest text-sm transition-colors duration-300">CREATE ACCOUNT</p>
          <h1 className="text-5xl font-black mt-3 text-fg">Join MGRM</h1>
          <p className="text-gray-500 text-fg-muted mt-3 transition-colors duration-300">Create your account for faster checkout and order tracking.</p>

          <form onSubmit={submit} className="mt-9 space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-4 text-gray-400 text-fg-muted transition-colors duration-300" size={20} />
              <input
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full theme-panel rounded-2xl py-4 pl-14 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 transition-colors duration-300"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-5 top-4 text-gray-400 text-fg-muted transition-colors duration-300" size={20} />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full theme-panel rounded-2xl py-4 pl-14 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 transition-colors duration-300"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-4 text-gray-400 text-fg-muted transition-colors duration-300" size={20} />
              <input
                required
                type={show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full theme-panel rounded-2xl py-4 pl-14 pr-14 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 transition-colors duration-300"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-5 top-4 text-gray-400 text-fg-muted transition-colors duration-300"
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full btn-primary rounded-2xl py-4 font-black shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-fg-muted transition-colors duration-300">
            Already have an account?{" "}
            <Link to="/login" className="font-black text-purple-700 text-brand transition-colors duration-300">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}