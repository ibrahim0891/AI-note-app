import express from "express";
import { sendResponse } from "../../Utils/sendResponse.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../../Utils/genarateToken.js";
import { Category } from "../models/category.model.js";
import jwt from "jsonwebtoken";
import { config } from "../../../config.js";

class AuthController {
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            sendResponse(res, {
                success: false,
                message: "Invalid Request",
                data: req.body,
            });
            return;
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                sendResponse(res, {
                    success: false,
                    statusCode: 404,
                    message: "User not found",
                    data: req.body,
                });
                return;
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                sendResponse(res, {
                    success: false,
                    statusCode: 401,
                    message: "Invalid Password",
                    data: null,
                });
            }
            res.cookie("token", generateToken({ user }), {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            sendResponse(res, {
                success: true,
                statusCode: 200,
                message: "Login Success",
                data: null,
            });
        } catch (error) {
            sendResponse(res, {
                success: false,
                message: "Login Failed",
                data: error.message,
            });
        }
    }

    async signup(req, res) {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            sendResponse(res, {
                success: false,
                message: "You may have missed some fields",
                data: req.body,
            });
            return;
        }
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                sendResponse(res, {
                    success: false,
                    message: "User already exists",
                    data: existingUser,
                });
                return;
            }
            const user = new User({
                email,
                password,
                firstName,
                lastName,
            });
            const newCategory = new Category({
                name: "Default",
                userId: user._id,
            });
            await newCategory.save();
            await user.save();

            sendResponse(res, {
                success: true,
                statusCode: 201,
                message: "Signup Success",
                data: user,
            });
        } catch (error) {
            sendResponse(res, {
                success: false,
                statusCode: 500,
                message: "Signup Failed",
                data: error.message
            });
        }
    }

    async logout(req, res) {
        res.clearCookie("token");
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Logout Success",
            data: null,
        });
    } 
    async sessionValidation(req, res) {
        const userJwt = req.cookies.token 
        jwt.verify(userJwt, config.jwt_secret, (err, decoded) => {
            if (err) {
                sendResponse(res, {
                    success: false,
                    statusCode: 401,
                    message: "Invalid Token",
                    data: null,
                });
                return;
            }
            else {
                sendResponse(res, {
                    success: true,
                    statusCode: 200,
                    message: "Session Valid",
                    data: decoded.user,
                });
            } 
            console.log(decoded.user);
            return;
        });
    }
}

const authController = new AuthController();
const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.get("/session-validation", authController.sessionValidation);

export const authRouter = router;
