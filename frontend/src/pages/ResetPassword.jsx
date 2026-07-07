import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
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

export default function ResetPassword() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const invalidLink = !token || !email;

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/reset-password", { email, token, password });
      toast.success(res.data?.msg || t("auth.resetPasswordSuccess"));
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || t("auth.resetPasswordFailed"));
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
            {t("auth.resetPasswordBadge")}
          </SectionLabel>
          <SectionHeading
            text={t("auth.resetPasswordTitle")}
            as="h1"
            className="text-5xl font-black mt-3 text-slate-950 dark:text-zinc-50"
          />
          <FadeUpText className="text-gray-500 dark:text-slate-300 mt-3 transition-colors duration-300">
            {invalidLink ? t("auth.resetLinkInvalid") : t("auth.resetPasswordCopy")}
          </FadeUpText>

          {invalidLink ? (
            <Link
              to="/forgot-password"
              className="mt-9 inline-flex items-center justify-center gap-2 w-full btn-primary rounded-2xl py-4 font-black shadow-xl dark:shadow-[0_0_30px_rgba(34,211,238,0.32)] transition-all duration-300"
            >
              {t("auth.requestNewLink")}
            </Link>
          ) : (
            <form onSubmit={submit} className="mt-9 space-y-4">
              <div className="relative">
                <Lock className="absolute left-5 top-4 text-gray-400 dark:text-slate-400 transition-colors duration-300" size={20} />
                <input
                  required
                  minLength={6}
                  type={show ? "text" : "password"}
                  placeholder={t("auth.newPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <div className="relative">
                <Lock className="absolute left-5 top-4 text-gray-400 dark:text-slate-400 transition-colors duration-300" size={20} />
                <input
                  required
                  minLength={6}
                  type={show ? "text" : "password"}
                  placeholder={t("auth.confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-4 outline-none text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-400/40 transition-colors duration-300"
                />
              </div>

              <button
                disabled={loading}
                className="w-full btn-primary rounded-2xl py-4 font-black shadow-xl dark:shadow-[0_0_30px_rgba(34,211,238,0.32)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
              >
                {loading ? t("auth.updatingPassword") : t("auth.updatePassword")}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-purple-700 dark:text-cyan-400 transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            {t("auth.backToLogin")}
          </Link>
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
