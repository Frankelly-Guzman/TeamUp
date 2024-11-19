import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const SinglePostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      // Fetch the post
      const { data: postData, error: postError } = await supabase
        .from('Posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) {
        console.error('Error fetching post:', postError.message);
      } else {
        setPost(postData);
      }

      // Fetch comments for the post
      const { data: commentsData, error: commentsError } = await supabase
        .from('Comments')
        .select('*')
        .eq('post_id', id);

      if (commentsError) {
        console.error('Error fetching comments:', commentsError.message);
      } else {
        setComments(commentsData);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleRemovePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error: votesError } = await supabase
          .from('UserVotes')
          .delete()
          .eq('post_id', id);

        if (votesError) {
          throw votesError;
        }

        const { error: commentsError } = await supabase
          .from('Comments')
          .delete()
          .eq('post_id', id);

        if (commentsError) {
          throw commentsError;
        }

        const { error: postError } = await supabase
          .from('Posts')
          .delete()
          .eq('id', id);

        if (postError) {
          throw postError;
        }

        navigate('/posts');  // Navigate back to the posts list
      } catch (error) {
        console.error('Error deleting post:', error.message);
        alert('There was an error deleting the post. Please try again.');
      }
    }
  };

  if (!post) {
    return <p className="text-center py-10">Loading...</p>;
  }

  // Clean and parse languages if they exist
  const parsedLanguages = post.languages
    ? post.languages
        .replace(/^\[|\]$/g, '') // Remove opening and closing brackets
        .replace(/"/g, '') // Remove all double quotes
        .split(',') // Split the string into an array by commas
        .map((lang) => lang.trim()) // Trim spaces around each language
    : [];

  const formattedDate = new Date(post.created_at).toLocaleString();

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
      <p className="text-gray-600 text-lg mb-6">{post.body}</p>
      <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
        {post.tag}
      </span>

      {/* Display languages if available */}
      {parsedLanguages.length > 0 ? (
        <div className="languages mt-4">
          <h3 className="font-semibold text-lg text-gray-800">Languages:</h3>
          <div className="flex space-x-2 mt-2">
            {parsedLanguages.map((language, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No languages specified</p>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">Comments</h2>
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">{comment.body}</p>
              <p className="text-sm text-gray-500 mt-1">By: {comment.username}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Delete Post Button */}
      <div className="delete-post mt-4">
        <button
          className="delete-post-button px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={handleRemovePost}
        >
          Delete Post
        </button>
      </div>

      <div className="mt-4">
        <span className="text-gray-500 opacity-75">Created: {formattedDate}</span>
      </div>
    </div>
  );
};

export default SinglePostPage;