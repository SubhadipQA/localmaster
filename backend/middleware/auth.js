import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Route — checks if token is valid
export const protect = async (req, res, next) => {
  try {
    let token;

    //Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //Token not found
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Get user from token's id — attach to request
    req.user = await User.findById(decoded.id).select("-password");

    next();

  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Role check — only allow specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this`,
      });
    }
    next();
  };
};