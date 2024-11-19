import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full bg-black text-white py-4 px-4'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        {/* Left section */}
        <div className='text-sm'>
          &copy; {new Date().getFullYear()} TeamUp. All rights reserved.
        </div>

        {/* Right section */}
        <div className='flex gap-4'>
          <a href='/about' className='hover:text-gray-400 transition-all duration-300'>About</a>
          <a href='/contact' className='hover:text-gray-400 transition-all duration-300'>Contact</a>
          <a href='/privacy' className='hover:text-gray-400 transition-all duration-300'>Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer