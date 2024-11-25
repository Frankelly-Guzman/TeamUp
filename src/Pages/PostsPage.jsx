import React, { useEffect, useState } from 'react';
import { supabase } from '../client'; // Ensure Supabase client is correctly initialized
import Post from '../Components/Post'; // Import the Post component

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(''); // For tag filtering
  const [sortBy, setSortBy] = useState('created_at'); // Default sorting by created time
  const [searchQuery, setSearchQuery] = useState(''); // For searching posts by title
  const [selectedLanguages, setSelectedLanguages] = useState([]); // For filtering posts by languages
  const [availableLanguages, setAvailableLanguages] = useState([]); // Available languages for dropdown

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Posts')
          .select(`
            *,
            upvotes:UserVotes(vote_type)
          `)
          .ilike('tag', selectedTag || '%'); // Filter by selected tag

        if (error) throw error;

        const aggregatedPosts = data.map((post) => {
          const upvotes = post.upvotes.filter((vote) => vote.vote_type === 'upvote').length;
          const downvotes = post.upvotes.filter((vote) => vote.vote_type === 'downvote').length;
          return { ...post, upvotes, downvotes };
        });

        // Gather unique languages for dropdown
        const languages = [
          ...new Set(
            aggregatedPosts.flatMap((post) =>
              post.languages
                ? post.languages
                    .replace(/^\[|\]$/g, '')
                    .replace(/"/g, '')
                    .split(',')
                    .map((lang) => lang.trim())
                : []
            )
          ),
        ];

        setAvailableLanguages(languages);
        setPosts(aggregatedPosts);
        setLoading(false);
      } catch (error) {
        setError('Error fetching posts: ' + error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedTag]);

  const handleSortChange = (event) => setSortBy(event.target.value);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleLanguageSelect = (event) => {
    const language = event.target.value;
    if (language && !selectedLanguages.includes(language)) {
      setSelectedLanguages((prev) => [...prev, language]);
    }
  };

  const removeLanguageFilter = (language) => {
    setSelectedLanguages((prev) => prev.filter((lang) => lang !== language));
  };

  // Sorting and filtering logic
  const filteredPosts = posts
    .filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by title
    .filter((post) => {
      if (selectedLanguages.length === 0) return true;
      const parsedLanguages = post.languages
        ? post.languages
            .replace(/^\[|\]$/g, '')
            .replace(/"/g, '')
            .split(',')
            .map((lang) => lang.trim().toLowerCase())
        : [];
      return selectedLanguages.every((lang) =>
        parsedLanguages.includes(lang.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at); // Sort by created time
      } else if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes; // Sort by upvotes count
      }
      return 0;
    });

  return (
    <div className="posts-page p-4">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>

      {/* Filter and Search Controls */}
      <div className="filter-search-controls flex flex-col sm:flex-row sm:justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search Input */}
        <div className="w-full sm:w-1/4">
          <input
            type="text"
            placeholder="Search by title..."
            className="bg-white border border-gray-300 rounded-md p-2 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Language Filter */}
        <div className="w-full sm:w-1/4">
          <select
            className="bg-white border border-gray-300 rounded-md p-2 w-full"
            onChange={handleLanguageSelect}
          >
            <option value="">Select a language...</option>
            {availableLanguages.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Dropdown */}
        <div className="w-full sm:w-1/4">
          <select
            className="bg-white border border-gray-300 rounded-md p-2 w-full"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)} // Update selectedTag
          >
            <option value="">All</option>
            <option value="Project">Project</option>
            <option value="Hackathon">Hackathon</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-1/4">
          <select
            className="bg-white border border-gray-300 rounded-md p-2 w-full"
            value={sortBy}
            onChange={handleSortChange} // Update sorting method
          >
            <option value="created_at">Sort by Created Time</option>
            <option value="upvotes">Sort by Upvotes</option>
          </select>
        </div>
      </div>

      {/* Language Filter Tags */}
      {selectedLanguages.length > 0 && (
        <div className="language-tags flex flex-wrap mb-4">
          {selectedLanguages.map((language, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-md mr-2 mb-2"
            >
              {language}
              <button
                onClick={() => removeLanguageFilter(language)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Display loading state */}
      {loading && <p className="text-center py-10">Loading posts...</p>}

      {/* Display error if any */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Display posts */}
      <div className="posts-list mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length === 0 ? (
          <p className="text-center w-full">No posts found.</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-container bg-white shadow-lg rounded-lg p-4">
              <Post
                id={post.id}
                title={post.title}
                body={post.body}
                tag={post.tag}
                languages={post.languages}
                owner_id={post.owner_id} // Pass owner_id
                timestamp={post.created_at}
                onDelete={(id) =>
                  setPosts((prev) => prev.filter((post) => post.id !== id))
                } // Delete post
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostsPage;