const jwt = require("jsonwebtoken");

const protectUser = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "user") {
            return res.status(403).json({
                message: "User access required."
            });
        }

        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "User authentication failed:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = protectUser;