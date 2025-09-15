import jwt from "jsonwebtoken";

const author = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log(token);
        console.log("HELOO", process.env.USER_TOKEN);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Token missing." });
        }

        console.log(process.env.USER_TOKEN);

        const decoded = jwt.verify(token, process.env.USER_TOKEN);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized. Invalid token data." });
        }

        req.userId = decoded.id;
        console.log(req.userId);

        next();
    } catch (error) {
        console.error("Authorization error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized. Token expired." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized. Invalid token." });
        }

        return res.status(500).json({ message: "Internal Server Error." });
    }
};

export default author;
