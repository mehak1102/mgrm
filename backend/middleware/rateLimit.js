import rateLimit from "express-rate-limit";

export const formRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Too many submissions. Please try again later." },
});
