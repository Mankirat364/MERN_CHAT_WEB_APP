import jwt from 'jsonwebtoken'
export const generateToken = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax", // "Lax" for development
        secure: process.env.NODE_ENV === "production", // only true in production
    });

    return token;
};

}
