import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle dropdown menu

  useEffect(() => {
    // Check for an existing session on mount
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    checkSession();

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) console.error('Error logging in with GitHub:', error);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else setUser(null);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Toggle dropdown menu state
  };

  return (
    <div className="relative">
      <div className="w-full bg-black py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          {/* Logo Section */}
          <div className="text-white text-2xl font-bold">TeamUp</div>

          {/* Navigation Links */}
          <div className="flex gap-6">
            <Link to="/" className="text-white hover:text-gray-300 transition-all duration-300">Home</Link>
            <Link to="/posts" className="text-white hover:text-gray-300 transition-all duration-300">Posts</Link>
            <Link to="/create-post" className="text-white hover:text-gray-300 transition-all duration-300">Create Post</Link>
          </div>

          {/* Authentication Section */}
          <div className="relative">
            {user ? (
              <div className="relative">
                {/* User Avatar */}
                <img
                  src={user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40'}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                  onClick={toggleMenu}
                />

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 animate-fade-in">
                    <ul className="py-2">
                      <li>
                        <Link
                          to={`/profile/${user.id}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuOpen(false)}
                        >
                          View Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile-management"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuOpen(false)}
                        >
                          Manage Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-700"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;