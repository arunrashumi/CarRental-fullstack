import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)

        const userId = typeof decoded === 'string' ? decoded : decoded.id
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        req.user = user
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}