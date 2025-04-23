import dotenv from "dotenv";
import path from 'path'

dotenv.config({ path: path.join((process.cwd(), '.env')) });
 

export const config = {
    port: process.env.PORT || 3000,
    db_url: process.env.DB_URL || "mongodb://localhost:27017/test" , 
    jwt_secret: process.env.JWT_SECRET || "secret",
    gemini_api_key: process.env.GEMINI_API_KEY || "AIzaSyAZ-KM9-AKbK_1ink9wgqJwI3D7b3hIwC8"
} 