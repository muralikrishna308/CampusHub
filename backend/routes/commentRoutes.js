const express = require('express');
const router = express.Router();
const { addComment, getComments, deleteComment, toggleLike } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/:eventId', auth, addComment);
router.get('/:eventId', auth, getComments);
router.delete('/:commentId', auth, deleteComment);
router.put('/like/:commentId', auth, toggleLike);

module.exports = router;
