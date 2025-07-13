import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "lax", // CRITICAL FIX: "strict" was too restrictive for cross-port requests. "lax" is correct.
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};