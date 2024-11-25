import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import ClipLoader from 'react-spinners/ClipLoader'; // Import a spinner from react-spinners

const EditPost = () => {
  const { id } = useParams(); // Get post ID from URL parameters
  const [postData, setPostData] = useState({
    title: '',
    body: '',
    tag: '',
    languages: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase.from('Posts').select('*').eq('id', id).single();

        if (error) {
          setError('Error fetching post data.');
        } else {
          setPostData({
            title: data.title || '',
            body: data.body || '',
            tag: data.tag || '',
            languages: data.languages || '',
          });
        }
      } catch (err) {
        setError('Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        title: postData.title,
        body: postData.body,
        tag: postData.tag,
        languages: postData.languages
          ? JSON.stringify(postData.languages.split(',').map((lang) => lang.trim()))
          : null,
      };

      const { error } = await supabase.from('Posts').update(updatedData).eq('id', id);

      if (error) {
        throw error;
      }

      alert('Post updated successfully!');
      navigate(`/posts/${id}`);
    } catch (err) {
      alert('Failed to save post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ClipLoader size={50} color="#4A90E2" />
        <p className="mt-4 text-gray-500">Loading post data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Post</h1>

      <form>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={postData.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter post title"
          />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Body</label>
          <textarea
            name="body"
            value={postData.body}
            onChange={handleInputChange}
            rows="6"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter post content"
          ></textarea>
        </div>

        {/* Tag */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Tag</label>
          <select
            name="tag"
            value={postData.tag}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a tag</option>
            <option value="Project">Project</option>
            <option value="Hackathon">Hackathon</option>
          </select>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Languages</label>
          <input
            type="text"
            name="languages"
            value={postData.languages}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter languages (comma-separated)"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSaveChanges}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;