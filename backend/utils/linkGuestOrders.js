import Order from "../models/Order.js";

export async function linkGuestOrdersToUser(user) {
  if (!user?.email || !user?._id) return;

  const email = user.email.toLowerCase().trim();

  await Order.updateMany(
    {
      userEmail: email,
      $or: [{ userId: "" }, { userId: null }, { userId: { $exists: false } }],
    },
    { $set: { userId: String(user._id), userName: user.name } }
  );
}
