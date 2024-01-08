import "dotenv/config";
import { createServer } from "http";
import express from "express";
import { json } from "body-parser";
import { User } from "./user.model";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Post } from "./post.model";

const sessionCookieName = "userId";
const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(json());

app.post("/api/auth/register", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            res.status(400);
            res.send("Must provide email, username and password");
            return;
        }

        const user = await User.create({
            email,
            username,
            password
        });

        const now = new Date();
        const expires = new Date();
        expires.setDate(now.getDate() + 1);

        res.cookie(sessionCookieName, user._id, {
            httpOnly: true,
            secure: true,
            signed: true,
            expires
        });

        res.status(201);
        res.end();
    } catch (error) {
        console.error(error);
        next(error);
    }
});

app.get("/api/currentUser", async (req, res, next) => {
    try {
        const user = await getUser(req.signedCookies[sessionCookieName]);

        res.status(200);
        res.json(user);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

app.get("/api/posts", (req, res) => {
    const posts = [
        { _id: "aaaaa", createdAt: new Date(2024, 0, 7), user: { username: "omer" }, subject: "First post!" },
        { _id: "bbbbb", createdAt: new Date(2024, 0, 8), user: { username: "dolevoper" }, subject: "Node.js module is almost over" }
    ];

    posts.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());

    res.send(posts);
});

app.post("/api/posts", async (req, res, next) => {
    try {
        const user = await getUser(req.signedCookies[sessionCookieName]);

        if (!user) {
            throw new Error();
        }

        const { subject, content } = req.body;

        if (!subject || !content) {
            res.status(400);
            res.send("Must provide subject and content");
            return;
        }

        await Post.create({
            user,
            subject,
            content
        });

        res.status(201);
        res.end();
    } catch (error) {
        console.error(error);
        next(error);
    }
});

app.use(express.static("public"));

const server = createServer(app);
const port = process.env.PORT ?? 3000;

async function startServer() {
    if (!process.env.CONN_STRING) {
        throw new Error("Must provide connection string")
    }

    await mongoose.connect(process.env.CONN_STRING, {
        dbName: "simple-forum"
    });

    server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

startServer();

async function getUser(userId?: string) {
    if (!userId) {
        return null;
    }

    const user = await User.findById(userId, { username: true });

    if (!user) {
        throw new Error();
    }

    return user;
}
