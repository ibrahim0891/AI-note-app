
import express from 'express';
import { Note } from '../models/note.model.js';
import { sendResponse } from '../../Utils/sendResponse.js';
import getAIResponse from '../../Utils/getAiResponse.js';

class NoteController {
    async createNote(req, res) {
        try {
            const { title, content, categoryId } = req.body
            const userId = req.userId;
            const note = new Note({
                title,
                content,
                categoryId,
                userId,
            });
            await note.save();
            sendResponse(res, {
                success: true,
                statusCode: 201,
                message: "Note created successfully",
                data: note,
            })
        }
        catch (error) {
            sendResponse(res, {
                statusCode: 500,
                success: false,
                message: "Error while creating note",
                data: error ,
            })
        }
    }
    async getNote(req, res) {
        const userId = req.userId;
        const noteId = req.params.noteId;
        try {
            const note = await Note.findOne({ _id: noteId, userId }).populate('categoryId')
            if (!note) {
                sendResponse(res, {
                    statusCode: 404,
                    message: "Note not found",
                    data: null,
                });
            } else {
                sendResponse(res, {
                    statusCode: 200,
                    message: "Note fetched successfully",
                    data: note,
                })
            }
        } catch (error) {
            sendResponse(res, {
                data: null,
                message: error.message,
                statusCode: 400,
            })
        }
    }

    async getNotesByCategory(req, res) {
        const categoryId = req.params.categoryId

        try {
            const notes = await Note.find({ categoryId }).populate("categoryId")
            if (!notes) {
                sendResponse(res, {
                    success: false,
                    statusCode: 404,
                    message: 'Notes not found',
                    data: null
                })
            } else {
                sendResponse(res, {
                    success: true,
                    statusCode: 200,
                    message: 'Notes fetched successfully',
                    data: notes
                })
            }
        } catch (error) {
            sendResponse(res, {
                success: false,
                statusCode: 500,
                message: 'Error while getting notes by category',
                data: null,
            })
        }

    }

    async updateNote(req, res) {
        const noteId = req.body.noteId;
        const { title, content, categoryId , updatedAt } = req.body;
        try {
            const updatedNote = await Note.findOneAndUpdate({ _id: noteId }, { title, content, categoryId , updatedAt })
            if (!updatedNote) {
                sendResponse(res, {
                    statusCode: 404,
                    message: "Note not found",
                    data: null,
                });
            } else {
                sendResponse(res, {
                    statusCode: 200,
                    message: "Note updated successfully",
                    data: updatedNote,
                });
            }
        } catch (error) {
            sendResponse(res, {
                statusCode: 500,
                message: "Error while updating note",
                data: error.message,
            });
        }
    }

    async deleteNote(req, res) {
        const noteId = req.params.noteId;
        try {
            const deletedNote = await Note.findByIdAndDelete(noteId);
            if (!deletedNote) {
                sendResponse(res, {
                    statusCode: 404,
                    message: "Note not found",
                    data: null,
                })
            }
            else {
                sendResponse(res, {
                    statusCode: 200,
                    success: true,
                    message: "Note deleted successfully",
                    data: null,
                })
            }
        } catch (error) {
            sendResponse(res, {
                statusCode: 500,
                message: "Error while deleting note",
                data: null,
            })
        }
    }

    async getAllNote(req, res) {
        const userId = req.userId;
        try {
            const notes = await Note.find({ userId }).populate("categoryId");
            if (!notes) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "Notes not found",
                    data: null,
                });
            } else {
                sendResponse(res, {
                    statusCode: 200,
                    success: true,
                    message: "Notes fetched successfully",
                    data: notes,
                });
            }
        } catch (error) {
            sendResponse(res, {
                statusCode: 500,
                success: false,
                message: "Error while fetching notes",
                data: null,
            });
        }
    }

    async createAiNote(req, res) {
        const { prompt } = req.body;
        console.log(prompt);
        try {
            const aiResponse = await getAIResponse(prompt);
            console.log(aiResponse.content);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: "Note created successfully",
                data: aiResponse,
            });
        } catch (error) {
            sendResponse(res, {
                statusCode: 500,
                success: false,
                message: "Error while creating note",
                data: error,
            });
        }
    }

    async searchNote(req, res) {
        const searchQuery = req.query.search;
        try {
            const notes = await Note.find({
                $or: [
                    { title: { $regex: searchQuery, $options: "i" } },
                    { content: { $regex: searchQuery, $options: "i" } },
                ],
            });
            if (!notes) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "Notes not found",
                    data: null,
                });
            } else {
                sendResponse(res, {
                    statusCode: 200,
                    success: true,
                    message: "Notes fetched successfully",
                    data: notes,
                });
            }
        } catch (error) {
            sendResponse(res, {
                statusCode: 500,
                success: false,
                message: "Error while searching notes",
                data: null,
            });
        }
    }

}

const noteController = new NoteController();
const router = express.Router();

router.post("/create", noteController.createNote);
router.get("/get/:noteId", noteController.getNote); 
router.get("/getNotesByCategory/:categoryId", noteController.getNotesByCategory);
router.put("/update", noteController.updateNote);
router.delete("/delete/:noteId", noteController.deleteNote);
router.get("/getAll", noteController.getAllNote);
router.get("/search", noteController.searchNote);

router.post("/createByAi", noteController.createAiNote);

export const noteRouter = router
