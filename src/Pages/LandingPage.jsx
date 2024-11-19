import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/posts');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to TeamUp</h1>
          <p className="text-lg md:text-xl mb-6">Collaborate on projects, discover new skills, and build something amazing together!</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300" onClick={handleClick}>
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose TeamUp?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Collaborate on Projects</h3>
              <p>Find teammates based on your skills and interests to work on exciting projects.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Learn New Skills</h3>
              <p>Expand your knowledge by joining projects with different tech stacks and new challenges.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Build Your Portfolio</h3>
              <p>Create real-world projects to showcase your skills to future employers or teammates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Collaborating?</h2>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default LandingPage