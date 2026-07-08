import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck, BadgeCheck } from "lucide-react";
import DeliveryTrustBadge from "../DeliveryTrustBadge";
import { getDeliveryTrustMessage } from "../../utils/deliveryTrust";

export default function CheckoutTrustPanel({ seed = "checkout-pay" }) {
  const { t } = useTranslation();
  const delivery = useMemo(() => getDeliveryTrustMessage(seed), [seed]);

  const items = [
    {
      icon: Truck,
      title: t("checkout.trustDeliveryTitle"),
      copy: delivery.text,
      note: delivery.note,
    },
    {
      icon: RotateCcw,
      title: t("checkout.trustReturnsTitle"),
      copy: t("checkout.trustReturnsCopy"),
    },
    {
      icon: ShieldCheck,
      title: t("checkout.trustSecureTitle"),
      copy: t("checkout.trustSecureCopy"),
    },
    {
      icon: BadgeCheck,
      title: t("checkout.trustCertifiedTitle"),
      copy: t("checkout.trustCertifiedCopy"),
    },
  ];

  return (
    <div className="mt-5 space-y-3">
      <DeliveryTrustBadge seed={seed} />

      <div className="grid gap-2.5 rounded-2xl border border-edge bg-app-muted/60 dark:bg-zinc-800/40 p-4">
        {items.map(({ icon: Icon, title, copy, note }) => (
          <div key={title} className="flex gap-3 items-start">
            <div className="w-9 h-9 shrink-0 rounded-xl grid place-items-center bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)] text-brand dark:bg-cyan-950/50 dark:text-cyan-400">
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-fg">{title}</p>
              <p className="text-xs text-fg-muted leading-snug mt-0.5">{copy}</p>
              {note && (
                <p className="text-[10px] text-fg-muted/80 mt-0.5">{note}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-fg-muted text-center">
        {t("checkout.trustFooter")}{" "}
        <Link to="/support/warranty" className="font-bold text-brand underline-offset-2 hover:underline">
          {t("checkout.returnPolicyLink")}
        </Link>
      </p>
    </div>
  );
}
