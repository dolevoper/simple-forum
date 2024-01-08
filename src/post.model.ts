import { Schema, Types, model } from "mongoose";

interface Post {
    createdAt: Date;
    user: Types.ObjectId;
    subject: string;
    content: string;
}

const schema = new Schema<Post>({
    createdAt: { type: Schema.Types.Date, default: () => new Date() },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    subject: String,
    content: String
});

export const Post = model<Post>("Post", schema, "posts");