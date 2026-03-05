import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

// Generate access token (short-lived)
export function generateToken(user) {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

// Generate refresh token (long-lived)
export function generateRefreshToken(user) {
  const payload = { id: user._id };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

// Verify access token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    return null;
  }
}