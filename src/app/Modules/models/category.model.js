import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});
export const Category = mongoose.model("Category", categorySchema)