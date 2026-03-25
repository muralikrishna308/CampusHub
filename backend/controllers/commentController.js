const Comment = require('../models/Comment');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @route   POST api/comments/:eventId
// @desc    Add a comment/reply
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { text, parentCommentId } = req.body;
    const userId = req.user.id;

    console.log("POST api/comments params:", { eventId, userId, parentCommentId, role: req.user?.role });
    
    const event = await Event.findById(eventId);
    if (!event) {
      console.log("Event not found for ID:", eventId);
      return res.status(404).json({ msg: "Event not found" });
    }

    const currentDate = new Date();
    const eventDate = new Date(event.eventDate);
    console.log("Dates - Current:", currentDate, "Event:", eventDate);

    // Visibility Check: Organizer or Global Admin or Registered Participant
    let isAuthorized = false;
    const adminIdStr = event.admin ? (event.admin._id || event.admin).toString() : null;
    const isOwner = adminIdStr === userId;
    const isAnyAdmin = req.user?.role === 'admin';

    console.log("Authorization Check:", { isOwner, isAnyAdmin, userId, adminIdStr });

    if (isOwner || isAnyAdmin) {
      isAuthorized = true;
    } else {
      const reg = await Registration.findOne({
        event: eventId,
        user: userId,
        status: { $in: ['accepted', 'attended', 'approved'] }
      });
      console.log("Registration Found:", !!reg);
      if (reg) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ msg: "You must be a participant or organizer to join the discussion." });
    }

    // Fetch user details to get correct name
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ msg: "User not found" });

    const newComment = new Comment({
      event: eventId,
      user: userId,
      userName: currentUser.name,
      userRole: currentUser.role || 'student',
      text,
      parentComment: parentCommentId || null
    });

    await newComment.save();
    res.json(newComment);
  } catch (err) {
    console.error("ADD_COMMENT_ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// @route   GET api/comments/:eventId
// @desc    Get all comments (flat list)
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Authorization (Same as addComment)
    let isAuthorized = false;
    const isAdmin = 
      (event.admin && event.admin.toString() === userId) || 
      (req.user && req.user.role === 'admin');

    if (isAdmin) {
      isAuthorized = true;
    } else {
      const reg = await Registration.findOne({
        event: eventId,
        user: userId,
        status: { $in: ['accepted', 'attended', 'approved'] }
      });
      if (reg) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ msg: "Not authorized to view this discussion." });
    }

    const comments = await Comment.find({ event: eventId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   PUT api/comments/like/:commentId
// @desc    Like/Unlike a comment
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    const index = comment.likes.indexOf(req.user.id);
    if (index === -1) {
      comment.likes.push(req.user.id);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();
    res.json(comment.likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   DELETE api/comments/:commentId
// @desc    Delete comment
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) return res.status(404).json({ msg: "Not found" });
      
      const event = await Event.findById(comment.event);
      if (comment.user.toString() !== req.user.id && event.admin.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Unauthorized' });
      }

      // Also delete children (replies) if this is a parent
      if (!comment.parentComment) {
          await Comment.deleteMany({ parentComment: comment._id });
      }

      await comment.deleteOne();
      res.json({ msg: 'Removed' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
