import { config } from "../../config.js";
import { sendResponse } from "../Utils/sendResponse.js";
import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        sendResponse(res, {
            success: false,
            statusCode: 401,
            message: "Unauthorized",
            data: null,
        })
    }
    jwt.verify(token,config.jwt_secret, (err, decoded) => {
        if (err) {
            sendResponse(res, {
                success: false,
                statusCode: 401,
                message: "Invalid token",
                data: null,
            });
        }
        req.user = decoded.user;
        req.userId = decoded.user._id ;
        next();
    })
}
export default authMiddleware;
