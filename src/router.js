
import express from "express";
import authMiddleware from "./app/Middleware/authmiddleware.js"; 
import { authRouter } from "./app/Modules/routers/auth.router.js";
import { noteRouter } from "./app/Modules/routers/note.router.js";
import { categoryRouter } from "./app/Modules/routers/category.router.js";

const router = express.Router();

const routers = [
    {
        path: '/auth',
        router: authRouter,
        isSecure: false
    },
    {
        path: "/note",
        router: noteRouter,
        isSecure: true,
    },
    {
        path: "/category",
        router: categoryRouter,
        isSecure: true,
    },
    {
        path: "/session-validation",
        router: authRouter,
        isSecure: false,
    },
]


routers.forEach((route) => {
    if (route.isSecure) {
        router.use(route.path, authMiddleware,  route.router);
    }
    else {
        router.use(route.path, route.router);
    }
});


export const mainRouter = router;