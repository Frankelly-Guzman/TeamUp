import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import LandingPage from './Pages/LandingPage';
import CreatePost from './Pages/CreatePost';
import PostsPage from './Pages/PostsPage';
import PostSoloPage from './Pages/PostSoloPage';
import NotFoundPage from './Pages/NotFoundPage';
import Contact from './Pages/Contact';
import About from './Pages/About';
import ProfileManagement from './Pages/ProfileManagement';
import ProfileRedirect from './Components/ProfileRedirect';
import Profile from './Pages/Profile';
import EditPost from './Pages/EditPost';
import UserPolicy from './Pages/UserPolicy';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <ProfileRedirect /> {/* Add ProfileRedirect here */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostSoloPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile-management" element={<ProfileManagement />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/user-policy" element={<UserPolicy />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;