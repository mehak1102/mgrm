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
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AnimatedLotus from "../components/AnimatedLotus";
import ThemeSelector from "../components/ThemeSelector";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import {
  SectionLabel,
  SectionHeading,
  FadeUpText,
} from "../components/typography/TypographyMotion";

export default function Login() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
    toast.success(t("auth.loginSuccess"));
    navigate("/");
  } catch (err) {
    toast.error(err.response?.data?.msg || t("auth.loginFailed"));
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
            ? "w-full max-w-6xl min-h-[720px] bg-[#111827]/80 backdrop-blur-xl rounded-[46px] shadow-[0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden grid lg:grid-cols-[0.9fr_1.1fr] border border-white/10 transition-colors duration-300"
            : "w-full max-w-6xl min-h-[720px] bg-card/95 backdrop-blur-xl rounded-[46px] shadow-theme-lg overflow-hidden grid lg:grid-cols-[0.9fr_1.1fr] border border-edge transition-colors duration-300"
        }
      >
        <div
          className={
            isDark
              ? "p-8 md:p-14 flex flex-col justify-center bg-[#0b1020]/60 border-r border-white/10 transition-colors duration-300"
              : "p-8 md:p-14 flex flex-col justify-center bg-surface-elevated/80 border-r border-edge transition-colors duration-300"
          }
        >
          <Link to="/" className="mb-10 inline-flex">
            <img src="/logo.png" alt="MGRM Medicare" className="h-14 object-contain" />
          </Link>

          <SectionLabel className="text-purple-700 dark:text-cyan-400 font-black tracking-widest text-sm transition-colors duration-300">
            {t("auth.welcomeBack")}
          </SectionLabel>
          <SectionHeading
            text={t("auth.helloAgain")}
            as="h1"
            className="typo-hero-title mt-3 text-slate-950 dark:text-zinc-50"
          />
          <FadeUpText className="text-gray-500 dark:text-slate-300 mt-3 transition-colors duration-300">
            {t("auth.signInCopy")}
          </FadeUpText>

          <form onSubmit={submit} className="mt-9 space-y-4">
            <div className="relative">
              <Mail className="absolute left-5 top-4 text-gray-400 dark:text-slate-400 transition-colors duration-300" size={20} />
              <input
                required
                type="email"
                placeholder={t("common.email")}
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
                placeholder={t("common.password")}
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

            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-sm font-bold text-purple-700 dark:text-cyan-400 transition-colors duration-300"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            <button
              disabled={loading}
              className="w-full btn-primary rounded-2xl py-4 font-black shadow-xl dark:shadow-[0_0_30px_rgba(34,211,238,0.32)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? t("auth.signingIn") : t("auth.signIn")}
            </button>
          </form>

          <div className="mt-7 flex items-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
            <span className="text-gray-400 dark:text-slate-400 text-sm transition-colors duration-300">{t("common.or")}</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
          </div>

          <p className="mt-6 text-center text-gray-500 dark:text-slate-300 transition-colors duration-300">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="font-black text-purple-700 dark:text-cyan-400 transition-colors duration-300">
              {t("auth.register")}
            </Link>
          </p>
        </div>

        <div className="hidden lg:block p-5 transition-colors duration-300">
          <div className="relative h-full rounded-[36px] overflow-hidden border border-slate-200 dark:border-white/10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.45)] transition-colors duration-300">
            <AnimatedLotus />
          </div>
        </div>
      </section>
    </main>
  );
}