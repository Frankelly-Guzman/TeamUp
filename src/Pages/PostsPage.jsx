import React, { useEffect, useState } from 'react';
import { supabase } from '../client';  // Ensure Supabase client is correctly initialized
import Post from '../Components/Post'; // Import the Post component

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(''); // For tag filtering
  const [sortBy, setSortBy] = useState('created_at'); // Default sorting by created time
  const [searchQuery, setSearchQuery] = useState(''); // For searching posts by title

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('Posts')
          .select('*')
          .ilike('tag', selectedTag || '%');  // Filter by selected tag

        if (error) {
          throw error;
        }

        setPosts(data);  // Set posts to state
        setLoading(false);
      } catch (error) {
        setError('Error fetching posts: ' + error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedTag]);  // Fetch posts when the tag changes

  // Function to remove a post from the state
  const handleRemovePost = (id) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  // Function to handle sorting by created time or upvotes
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Function to handle the search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Sorting logic based on the selected sort option
  const sortedPosts = [...posts]
    .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by title
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at);  // Sort by created time
      } else if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;  // Sort by upvotes count
      }
      return 0;
    });

  return (
    <div className="posts-page p-4">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>

      {/* Filter and Search Controls */}
      <div className="filter-search-controls flex flex-col sm:flex-row sm:justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        
        {/* Search Input */}
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by title..."
            className="bg-white border border-gray-300 rounded-md p-2 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="w-full sm:w-1/3">
          <select
            className="bg-white border border-gray-300 rounded-md p-2 w-full"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}  // Update selectedTag
          >
            <option value="">All</option>
            <option value="Project">Project</option>
            <option value="Hackathon">Hackathon</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-1/3">
          <select
            className="bg-white border border-gray-300 rounded-md p-2 w-full"
            value={sortBy}
            onChange={handleSortChange}  // Update sorting method
          >
            <option value="created_at">Sort by Created Time</option>
            <option value="upvotes">Sort by Upvotes</option>
          </select>
        </div>

      </div>

      {/* Display loading state */}
      {loading && <p className="text-center py-10">Loading posts...</p>}

      {/* Display error if any */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Display posts */}
      <div className="posts-list mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.length === 0 ? (
          <p className="text-center w-full">No posts found.</p>
        ) : (
          sortedPosts.map((post) => (
            <div key={post.id} className="post-container bg-white shadow-lg rounded-lg p-4">
              <Post
                id={post.id}
                title={post.title}
                body={post.body}
                tag={post.tag}
                languages={post.languages}
                initialUpvotes={post.upvotes}
                initialDownvotes={post.downvotes}
                initialComments={[]} // You can fetch comments later if needed
                onDelete={handleRemovePost} // Pass the function to delete the post
                timestamp={post.created_at}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostsPage;