import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
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

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success(res.data?.msg || t("auth.forgotPasswordSuccess"));
    } catch (err) {
      toast.error(err.response?.data?.msg || t("auth.forgotPasswordFailed"));
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
            {t("auth.forgotPasswordBadge")}
          </SectionLabel>
          <SectionHeading
            text={t("auth.forgotPasswordTitle")}
            as="h1"
            className="text-5xl font-black mt-3 text-slate-950 dark:text-zinc-50"
          />
          <FadeUpText className="text-gray-500 dark:text-slate-300 mt-3 transition-colors duration-300">
            {sent ? t("auth.forgotPasswordSentCopy") : t("auth.forgotPasswordCopy")}
          </FadeUpText>

          {!sent ? (
            <form onSubmit={submit} className="mt-9 space-y-4">
              <div className="relative">
                <Mail className="absolute left-5 top-4 text-gray-400 dark:text-slate-400 transition-colors duration-300" size={20} />
                <input
                  required
                  type="email"
                  placeholder={t("common.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-4 outline-none text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-400/40 transition-colors duration-300"
                />
              </div>

              <button
                disabled={loading}
                className="w-full btn-primary rounded-2xl py-4 font-black shadow-xl dark:shadow-[0_0_30px_rgba(34,211,238,0.32)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
              >
                {loading ? t("auth.sendingResetLink") : t("auth.sendResetLink")}
              </button>
            </form>
          ) : (
            <div className="mt-9">
              <button
                type="button"
                onClick={() => setSent(false)}
                className="w-full rounded-2xl py-4 font-black border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-300"
              >
                {t("auth.sendAnotherLink")}
              </button>
            </div>
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
