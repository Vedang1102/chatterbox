import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // Generate JWT token here
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //in milliseconds
        httpOnly: true, // prevents XSS attacks cross-site scripting protection
        sameSite: "strict", // CSRF attacks cross-site request forgery protection
        secure: process.env.NODE_ENV !== "development", // true for https only
    });

    return token;
}