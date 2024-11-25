import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkSession();

    const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authSubscription?.subscription?.unsubscribe();
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

  const handleGetStarted = () => {
    navigate('/posts');
  };

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <section className="bg-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to TeamUp</h1>
            <p className="text-lg md:text-xl mb-6">Collaborate on projects, discover new skills, and build something amazing together!</p>
            <button
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
              onClick={handleLogin}
            >
              Sign Up
            </button>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-10">Why Choose TeamUp?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Collaborate on Projects</h3>
                <p>Find teammates based on your skills and interests to work on exciting projects.</p>
              </div>
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Learn New Skills</h3>
                <p>Expand your knowledge by joining projects with different tech stacks and new challenges.</p>
              </div>
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Build Your Portfolio</h3>
                <p>Create real-world projects to showcase your skills to future employers or teammates.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Collaborating?</h2>
            <button
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
              onClick={handleLogin}
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome Back, {user.user_metadata.full_name || user.email}!</h1>
          <p className="text-lg md:text-xl mb-6">Explore new projects, connect with teammates, and share your ideas.</p>
          <button
            className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
            onClick={handleGetStarted}
          >
            Explore Posts
          </button>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Your Profile</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">View Your Posts</h3>
              <p>Check out the projects you've created or contributed to.</p>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => navigate('/profile/' + user.id)}
              >
                View Profile
              </button>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Manage Your Profile</h3>
              <p>Update your profile information or preferences.</p>
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={() => navigate('/profile-management')}
              >
                Manage Profile
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;