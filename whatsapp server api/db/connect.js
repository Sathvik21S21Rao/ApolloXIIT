import mongoose from "mongoose";

export default async function dbConnect() {
    if (mongoose.connections[0].readyState) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
}