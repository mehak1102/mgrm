// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await login(form);
//       navigate("/");
//     } catch {
//       alert("Login failed");
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center">
//       <form onSubmit={handleSubmit} className="card p-10 rounded-3xl w-full max-w-md">
//         <h1 className="text-3xl font-black mb-6">Login</h1>

//         <input
//           placeholder="Email"
//           className="w-full mb-4 p-3 border rounded-xl"
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-3 border rounded-xl"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         <button className="btn-primary w-full py-3 rounded-xl font-bold">
//           Login
//         </button>

//         <p className="mt-4 text-sm">
//           No account? <Link to="/register" className="text-blue-600">Register</Link>
//         </p>
//       </form>
//     </main>
//   );
// }


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AnimatedLotus from "../components/AnimatedLotus";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // const submit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // await login(form.email, form.password);
  //     await login(form);
  //     navigate("/");
  //   } catch (err) {
  //     alert(err.response?.data?.msg || "Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await login(form);
    toast.success("Login successful");
    navigate("/");
  } catch (err) {
    toast.error(err.response?.data?.msg || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-5 grid place-items-center">
      <section className="w-full max-w-6xl min-h-[720px] bg-white/80 backdrop-blur-xl rounded-[46px] shadow-[0_40px_120px_rgba(15,23,42,0.18)] overflow-hidden grid lg:grid-cols-[0.9fr_1.1fr] border border-white">
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <Link to="/" className="mb-10 inline-flex">
            <img src="/logo.png" alt="MGRM Medicare" className="h-14 object-contain" />
          </Link>

          <p className="text-purple-700 font-black tracking-widest text-sm">WELCOME BACK</p>
          <h1 className="text-5xl font-black mt-3 text-slate-950">Hello Again!</h1>
          <p className="text-gray-500 mt-3">Sign in to continue shopping and track your orders.</p>

          <form onSubmit={submit} className="mt-9 space-y-4">
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-7 flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <p className="mt-6 text-center text-gray-500">
            No account?{" "}
            <Link to="/register" className="font-black text-purple-700">
              Register
            </Link>
          </p>
        </div>

        <div className="hidden lg:block p-5">
          <div className="h-full rounded-[36px] overflow-hidden">
            <AnimatedLotus />
          </div>
        </div>
      </section>
    </main>
  );
}