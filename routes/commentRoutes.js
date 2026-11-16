const express = require('express');
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/like/:commentId', authMiddleware, async (req, res) => {
    console.log("🧪 קיבלנו בקשה ל־LIKE על תגובה");

    try {
        const commentId = req.params.commentId;
        const userId = req.user?.userId;

        console.log("🔍 commentId:", commentId);
        console.log("🔍 userId:", userId);

        if (!commentId || !userId) {
            console.log("❌ חסר commentId או userId");
            return res.status(400).json({ message: 'Missing commentId or userId' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            console.log("❌ תגובה לא נמצאה");
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (!Array.isArray(comment.likes)) comment.likes = [];

        // השוואה עם המרת ObjectId למחרוזת
        const index = comment.likes.findIndex(id => id.toString() === userId);

        if (index === -1) {
            comment.likes.push(userId);
            console.log("❤️ נוספה אהדה");
        } else {
            comment.likes.splice(index, 1);
            console.log("💔 בוטלה אהדה");
        }

        await comment.save();
        console.log("✅ לייקים מעודכנים:", comment.likes);

        res.json({ message: 'Like updated', likes: comment.likes });
    } catch (error) {
        console.error("❌ שגיאה בשרת בלייק תגובה:", error);
        res.status(500).json({ message: 'Error liking comment', error: error.message });
    }
});



// ✅ Add comment or reply
router.post('/:recipeId/:parentId?', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        const user = req.user.userId;

        const newComment = new Comment({
            recipe: req.params.recipeId,
            user,
            text,
            parentComment: req.params.parentId || null,
            createdAt: new Date()
        });

        await newComment.save();
        const populated = await newComment.populate('user', '_id username profileImage');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// ✅ Delete a comment
router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment || comment.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Comment.deleteOne({ _id: req.params.commentId });
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment' });
    }
});

// ✅ Get comments for a recipe
router.get('/:recipeId', async (req, res) => {
    try {
        const comments = await Comment.find({ recipe: req.params.recipeId })
            .populate('user', '_id username profileImage')
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

module.exports = router;
