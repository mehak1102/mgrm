const USERNAME = process.env.INSTAGRAM_USERNAME || "mgrmmedicare";
const CACHE_TTL_MS = 60 * 60 * 1000;
const IG_APP_ID = "936619743392459";

const IG_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "X-IG-App-ID": IG_APP_ID,
  "X-ASBD-ID": "129477",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.instagram.com/",
  Origin: "https://www.instagram.com",
};

let cache = null;

export function isAllowedInstagramImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const host = new URL(url).hostname;
    return (
      host.endsWith("cdninstagram.com") ||
      host.endsWith("fbcdn.net") ||
      host === "instagram.com" ||
      host.endsWith(".instagram.com")
    );
  } catch {
    return false;
  }
}

export function toProxiedImageUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (!url.startsWith("http")) return url;
  if (!isAllowedInstagramImageUrl(url)) return url;
  return `/api/instagram/image?url=${encodeURIComponent(url)}`;
}

function withProxiedImages(profile) {
  return {
    ...profile,
    avatar: toProxiedImageUrl(profile.avatar),
    posts: (profile.posts || []).map((post) => ({
      ...post,
      image: toProxiedImageUrl(post.image),
    })),
  };
}

export async function fetchInstagramImage(url) {
  const response = await fetch(url, { headers: IG_FETCH_HEADERS });
  if (!response.ok) {
    throw new Error(`Image fetch failed: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());
  return { contentType, buffer };
}

function extractCaption(node) {
  const text = node?.edge_media_to_caption?.edges?.[0]?.node?.text;
  if (!text) return null;
  return text.replace(/\s+/g, " ").trim().slice(0, 140);
}

function mapPost(node) {
  const shortcode = node.shortcode;
  return {
    id: shortcode,
    shortcode,
    url: `https://www.instagram.com/p/${shortcode}/`,
    image: node.thumbnail_src || node.display_url,
    alt:
      node.accessibility_caption ||
      extractCaption(node) ||
      "MGRM Medicare on Instagram",
    isVideo: Boolean(node.is_video),
  };
}

function mapProfile(user) {
  const handle = user.username;
  const timeline = user.edge_owner_to_timeline_media || { count: 0, edges: [] };

  return {
    name: user.full_name || "MGRM Medicare",
    handle,
    url: `https://www.instagram.com/${handle}/`,
    tagline: user.biography || "",
    avatar: user.profile_pic_url_hd || user.profile_pic_url,
    isVerified: Boolean(user.is_verified),
    stats: {
      posts: timeline.count ?? 0,
      followers: user.edge_followed_by?.count ?? 0,
      following: user.edge_follow?.count ?? 0,
    },
    posts: (timeline.edges || []).map(({ node }) => mapPost(node)),
  };
}

async function fetchFromInstagram() {
  const response = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(USERNAME)}`,
    {
      headers: {
        ...IG_FETCH_HEADERS,
        Referer: `https://www.instagram.com/${USERNAME}/`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Instagram API responded with ${response.status}`);
  }

  const payload = await response.json();
  const user = payload?.data?.user;
  if (!user) throw new Error("Instagram profile payload missing user");

  return mapProfile(user);
}

export async function getInstagramProfile() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return { ...cache.data, cached: true };
  }

  const data = withProxiedImages(await fetchFromInstagram());
  cache = { at: Date.now(), data };
  return { ...data, cached: false };
}

export function clearInstagramCache() {
  cache = null;
}

// Clear stale cache on deploy/restart so image proxy URLs refresh.
clearInstagramCache();
