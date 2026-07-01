/** Hindi body-part / category terms → English search tokens (DB is English). */

const HINDI_TO_ENGLISH = {
  घुटना: "Knee",
  गर्दन: "Neck",
  कलाई: "Wrist",
  पीठ: "Back",
  छाती: "Chest",
  उंगली: "Finger",
  उँगली: "Finger",
  टांग: "Leg",
  जांघ: "Thigh",
  कंधा: "Shoulder",
  टखना: "Ankle",
  कोहनी: "Elbow",
  पेट: "Abdominal",
  पिंडली: "Shin And Calf",
  बांह: "Arm",
  हाथ: "Arm",
  पैर: "Leg",
  कमर: "Back",
  रीढ़: "Back",
  रीढ: "Back",
};

const HINDI_REGEX = /[\u0900-\u097F]/;

export function containsHindi(text) {
  return HINDI_REGEX.test(String(text || ""));
}

function normalizeToken(token) {
  const trimmed = token.trim();
  if (!trimmed) return trimmed;
  if (HINDI_TO_ENGLISH[trimmed]) return HINDI_TO_ENGLISH[trimmed];
  const lower = trimmed.toLowerCase();
  for (const [hindi, english] of Object.entries(HINDI_TO_ENGLISH)) {
    if (hindi.includes(trimmed) || trimmed.includes(hindi)) return english;
    if (lower === hindi) return english;
  }
  return trimmed;
}

/**
 * @param {string} input - Raw user search (may be Hindi, English, or mixed)
 * @returns {{ display: string, search: string, wasNormalized: boolean }}
 */
export function normalizeSearchQuery(input) {
  const display = String(input || "").trim();
  if (!display) {
    return { display: "", search: "", wasNormalized: false };
  }

  if (!containsHindi(display)) {
    return { display, search: display, wasNormalized: false };
  }

  const parts = display.split(/\s+/).filter(Boolean);
  const mapped = parts.map(normalizeToken);
  const search = mapped.join(" ");
  const wasNormalized = search !== display;

  return { display, search, wasNormalized };
}
