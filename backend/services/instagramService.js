import InstagramCache from "../models/InstagramCache.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

const USERNAME = process.env.INSTAGRAM_USERNAME || "mgrmmedicare";
const CACHE_KEY = `profile:${USERNAME}`;
const CACHE_TTL_MS = 60 * 60 * 1000;
const IG_APP_ID = "936619743392459";

const IG_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "X-IG-App-ID": IG_APP_ID,
  "X-ASBD-ID": "129477",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.instagram.com/",
  Origin: "https://www.instagram.com",
};

let memoryCache = null;

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
  if (url.startsWith("/") || url.includes("res.cloudinary.com")) return url;
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

function mapGraphPost(item) {
  const permalink = item.permalink || "";
  const shortcode = permalink.split("/p/")[1]?.replace(/\/$/, "") || item.id;
  return {
    id: item.id || shortcode,
    shortcode,
    url: permalink || `https://www.instagram.com/p/${shortcode}/`,
    image: item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
    alt: item.caption?.replace(/\s+/g, " ").trim().slice(0, 140) || "MGRM Medicare on Instagram",
    isVideo: item.media_type === "VIDEO",
  };
}

function mapGraphProfile(payload) {
  const handle = payload.username;
  const media = payload.media?.data || [];

  return {
    name: payload.name || "MGRM Medicare",
    handle,
    url: `https://www.instagram.com/${handle}/`,
    tagline: payload.biography || "",
    avatar: payload.profile_picture_url,
    isVerified: true,
    stats: {
      posts: payload.media_count ?? media.length,
      followers: payload.followers_count ?? 0,
      following: payload.follows_count ?? 0,
    },
    posts: media.map(mapGraphPost),
  };
}

async function fetchFromGraphApi() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) {
    throw new Error("Instagram Graph API not configured");
  }

  const fields = [
    "username",
    "name",
    "biography",
    "profile_picture_url",
    "followers_count",
    "follows_count",
    "media_count",
    "media.limit(12){id,caption,media_type,media_url,permalink,thumbnail_url}",
  ].join(",");

  const response = await fetch(
    `https://graph.instagram.com/v21.0/${userId}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`
  );

  if (!response.ok) {
    throw new Error(`Instagram Graph API responded with ${response.status}`);
  }

  const payload = await response.json();
  if (!payload?.username) {
    throw new Error("Instagram Graph API payload missing username");
  }

  return mapGraphProfile(payload);
}

async function fetchFromWebApi() {
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
    throw new Error(`Instagram web API responded with ${response.status}`);
  }

  const payload = await response.json();
  const user = payload?.data?.user;
  if (!user) throw new Error("Instagram profile payload missing user");

  return mapProfile(user);
}

async function fetchLiveProfile() {
  const strategies = [];

  if (process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID) {
    strategies.push({ name: "graph", run: fetchFromGraphApi });
  }

  strategies.push({ name: "web", run: fetchFromWebApi });

  let lastError = null;

  for (const strategy of strategies) {
    try {
      const profile = await strategy.run();
      return { profile, source: strategy.name };
    } catch (err) {
      lastError = err;
      console.warn(`Instagram ${strategy.name} fetch failed:`, err.message);
    }
  }

  throw lastError || new Error("Instagram fetch failed");
}

function hasCloudinary() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

async function mirrorRemoteImage(url, publicId) {
  if (!url?.startsWith("http") || url.includes("res.cloudinary.com")) {
    return url;
  }

  if (!hasCloudinary()) return url;

  try {
    const { buffer } = await fetchInstagramImage(url);
    const result = await uploadBufferToCloudinary(buffer, "mgrm-instagram", {
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (err) {
    console.warn(`Instagram image mirror failed (${publicId}):`, err.message);
    return url;
  }
}

async function mirrorProfileImages(profile) {
  const avatar = await mirrorRemoteImage(profile.avatar, `${USERNAME}-avatar`);

  const posts = await Promise.all(
    (profile.posts || []).map(async (post) => ({
      ...post,
      image: await mirrorRemoteImage(
        post.image,
        `${USERNAME}-${post.shortcode || post.id}`
      ),
    }))
  );

  return { ...profile, avatar, posts };
}

async function loadPersistedProfile() {
  const doc = await InstagramCache.findOne({ key: CACHE_KEY }).lean();
  if (!doc?.profile) return null;
  return { profile: doc.profile, updatedAt: doc.updatedAt };
}

async function persistProfile(profile) {
  await InstagramCache.findOneAndUpdate(
    { key: CACHE_KEY },
    { profile, updatedAt: new Date() },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}

function buildResponse(profile, meta = {}) {
  return {
    ...withProxiedImages(profile),
    ...meta,
  };
}

export async function refreshInstagramCache({ force = false } = {}) {
  const { profile, source } = await fetchLiveProfile();
  const mirrored = await mirrorProfileImages(profile);
  await persistProfile(mirrored);

  memoryCache = {
    at: Date.now(),
    data: mirrored,
    source,
  };

  return buildResponse(mirrored, {
    source,
    cached: false,
    updatedAt: new Date().toISOString(),
    force,
  });
}

export async function getInstagramProfile() {
  if (memoryCache && Date.now() - memoryCache.at < CACHE_TTL_MS) {
    return buildResponse(memoryCache.data, {
      source: memoryCache.source || "memory",
      cached: true,
      updatedAt: memoryCache.updatedAt,
    });
  }

  try {
    return await refreshInstagramCache();
  } catch (err) {
    console.error("Instagram live fetch failed:", err.message);

    const stored = await loadPersistedProfile();
    if (stored?.profile) {
      memoryCache = {
        at: Date.now(),
        data: stored.profile,
        source: "database",
        updatedAt: stored.updatedAt?.toISOString?.() || null,
      };

      return buildResponse(stored.profile, {
        source: "database",
        stale: true,
        cached: true,
        updatedAt: stored.updatedAt,
      });
    }

    throw err;
  }
}

export async function warmupInstagramCache() {
  try {
    const stored = await loadPersistedProfile();
    if (stored?.profile) {
      memoryCache = {
        at: Date.now(),
        data: stored.profile,
        source: "database",
        updatedAt: stored.updatedAt?.toISOString?.() || null,
      };
      console.log(
        `Instagram cache warmed from database (${stored.profile.posts?.length || 0} posts)`
      );
    }
  } catch (err) {
    console.warn("Instagram DB warmup failed:", err.message);
  }

  refreshInstagramCache()
    .then((profile) => {
      console.log(
        `Instagram cache refreshed (${profile.source}, ${profile.posts?.length || 0} posts)`
      );
    })
    .catch((err) => {
      console.warn("Instagram background refresh skipped:", err.message);
    });
}

export function clearInstagramCache() {
  memoryCache = null;
}

clearInstagramCache();
