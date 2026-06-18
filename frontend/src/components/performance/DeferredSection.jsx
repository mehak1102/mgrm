import { memo, useEffect, useRef, useState } from "react";

/**
 * Mounts a lazy-loaded section when it nears the viewport.
 * Optional minHeight reserves space to avoid layout shift.
 */
function DeferredSection({ loader, minHeight, className = "", rootMargin = "280px" }) {
  const ref = useRef(null);
  const loaderRef = useRef(loader);
  const [Component, setComponent] = useState(null);

  loaderRef.current = loader;

  useEffect(() => {
    if (Component) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loaderRef.current().then((mod) => {
          setComponent(() => mod.default ?? mod);
        });
        observer.disconnect();
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [Component, rootMargin]);

  if (Component) {
    return (
      <div ref={ref} className={className}>
        <Component />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight ? { minHeight } : undefined}
      aria-hidden="true"
    />
  );
}

export default memo(DeferredSection);
