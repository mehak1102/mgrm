import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../api";

const EMPTY_PROFILE = {
  name: "MGRM Medicare",
  handle: "mgrmmedicare",
  url: "https://www.instagram.com/mgrmmedicare/",
  tagline: "",
  avatar: "/products/logo-mark.png",
  stats: { posts: 0, followers: 0, following: 0 },
  posts: [],
};

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function formatStat(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? "0");
  return n.toLocaleString("en-IN");
}

function apiHost() {
  const base = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : "http://localhost:5000/api");
  if (base.startsWith("http")) {
    return base.replace(/\/api\/?$/, "");
  }
  return "";
}

function resolveMediaSrc(url) {
  if (!url) return "/products/logo-mark.png";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const host = apiHost();
    return `${host}/api/instagram/image?url=${encodeURIComponent(url)}`;
  }
  if (url.startsWith("/api/")) {
    const host = apiHost();
    return host ? `${host}${url}` : url;
  }
  return url;
}

function FeedImage({ src, alt, className = "", eager = false }) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveMediaSrc(src));

  useEffect(() => {
    setCurrentSrc(resolveMediaSrc(src));
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        if (currentSrc !== "/products/logo-mark.png") {
          setCurrentSrc("/products/logo-mark.png");
        }
      }}
    />
  );
}

function StatBlock({ value, label }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-base sm:text-lg font-bold text-fg tabular-nums">{value}</p>
      <p className="text-xs text-fg-muted">{label}</p>
    </div>
  );
}

export default function InstagramFeed() {
  const trackRef = useRef(null);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollBack(scrollLeft > 8);
    setCanScrollForward(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    let cancelled = false;

    API.get("/instagram/profile")
      .then((res) => {
        if (!cancelled && res.data) setProfile(res.data);
      })
      .catch(() => {
        /* keep empty/fallback state */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollButtons();
    track.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      track.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [profile.posts.length, loading, updateScrollButtons]);

  const { name, handle, url, tagline, avatar, stats, posts, isVerified } = profile;

  const scrollByTiles = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;
    const tile = track.querySelector(".instagram-feed__tile");
    const step = tile ? tile.clientWidth * 2 : 280;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => scrollByTiles(1), [scrollByTiles]);
  const scrollPrev = useCallback(() => scrollByTiles(-1), [scrollByTiles]);

  return (
    <section
      className="instagram-feed border-t border-edge bg-card text-fg transition-colors duration-300"
      aria-labelledby="instagram-feed-heading"
    >
      <div className="max-w-[100vw] mx-auto">
        <div className="flex flex-col items-center gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:flex-row lg:justify-center lg:gap-10">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full ring-2 ring-[#E1306C]/30 p-0.5 transition hover:ring-[#E1306C]/60"
            aria-label={`${name} on Instagram`}
          >
            <FeedImage
              src={avatar}
              alt=""
              eager
              className="h-20 w-20 rounded-full object-cover bg-white sm:h-24 sm:w-24"
            />
          </a>

          <div className="flex flex-1 flex-col items-center text-center lg:max-w-xl lg:items-start lg:text-left">
            <div className="flex items-center gap-1.5">
              <h2 id="instagram-feed-heading" className="text-xl font-bold text-fg sm:text-2xl">
                {name}
              </h2>
              {isVerified && (
                <span className="text-[#0095F6]" title="Verified" aria-label="Verified account">
                  ✓
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium text-fg-muted">@{handle}</p>
            {tagline ? (
              <p className="mt-2 hidden max-w-md whitespace-pre-line text-sm leading-relaxed text-fg-muted sm:block">
                {tagline}
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-center gap-6 sm:gap-8 lg:justify-start">
              <StatBlock value={formatStat(stats.posts)} label="Posts" />
              <StatBlock value={formatStat(stats.followers)} label="Followers" />
              <StatBlock value={formatStat(stats.following)} label="Following" />
            </div>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#0095F6] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0086dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0095F6]"
          >
            <InstagramIcon className="h-4 w-4" />
            Follow
          </a>
        </div>

        <div className="relative border-t border-edge">
          <div
            ref={trackRef}
            className="instagram-feed__track flex overflow-x-auto scroll-smooth"
            role="list"
            aria-label="MGRM Medicare Instagram posts"
            aria-busy={loading}
          >
            {loading && !posts.length
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`sk-${i}`}
                    className="instagram-feed__tile aspect-square w-[calc(100%/3)] min-w-[calc(100%/3)] shrink-0 animate-pulse bg-slate-200 dark:bg-slate-800 sm:w-[calc(100%/4)] sm:min-w-[calc(100%/4)] md:w-[calc(100%/5)] md:min-w-[calc(100%/5)] lg:w-[calc(100%/6)] lg:min-w-[calc(100%/6)]"
                  />
                ))
              : posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.url || url}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    className="instagram-feed__tile group relative block aspect-square w-[calc(100%/3)] min-w-[calc(100%/3)] shrink-0 overflow-hidden sm:w-[calc(100%/4)] sm:min-w-[calc(100%/4)] md:w-[calc(100%/5)] md:min-w-[calc(100%/5)] lg:w-[calc(100%/6)] lg:min-w-[calc(100%/6)]"
                    aria-label={`View post on Instagram: ${post.alt}`}
                  >
                    <FeedImage
                      src={post.image}
                      alt={post.alt}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    {post.isVideo ? (
                      <span className="pointer-events-none absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Reel
                      </span>
                    ) : null}
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                      <InstagramIcon className="h-8 w-8 text-white drop-shadow" />
                    </span>
                  </a>
                ))}
          </div>

          {posts.length > 3 && canScrollBack ? (
            <button
              type="button"
              onClick={scrollPrev}
              className="instagram-feed__scroll-btn instagram-feed__scroll-btn--prev absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Scroll Instagram posts back"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
          ) : null}

          {posts.length > 3 && canScrollForward ? (
            <button
              type="button"
              onClick={scrollNext}
              className="instagram-feed__scroll-btn instagram-feed__scroll-btn--next absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Scroll Instagram posts forward"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
