import express from "express";
import { Category } from "../models/category.model.js";
import { sendResponse } from "../../Utils/sendResponse.js";
import { Note } from "../models/note.model.js";
import mongoose from "mongoose";


class CategoryController {
    async createCategory(req, res) {
        const { name } = req.body;
        const userId = req.userId;
        const existingCategory = await Category.findOne({ name, userId });
        if (existingCategory) {
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Category already exists",
                data: null
            });
            return;
        }
        const category = new Category({
            name,
            userId,
        });
        await category.save();
        sendResponse(res, {
            statusCode: 201,
            success: false,
            message: "Category created successfully",
            data: category,
        });

    }
    async getCategories(req, res) {
        const userId = req.userId;
        // const categories = await Category.find({ userId });
        const categories = await Category.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'notes',
                    localField: '_id',
                    foreignField: 'categoryId',
                    as: 'notes'
                }
            },
            {
                $addFields: {
                    noteCount: { $size: '$notes' }
                }
            }
        ])


        console.log(categories);


        if (categories.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                message: "No categories found",
                data: null,
            });
            return;
        }
        else {
            sendResponse(res, {
                statusCode: 200,
                message: "Categories fetched successfully",
                data: categories,
            });
        }
    }
    async renameCategory(req, res) {
        const { categoryId, newName } = req.body;
        try {
            await Category.findByIdAndUpdate(categoryId, { name: newName });
            sendResponse(res, {
                success: true,
                statusCode: 200,
                message: "Category renamed successfully",
                data: null,
            });
        } catch (error) {
            sendResponse(res, {
                success: false,
                statusCode: 500,
                message: "Error while renaming category",
                data: null,
            });
        }
    }
    async deleteCategory(req, res) {
        const { categoryId } = req.body;
        try {
            const notesUnderCategory = await Note.find({ category: categoryId });
            const defaultCategory = await Category.findOne({ name: "Default", userId: req.userId });
            if (notesUnderCategory) {
                await Note.updateMany({ categoryId: categoryId }, { categoryId: defaultCategory._id });
                await Category.findByIdAndDelete(categoryId);
                sendResponse(res, {
                    success: true,
                    statusCode: 200,
                    message: "Category deleted successfully",
                    data: null,
                });
            } else {
                await Category.findByIdAndDelete(categoryId);
                sendResponse(res, {
                    success: true,
                    statusCode: 200,
                    message: "Category deleted successfully",
                    data: null,
                });
            }
        } catch (error) {
            sendResponse(res, {
                success: false,
                statusCode: 500,
                message: "Error while deleting category",
                data: error.message,
            });
        }
    }
}


const categoryController = new CategoryController();
const router = express.Router()

router.post('/create', categoryController.createCategory);
router.get("/get", categoryController.getCategories);
router.put("/rename", categoryController.renameCategory);
router.delete("/delete", categoryController.deleteCategory);

export const categoryRouter = router;