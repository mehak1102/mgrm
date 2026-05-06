import { Activity, HeartPulse, ShieldPlus, Sparkles, Bone, Stethoscope } from "lucide-react";

export default function FloatingMedicalBg() {
  const items = [
    { Icon: HeartPulse, className: "top-[12%] left-[6%] delay-0" },
    { Icon: ShieldPlus, className: "top-[20%] right-[8%] delay-300" },
    { Icon: Bone, className: "top-[55%] left-[4%] delay-700" },
    { Icon: Stethoscope, className: "bottom-[14%] right-[10%] delay-500" },
    { Icon: Activity, className: "bottom-[8%] left-[18%] delay-1000" },
    { Icon: Sparkles, className: "top-[45%] right-[22%] delay-200" },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-28 -left-28 w-96 h-96 bg-purple-200/25 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] bg-cyan-200/25 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-[420px] h-[420px] bg-blue-200/20 rounded-full blur-3xl" />

      {items.map(({ Icon, className }, index) => (
        <div
          key={index}
          className={`absolute ${className} floating-medical-item w-14 h-14 rounded-2xl bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.10)] grid place-items-center`}
        >
          <Icon className="text-purple-600/55" size={24} />
        </div>
      ))}
    </div>
  );
}