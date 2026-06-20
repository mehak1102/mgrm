const DELIVERY_MESSAGES = [
  {
    text: "Fast Dispatch Available",
    note: "Delivery time varies by location.",
  },
  {
    text: "Ships Quickly Across India",
    note: "Delivery time varies by location.",
  },
  {
    text: "Express Delivery Available*",
    note: "Delivery time varies by location.",
  },
];

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
  const index = hashSeed(seed) % DELIVERY_MESSAGES.length;
  return DELIVERY_MESSAGES[index];
}
