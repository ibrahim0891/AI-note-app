
import express from "express";
import mongoose from "mongoose";
import { config } from "../src/config.js";
import cors from 'cors';
import { mainRouter } from "../src/router.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

app.use(cookieParser())

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use('/api/v1', mainRouter)


mongoose.connect(config.db_url).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log(err);
});

app.listen(config.port, () => {
    console.log("Server is running on port " + config.port);
});

// const main = () => {


// }

// main()

export default app