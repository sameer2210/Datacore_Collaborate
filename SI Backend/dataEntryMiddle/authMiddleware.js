import jwt from "jsonwebtoken";

// Middleware: Protect routes
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log("user-side",token);
    
    if (!token) return res.status(401).json({ message: "Unauthorized. Token missing." });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // single secret
    if (!decoded?.id) return res.status(401).json({ message: "Unauthorized. Invalid token." });

    req.user = decoded;
    console.log(`Token verified successfully. User ID: ${req.user.id}, Role: ${req.user.role}`);
   
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    if (error.name === "TokenExpiredError")
      return res.status(401).json({ message: "Token expired." });
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ message: "Invalid token." });
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

//  Middleware: Admin only
export const adminonly = (requiredRole = "admin") => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized. No user data." });

    if (requiredRole && req.user.role !== requiredRole)
      return res.status(403).json({ message: `Access denied. ${requiredRole} role required.` });
  console.log(` Admin check passed for user ID: ${req.user.id}, Role: ${req.user.role}`);
    next();
  };
};
