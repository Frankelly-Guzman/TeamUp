import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import LandingPage from './Pages/LandingPage'
import CreatePost from './Pages/CreatePost'
import PostsPage from './Pages/PostsPage'
import PostSoloPage from './Pages/PostSoloPage'
import NotFoundPage from './Pages/NotFoundPage'
import Contact from './Pages/Contact'
import About from './Pages/About'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path ="/" element={<LandingPage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostSoloPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App