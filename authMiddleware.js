// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]; // Extract token
//     console.log("Received Token:", token);  // ✅ Debugging

//     if (!token) {
//         return res.status(401).json({ message: "No token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded Token:", decoded);  // ✅ Debugging
//         req.user = decoded; // Attach user info to request
//         next();
//     } catch (error) {
//         console.error("JWT Verification Error:", error.message);  // ✅ Debugging
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "No token, authorization denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = { userId: user.id, name: user.name, role: user.role };  // ✅ Now includes name

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;

