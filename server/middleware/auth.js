// middleware/auth.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header first
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. If no Bearer token, check cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach decoded user information
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};

// Role-based authorization
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
