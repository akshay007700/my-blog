import React from 'react'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-gray-900 text-white mt-20"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">TechVerse</span>
            </motion.div>
            <p className="text-gray-400 max-w-md">
              Latest technology insights, tutorials, and news. Stay updated with the rapidly evolving tech world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {['Home', 'Blog', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              {['Web Development', 'AI & Machine Learning', 'Mobile Apps', 'Cloud Computing'].map((category) => (
                <li key={category}>
                  <a href="#" className="hover:text-white transition-colors">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TechVerse. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer