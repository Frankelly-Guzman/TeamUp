import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { div } from 'framer-motion/client';

const Post = ({ id, title, body, tag, languages, initialComments, onDelete, timestamp }) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadVotes();
    loadComments();
  }, []);

  const loadVotes = async () => {
    const { data: voteData, error: voteError } = await supabase
      .from('UserVotes')
      .select('vote_type')
      .eq('post_id', id);

    if (voteError) {
      console.error('Error fetching votes:', voteError.message);
      return;
    }

    const hasUpvote = voteData.some((vote) => vote.vote_type === 'upvote');
    const hasDownvote = voteData.some((vote) => vote.vote_type === 'downvote');
    setUserVote(hasUpvote ? 'upvote' : hasDownvote ? 'downvote' : null);
    setUpvotes(voteData.filter((vote) => vote.vote_type === 'upvote').length);
    setDownvotes(voteData.filter((vote) => vote.vote_type === 'downvote').length);
  };

  const loadComments = async () => {
    const { data: commentsData, error } = await supabase
      .from('Comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading comments:', error.message);
    } else {
      setComments(commentsData);
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleVote = async (voteType) => {
    try {
      // Only handle upvote for now
      if (voteType === 'upvote') {
        // Add a new upvote entry
        await supabase.from('UserVotes').insert([{ post_id: id, vote_type: 'upvote' }]);
  
        // Increment the upvotes count
        loadVotes();  // This will refresh the upvote count from the database
      }
    } catch (error) {
      console.error('Error handling vote:', error.message);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const { data, error } = await supabase
          .from('Comments')
          .insert([{ post_id: id, body: newComment }])
          .single();

        if (error) {
          throw error;
        }

        setNewComment('');
        loadComments();
      } catch (error) {
        console.error('Error adding comment:', error.message);
      }
    }
  };

  const handleRemoveComment = async (commentId) => {
    try {
      await supabase.from('Comments').delete().eq('id', commentId);
      loadComments();
    } catch (error) {
      console.error('Error removing comment:', error.message);
    }
  };

  const parsedLanguages = languages
    ? languages
        .replace(/^\[|\]$/g, '') // Remove opening and closing brackets
        .replace(/"/g, '') // Remove all double quotes
        .split(',') // Split the string into an array by commas
        .map((lang) => lang.trim()) // Trim spaces around each language
    : [];

  const formattedDate = new Date(timestamp).toLocaleString();
  
  return (
    <div className="post-container p-4 border border-gray-300 rounded-lg my-4">
      <h2 className="text-2xl font-semibold cursor-pointer" onClick={() => navigate(`/posts/${id}`)}>{title}</h2>
      <p className="text-gray-600 mt-2">{body}</p>

      <div className="tag mt-2 px-3 py-1 rounded-full bg-blue-500 text-white inline-block">
        {tag}
      </div>

      {parsedLanguages.length > 0 ? (
        <div className="languages mt-2 flex flex-wrap space-x-2">
          <h3 className="font-bold text-gray-700">Languages:</h3>
          {parsedLanguages.map((language, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-md"
            >
              {language}
            </span>
          ))}
        </div>
      ) : (
        <p>No languages found</p>
      )}

      <div className="votes mt-4 flex items-center space-x-2">
        <button
          className={`upvote-button px-4 py-2 rounded-md ${userVote === 'upvote' ? 'bg-green-500' : 'bg-gray-500'}`}
          onClick={() => handleVote('upvote')}
        >
          ↑ {upvotes}
        </button>
        <button
          className={`downvote-button px-4 py-2 rounded-md ${userVote === 'downvote' ? 'bg-red-500' : 'bg-gray-500'}`}
          onClick={() => handleVote('downvote')}
        >
          ↓ {downvotes}
        </button>
      </div>

      <div className="comments-toggle mt-4">
        <button
          className="toggle-comments px-4 py-2 bg-gray-500 text-white rounded-md"
          onClick={toggleComments}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {showComments && (
        <div className="add-comment mt-4">
          <textarea
            className="comment-input p-2 border rounded-md w-full"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            className="submit-comment-button px-4 py-2 bg-blue-500 text-white rounded-md mt-2"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      )}

      {showComments && (
        <div className="comments mt-4 p-4 border-t border-gray-200 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            comments.filter(Boolean).map((comment) => (
              <Comment key={comment.id} comment={comment} onRemove={handleRemoveComment} />
            ))
          )}
        </div>
      )}
      <div className='mt-4'><span className='text-gray-500 opacity-75'>Created: {formattedDate}</span></div>
    </div>
  );
};

export default Post;