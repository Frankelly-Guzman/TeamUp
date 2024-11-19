import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
      <img 
          src="https://w7.pngwing.com/pngs/982/865/png-transparent-sad-emoji-emoji-sad-face-sad-line-diagram-image-vector-image-sad-face-transparent-background-line-diagram-free-stock-images.png" 
          alt="Not found" 
          className="mx-auto mb-6 size-40"
        />
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Oops! The page you're looking for doesn't exist.</p>
        
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage