import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { PulseLoader } from 'react-spinners';

const Comment = ({ comment, onRemove }) => {
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.body);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        setLoading(true);
        const { data: owner, error } = await supabase
          .from('UserProfile')
          .select('first_name, last_name, avatar_url')
          .eq('user_id', comment.owner_id)
          .single();

        if (error) {
          console.error('Error fetching owner details:', error.message);
          return;
        }

        setOwnerDetails(owner);
      } catch (error) {
        console.error('Error fetching owner details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      const session = await supabase.auth.getSession();
      setCurrentUserId(session?.data?.session?.user?.id || null);
    };

    fetchOwnerDetails();
    fetchCurrentUser();
  }, [comment.owner_id]);

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from('Comments')
        .update({ body: editedComment })
        .eq('id', comment.id);

      if (error) {
        console.error('Error updating comment:', error.message);
        alert('Failed to update comment. Please try again.');
        return;
      }

      setIsEditing(false);
      alert('Comment updated successfully!');
    } catch (error) {
      console.error('Error editing comment:', error.message);
      alert('Failed to update comment. Please try again.');
    }
  };

  return (
    <div className="comment py-4 border-b border-gray-200 flex items-start space-x-4">
      {/* Owner Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden">
        {loading ? (
          <PulseLoader color="#ccc" size={6} />
        ) : (
          <img
            src={ownerDetails?.avatar_url || 'https://via.placeholder.com/150'}
            alt={`${ownerDetails?.first_name || 'User'}'s avatar`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Comment Details */}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="bg-gray-300 h-4 w-24 rounded animate-pulse" />
          ) : (
            <p className="font-semibold text-gray-700">
              {ownerDetails
                ? `${ownerDetails.first_name} ${ownerDetails.last_name}`
                : 'Unknown User'}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>

        {/* Edit Mode */}
        {isEditing ? (
          <div>
            <textarea
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              rows="3"
            />
            <button
              onClick={handleEdit}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedComment(comment.body);
              }}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        ) : loading ? (
          <div className="bg-gray-300 h-6 w-full rounded animate-pulse mt-2" />
        ) : (
          <p className="text-gray-700 mt-2">{comment.body}</p>
        )}
      </div>

      {/* Actions for Current User */}
      {currentUserId === comment.owner_id && !loading && (
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(comment.id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;