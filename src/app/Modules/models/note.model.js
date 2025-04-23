import mongoose from "mongoose";



const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    categoryId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }, 
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isTrashed: {
        type: Boolean,
        default: false,
    }
});

export const Note = mongoose.model("Note", noteSchema);