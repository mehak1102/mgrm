import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import API from "../api";
import AnimatedLotus from "../components/AnimatedLotus";
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-5 grid place-items-center">
      <section className="w-full max-w-6xl min-h-[720px] bg-white/80 backdrop-blur-xl rounded-[46px] shadow-[0_40px_120px_rgba(15,23,42,0.18)] overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] border border-white">
        <div className="hidden lg:block p-5">
          <div className="h-full rounded-[36px] overflow-hidden">
            <AnimatedLotus />
          </div>
        </div>

        <div className="p-8 md:p-14 flex flex-col justify-center">
          <Link to="/" className="mb-10 inline-flex">
            <img src="/logo.png" alt="MGRM Medicare" className="h-14 object-contain" />
          </Link>

          <p className="text-purple-700 font-black tracking-widest text-sm">CREATE ACCOUNT</p>
          <h1 className="text-5xl font-black mt-3 text-slate-950">Join MGRM</h1>
          <p className="text-gray-500 mt-3">Create your account for faster checkout and order tracking.</p>

          <form onSubmit={submit} className="mt-9 space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-4 text-gray-400" size={20} />
              <input
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-4 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-5 top-4 text-gray-400" size={20} />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-4 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-4 text-gray-400" size={20} />
              <input
                required
                type={show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-14 outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-5 top-4 text-gray-400"
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-700 to-cyan-600 text-white rounded-2xl py-4 font-black shadow-xl hover:scale-[1.01] transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-black text-purple-700">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}