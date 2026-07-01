import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const FAQ_KEYS = [
  "chooseSupport",
  "findSize",
  "returns",
  "shipping",
  "trackOrder",
  "bulkOrders",
  "productCare",
  "warranty",
];

export default function SupportFaq() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="support-faq max-w-7xl mx-auto px-5 pb-12" id="support-faq">
      <h2 className="support-faq__title">{t("support.faq.title")}</h2>

      <ul className="support-faq__list">
        {FAQ_KEYS.map((id) => {
          const isOpen = openId === id;
          const panelId = `support-faq-${id}`;

          return (
            <li key={id} className="support-faq__item">
              <button
                type="button"
                id={`${panelId}-trigger`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(id)}
                className="support-faq__trigger"
              >
                <ChevronRight
                  className={`support-faq__chevron shrink-0 ${isOpen ? "support-faq__chevron--open" : ""}`}
                  size={18}
                  aria-hidden
                />
                <span>{t(`support.faq.items.${id}.q`)}</span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={`${panelId}-trigger`}
                className={`support-faq__panel ${isOpen ? "support-faq__panel--open" : ""}`}
              >
                <div className="support-faq__panel-inner">
                  <p className="support-faq__answer">{t(`support.faq.items.${id}.a`)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
