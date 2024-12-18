import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import Comment from './Comment';

const Post = ({ id, title, body, tag, languages, initialComments, onDelete, timestamp, owner_id }) => {
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadVotes(), loadComments(), fetchOwnerDetails()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const loadVotes = async () => {
    const { data: voteData, error: voteError } = await supabase
      .from('UserVotes')
      .select('vote_type, owner_id')
      .eq('post_id', id);

    if (voteError) {
      console.error('Error fetching votes:', voteError.message);
      return;
    }

    const session = await supabase.auth.getSession();
    const currentUserId = session?.data?.session?.user?.id;

    setUserVote(
      voteData.find((vote) => vote.owner_id === currentUserId)?.vote_type || null
    );
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

  const fetchOwnerDetails = async () => {
    try {
      const { data: owner, error } = await supabase
        .from('UserProfile')
        .select('first_name, last_name, avatar_url')
        .eq('user_id', owner_id)
        .single();

      if (error) {
        console.error('Error fetching owner details:', error.message);
        return;
      }

      setOwnerDetails(owner);
    } catch (error) {
      console.error('Error fetching owner details:', error.message);
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleVote = async (voteType) => {
    try {
      const session = await supabase.auth.getSession();
      const currentUserId = session?.data?.session?.user?.id;

      if (!currentUserId) {
        alert('You must be logged in to vote.');
        return;
      }

      const { data: existingVote, error: fetchError } = await supabase
        .from('UserVotes')
        .select('*')
        .eq('post_id', id)
        .eq('owner_id', currentUserId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing vote:', fetchError.message);
        return;
      }

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          await supabase.from('UserVotes').delete().eq('id', existingVote.id);
        } else {
          await supabase
            .from('UserVotes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        await supabase
          .from('UserVotes')
          .insert({ post_id: id, vote_type: voteType, owner_id: currentUserId });
      }

      loadVotes();
    } catch (error) {
      console.error('Error handling vote:', error.message);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const session = await supabase.auth.getSession();
        const currentUserId = session?.data?.session?.user?.id;

        const { data, error } = await supabase
          .from('Comments')
          .insert([{ post_id: id, body: newComment, owner_id: currentUserId }])
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
        .replace(/^\[|\]$/g, '')
        .replace(/"/g, '')
        .split(',')
        .map((lang) => lang.trim())
    : [];

  const formattedDate = new Date(timestamp).toLocaleString();

  if (loading) {
    return (
      <div className="post-container p-4 border border-gray-300 rounded-lg my-4">
        <div className="animate-pulse">
          {/* Placeholder for the post header */}
          <div className="flex items-center mb-4 space-x-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
          </div>
          {/* Placeholder for title */}
          <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
          {/* Placeholder for body */}
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          {/* Placeholder for tags */}
          <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
          {/* Placeholder for comments toggle */}
          <div className="h-4 bg-gray-300 rounded w-1/2 mt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-container p-4 border border-gray-300 rounded-lg my-4">
      {/* Owner Info */}
      {ownerDetails && (
        <div className="flex items-center mb-4">
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer"
            onClick={() => navigate(`/profile/${owner_id}`)}
          >
            <img
              src={ownerDetails.avatar_url || 'https://via.placeholder.com/150'}
              alt={`${ownerDetails.first_name} ${ownerDetails.last_name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <p
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={() => navigate(`/profile/${owner_id}`)}
            >
              {ownerDetails.first_name} {ownerDetails.last_name}
            </p>
            <p className="text-gray-500 text-sm">{formattedDate}</p>
          </div>
        </div>
      )}

      {/* Post Content */}
      <h2
        className="text-2xl font-semibold cursor-pointer"
        onClick={() => navigate(`/posts/${id}`)}
      >
        {title}
      </h2>
      <p className="text-gray-600 mt-2">{body}</p>

      <div className="tag mt-2 px-3 py-1 rounded-full bg-blue-500 text-white inline-block">
        {tag}
      </div>

      {parsedLanguages.length > 0 && (
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
      )}

      {/* Voting */}
      <div className="votes mt-4 flex items-center space-x-2">
        <button
          className={`upvote-button px-4 py-2 rounded-md ${
            userVote === 'upvote' ? 'bg-green-500' : 'bg-gray-500'
          }`}
          onClick={() => handleVote('upvote')}
        >
          ↑ {upvotes}
        </button>
        <button
          className={`downvote-button px-4 py-2 rounded-md ${
            userVote === 'downvote' ? 'bg-red-500' : 'bg-gray-500'
          }`}
          onClick={() => handleVote('downvote')}
        >
          ↓ {downvotes}
        </button>
      </div>

      {/* Comments */}
      <div className="comments-toggle mt-4">
        <button
          className="toggle-comments px-4 py-2 bg-gray-500 text-white rounded-md"
          onClick={toggleComments}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {showComments && (
        <>
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
          <div className="comments mt-4 p-4 border-t border-gray-200 space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <Comment key={comment.id} comment={comment} onRemove={handleRemoveComment} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Post;