import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // To get user ID from URL and navigation
import { supabase } from '../client';

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Fetch user profile by user ID
        const { data, error } = await supabase
          .from('UserProfile')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err.message);
        setError('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        setLoadingPosts(true);

        // Fetch posts by user ID
        const { data, error } = await supabase
          .from('Posts')
          .select('*')
          .eq('owner_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err.message);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserProfile();
    fetchUserPosts();
  }, [userId]);

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const handleShowMore = () => setShowAllPosts(true);

  return (
    <div className="profile-page max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      {loading ? (
        // Skeleton loader for profile
        <div className="flex flex-col items-center mb-6 animate-pulse">
          <div className="w-32 h-32 rounded-full bg-gray-200 mb-4" />
          <div className="w-40 h-6 bg-gray-200 rounded mb-2" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </div>
      ) : (
        <>
          {/* Avatar and Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-300">
              <img
                src={profile.avatar_url || 'https://via.placeholder.com/150'}
                alt={`${profile.first_name || 'User'}'s Avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-semibold">{profile.first_name} {profile.last_name}</h1>
            <p className="text-gray-600 italic">{profile.major}</p>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-gray-300 transition"
                >
                  <img src="/github-mark.svg" alt="GitHub" className="w-6 h-6" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-gray-300 transition"
                >
                  <img src="/linkedin-logo.svg" alt="LinkedIn" className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Education</h2>
              <p className="text-gray-700">
                <strong>University:</strong> {profile.university || 'N/A'}
              </p>
              <p className="text-gray-700">
                <strong>Graduation Year:</strong> {profile.grad_year || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <p className="text-gray-700">
                <strong>Discipline:</strong> {profile.discipline || 'N/A'}
              </p>
              <p className="text-gray-700">
                <strong>Time Zone:</strong> {profile.time_zone || 'N/A'}
              </p>
            </div>
          </div>
        </>
      )}

      {/* User's Posts Section */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">User's Posts</h2>
        {loadingPosts ? (
          // Skeleton loader for posts
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts to display.</p>
        ) : (
          <>
            {posts.slice(0, showAllPosts ? posts.length : 4).map((post) => (
              <div
                key={post.id}
                className="p-4 border-b border-gray-300 last:border-b-0 cursor-pointer hover:bg-gray-200 transition"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <h3 className="font-semibold text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.tag}</p>
              </div>
            ))}
            {!showAllPosts && posts.length > 4 && (
              <button
                onClick={handleShowMore}
                className="mt-4 w-full text-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Show More
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;