

import jwt from "jsonwebtoken";
import { config } from "../../config.js";

export const generateToken = (payload) => {
    return jwt.sign(payload, config.jwt_secret, {
        expiresIn: "30d",
    });
};
