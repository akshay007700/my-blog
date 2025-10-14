import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TechVerse
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Blog', 'Categories', 'About'].map((item) => (
              <motion.a
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                whileHover={{ y: -2 }}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* Search & Menu */}
          <div className="flex items-center space-x-4">
            <motion.button whileHover={{ scale: 1.05 }} className="p-2">
              <Search className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-4">
                {['Home', 'Blog', 'Categories', 'About'].map((item) => (
                  <a
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header