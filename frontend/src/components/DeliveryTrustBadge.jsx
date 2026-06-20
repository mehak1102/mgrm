import { Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getDeliveryTrustMessage } from "../utils/deliveryTrust";

export default function DeliveryTrustBadge({ seed = "", className = "", compact = false }) {
  const { isBlue } = useTheme();
  const message = getDeliveryTrustMessage(seed);

  return (
    <div className={className}>
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
          isBlue
            ? "border-[#FFD700]/35 bg-[#FFD700]/12 text-[#12344f]"
            : "border-cyan-200/80 bg-cyan-50/80 text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100"
        }`}
      >
        <Zap
          size={compact ? 11 : 12}
          className={isBlue ? "text-[#FFD700]" : "text-cyan-600 dark:text-cyan-400 shrink-0"}
          aria-hidden
        />
        <span className={`font-bold leading-none ${compact ? "text-[10px]" : "text-[11px]"}`}>
          {message.text}
        </span>
      </div>
      {!compact && (
        <p className="mt-1 text-[10px] text-fg-muted leading-snug">{message.note}</p>
      )}
    </div>
  );
}
