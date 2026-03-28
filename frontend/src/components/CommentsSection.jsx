import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './CommentsSection.css';

const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

const Avatar = ({ name, size = 'default' }) => (
    <div className={`yt-avatar ${size === 'small' ? 'yt-reply-avatar' : ''}`}>
        {name?.charAt(0).toUpperCase() || 'A'}
    </div>
);

const TimeAgo = ({ date }) => {
    const format = (d) => {
        const seconds = Math.floor((new Date() - new Date(d)) / 1000);
        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };
    return <span className="yt-timestamp">{format(date)}</span>;
};


const CommentItem = ({ comment, replies, onReply, onLike, onDelete, currentUser }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    const getUserId = (u) => u?.id || u?._id;
    const currentUserId = getUserId(currentUser);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (replyText.trim()) {
            onReply(replyText, comment._id);
            setReplyText('');
            setIsReplying(false);
            setShowReplies(true);
        }
    };

    return (
        <div className="yt-comment-item">
            <Avatar name={comment.userName} />
            <div className="yt-comment-main">
                <div className="yt-comment-header">
                    <span className={`yt-author ${comment.userRole === 'admin' ? 'organizer' : ''}`}>
                        {comment.userName} {comment.userRole === 'admin' && 'Organiser'}
                    </span>
                    <TimeAgo date={comment.createdAt} />
                </div>
                <div className="yt-comment-text">{comment.text}</div>
                <div className="yt-comment-actions">
                    <button 
                        className={`yt-action-btn ${comment.likes?.includes(currentUserId) ? 'liked' : ''}`}
                        onClick={() => onLike(comment._id)}
                    >
                        👍 {comment.likes?.length || ''}
                    </button>
                    <button className="yt-action-btn" onClick={() => setIsReplying(!isReplying)}>
                        REPLY
                    </button>
                    {(currentUserId === comment.user || currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'superadmin') && (
                        <button className="yt-action-btn" onClick={() => onDelete(comment._id)}>
                            DELETE
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {isReplying && (
                    <form className="yt-reply-form" onSubmit={handleReplySubmit}>
                        <Avatar name={currentUser.name} size="small" />
                        <div className="yt-form-content">
                            <div className="yt-input-wrapper">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Add a reply..."
                                    autoFocus
                                />
                            </div>
                            <div className="yt-form-actions">
                                <button type="button" className="yt-btn yt-btn-cancel" onClick={() => setIsReplying(false)}>
                                    CANCEL
                                </button>
                                <button type="submit" className="yt-btn yt-btn-post" disabled={!replyText.trim()}>
                                    REPLY
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Replies Display */}
                {replies.length > 0 && (
                    <div className="yt-replies-section">
                        {!showReplies ? (
                            <button className="yt-toggle-replies" onClick={() => setShowReplies(true)}>
                                ▾ View {replies.length} replies
                            </button>
                        ) : (
                            <>
                                <button className="yt-toggle-replies" onClick={() => setShowReplies(false)}>
                                    ▴ Hide {replies.length} replies
                                </button>
                                <div className="yt-replies-container">
                                    {replies.map(reply => (
                                        <div key={reply._id} className="yt-comment-item">
                                            <Avatar name={reply.userName} size="small" />
                                            <div className="yt-comment-main">
                                                <div className="yt-comment-header">
                                                    <span className={`yt-author ${reply.userRole === 'admin' ? 'organizer' : ''}`}>
                                                        {reply.userName} {reply.userRole === 'admin' && 'Organiser'}
                                                    </span>
                                                    <TimeAgo date={reply.createdAt} />
                                                </div>
                                                <div className="yt-comment-text">{reply.text}</div>
                                                <div className="yt-comment-actions">
                                                    <button 
                                                        className={`yt-action-btn ${reply.likes?.includes(currentUserId) ? 'liked' : ''}`}
                                                        onClick={() => onLike(reply._id)}
                                                    >
                                                        👍 {reply.likes?.length || ''}
                                                    </button>
                                                    {(currentUserId === reply.user || currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'superadmin') && (
                                                        <button className="yt-action-btn" onClick={() => onDelete(reply._id)}>
                                                            DELETE
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const CommentsSection = ({ eventId, eventTitle }) => {
    const { user, token } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [eventId, token]);

    const fetchComments = async () => {
        if (!token || !eventId) return;
        try {
            const res = await fetch(`${API_URL}/api/comments/${eventId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            } else {
                const data = await res.json();
                setError(data.msg || "Discussion section is restricted to participants.");
            }
        } catch (err) {
            setError("Error loading discussion.");
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (text, parentCommentId = null) => {
        if (!eventId) {
            alert("Error: Event ID is missing.");
            return;
        }
        
        try {
            const cleanUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
            const res = await fetch(`${cleanUrl}/api/comments/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text, parentCommentId })
            });
            if (res.ok) {
                const added = await res.json();
                setComments(prev => [...prev, added]);
                if (!parentCommentId) {
                    setNewComment('');
                    setIsFocused(false);
                }
            } else {
                const data = await res.json();
                alert(data.msg || data.error || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            alert("Connection error: " + err.message);
        }
    };

    const handleLike = async (commentId) => {
        try {
            const res = await fetch(`${API_URL}/api/comments/like/${commentId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const likes = await res.json();
                setComments(comments.map(c => c._id === commentId ? { ...c, likes } : c));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setComments(comments.filter(c => c._id !== commentId && c.parentComment !== commentId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="yt-loading">Loading discussion...</div>;
    if (error) return <div className="yt-error">{error}</div>;

    const parentComments = comments.filter(c => !c.parentComment);

    return (
        <div className="yt-comments-container">
            <h3 className="yt-comments-header">
                {parentComments.length} Discussion Comments
            </h3>

            {/* Main Form */}
            <div className="yt-main-form">
                <Avatar name={user.name} />
                <div className="yt-form-content">
                    <div className="yt-input-wrapper">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            placeholder="Add a comment..."
                        />
                    </div>
                    {isFocused && (
                        <div className="yt-form-actions">
                            <button type="button" className="yt-btn yt-btn-cancel" onClick={() => { setIsFocused(false); setNewComment(''); }}>
                                CANCEL
                            </button>
                            <button 
                                type="button" 
                                className="yt-btn yt-btn-post" 
                                disabled={!newComment.trim()}
                                onClick={() => handlePost(newComment)}
                            >
                                COMMENT
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comments List */}
            <div className="yt-comment-list">
                {parentComments.slice().reverse().map(comment => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        replies={comments.filter(c => c.parentComment === comment._id)}
                        onReply={handlePost}
                        onLike={handleLike}
                        onDelete={handleDelete}
                        currentUser={user}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
