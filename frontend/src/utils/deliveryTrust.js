import i18n from "../i18n";

const DELIVERY_KEYS = ["fast", "ships", "express"];

function hashSeed(seed) {
  const str = String(seed || "mgrm");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDeliveryTrustMessage(seed = "") {
  const index = hashSeed(seed) % DELIVERY_KEYS.length;
  const key = DELIVERY_KEYS[index];
  return {
    text: i18n.t(`delivery.${key}.text`),
    note: i18n.t(`delivery.${key}.note`),
  };
}
