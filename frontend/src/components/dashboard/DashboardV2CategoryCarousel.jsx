import { useMemo } from "react";
import { DISPLAY_CATEGORIES } from "./dashboardV2Data";

export default function DashboardV2CategoryCarousel({ onSelect, labelClassName = "" }) {
  const loop = useMemo(() => [...DISPLAY_CATEGORIES, ...DISPLAY_CATEGORIES], []);

  return (
    <div className="dashboard-v2__categories-marquee" aria-label="Browse categories">
      <div className="dashboard-v2__categories-track">
        {loop.map((cat, index) => (
          <button
            key={`${cat.query}-${index}`}
            type="button"
            onClick={() => onSelect(cat)}
            className="dashboard-v2__cat-btn"
          >
            <div className="dashboard-v2__cat-icon" style={{ "--cat-accent": cat.color, "--cat-focus": cat.imageFocus }}>
              <img src={cat.image} alt="" className="dashboard-v2__cat-img" />
            </div>
            <span className={`dashboard-v2__cat-label ${labelClassName}`}>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
