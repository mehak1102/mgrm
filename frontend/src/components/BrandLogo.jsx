import NavbarBrandMark from "./NavbarBrandMark";
import "../theme/brand-logo.css";

export default function BrandLogo({ size = "navbar", className = "", ...props }) {
  const isHero = size === "hero";

  return (
    <div
      className={`brand-logo ${isHero ? "brand-logo--hero" : "brand-logo--navbar"} ${className}`.trim()}
      {...props}
    >
      <NavbarBrandMark variant={size} />
      <img
        src="/products/logs.png"
        alt="MGRM Medicare"
        className="brand-logo__img"
      />
    </div>
  );
}
