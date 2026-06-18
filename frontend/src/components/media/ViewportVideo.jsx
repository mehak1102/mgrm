import { memo, useEffect, useRef, useState } from "react";

/**
 * Defers video network load until near viewport; pauses when offscreen.
 * Preserves autoplay behavior for visible/eager videos.
 */
function ViewportVideo({
  src,
  sources,
  poster,
  className = "",
  eager = false,
  autoPlay = false,
  muted = true,
  loop = false,
  playsInline = true,
  pauseOffscreen = true,
  rootMargin = "200px",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(Boolean(eager));
  const [isVisible, setIsVisible] = useState(Boolean(eager));

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) setShouldLoad(true);
        if (!visible && pauseOffscreen && !el.paused) el.pause();
        if (visible && autoPlay && shouldLoad) el.play().catch(() => {});
      },
      { rootMargin: eager ? "0px" : rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay, eager, pauseOffscreen, rootMargin, shouldLoad]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !shouldLoad || !autoPlay || !isVisible) return;
    el.play().catch(() => {});
  }, [shouldLoad, isVisible, autoPlay]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={shouldLoad && src && !sources ? src : undefined}
      preload={shouldLoad ? "metadata" : "none"}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      autoPlay={autoPlay && shouldLoad}
      {...rest}
    >
      {shouldLoad &&
        sources?.map((item) => (
          <source key={item.src} src={item.src} type={item.type} />
        ))}
      {children}
    </video>
  );
}

export default memo(ViewportVideo);
