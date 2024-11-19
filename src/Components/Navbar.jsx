import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='relative'>
      <div className='w-full bg-black py-4 shadow-lg'>
        <div className='max-w-6xl mx-auto flex justify-between items-center px-4'>
          {/* Logo Section */}
          <div className='text-white text-2xl font-bold'>TeamUp</div>

          {/* Navigation Links */}
          <div className='flex gap-6'>
            <Link to='/' className='text-white hover:text-gray-300 transition-all duration-300'>Home</Link>
            <Link to='/posts' className='text-white hover:text-gray-300 transition-all duration-300'>Posts</Link>
            <Link to='/create-post' className='text-white hover:text-gray-300 transition-all duration-300'>Create Post</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar