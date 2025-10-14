import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User, Clock } from 'lucide-react'
import { blogPosts } from '../data/blogData'

const Home = () => {
  const featuredPost = blogPosts[0]
  const recentPosts = blogPosts.slice(1, 7)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tech Insights
          </span>
          <br />
          <span className="text-4xl md:text-6xl text-gray-800">For The Modern World</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Discover the latest in technology, programming, and digital innovation. 
          Stay ahead with our expert insights and tutorials.
        </motion.p>
      </motion.section>

      {/* Featured Post */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Featured Post</h2>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
        >
          <div className="md:flex">
            <div className="md:w-2/3 p-8">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                {featuredPost.category}
              </span>
              <h3 className="text-3xl font-bold mb-4 text-gray-800">{featuredPost.title}</h3>
              <p className="text-gray-600 mb-6 text-lg">{featuredPost.excerpt}</p>
              
              <div className="flex items-center space-x-6 text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              
              <motion.a 
                href={`/post/${featuredPost.id}`}
                whileHover={{ x: 5 }}
                className="inline-flex items-center space-x-2 text-blue-600 font-semibold"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
            <div className="md:w-1/3">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Recent Posts Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default Home