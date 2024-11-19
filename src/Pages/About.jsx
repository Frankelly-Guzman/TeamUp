import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">About Us</h1>
      <p className="text-lg text-gray-600 mb-6">
        Welcome to our platform! We are dedicated to bringing together passionate developers, designers, and innovators to collaborate and bring ideas to life. Whether you're working on a project, participating in a hackathon, or just exploring new technologies, our platform provides the tools and community to help you succeed.
      </p>
      <div className="text-gray-700 space-y-4">
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p>
          Our mission is to create a seamless experience for users to connect, collaborate, and build amazing things together. We want to foster a community of learners, creators, and problem solvers who are passionate about technology and innovation.
        </p>

        <h2 className="text-2xl font-semibold">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            A platform for creating and discovering exciting project ideas.
          </li>
          <li>
            A community-driven space for collaboration, feedback, and growth.
          </li>
          <li>
            Tools for easily finding projects, teams, and tech stacks.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">Our Values</h2>
        <p>
          At our core, we value collaboration, creativity, and inclusivity. We believe in supporting every individual, regardless of experience level, and providing an environment where ideas can flourish.
        </p>

        <h2 className="text-2xl font-semibold">Join Us!</h2>
        <p>
          Ready to take the next step? Whether you're here to start a project, join a team, or simply explore, we invite you to get involved and start making an impact!
        </p>
      </div>
    </div>
  );
};

export default About;