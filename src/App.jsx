import React from 'react'

function App() {
  const blogPosts = [
    {
      id: 1,
      title: "Artificial Intelligence Ka Future",
      excerpt: "AI technology kyun badal rahi hai duniya, janiye is post mein",
      category: "Technology",
      date: "March 20, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
    },
    {
      id: 2,
      title: "React.js Seekhein Step-by-Step",
      excerpt: "Beginner se expert tak, React.js ka complete guide",
      category: "Programming",
      date: "March 18, 2024", 
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Cloud Computing Complete Guide",
      excerpt: "Cloud kya hai aur kaise use karein apne business mein",
      category: "Cloud",
      date: "March 15, 2024",
      readTime: "6 min read", 
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <h1 className="text-2xl font-bold text-gray-800">TechVerse</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blog</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Categories</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            </nav>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
          Welcome to
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
            TechVerse
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover the latest in technology, programming, and digital innovation. 
          Stay ahead with our expert insights and tutorials.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
            Read Blog
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
            Learn More
          </button>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Latest Blog Posts</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Explore our collection of insightful articles on technology, programming, and digital trends.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                
                <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter and get the latest tech news delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
            />
            <button className="bg-blue-500 px-6 py-3 rounded-r-lg hover:bg-blue-600 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold">TechVerse</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Latest technology insights, tutorials, and news. Stay updated with the rapidly evolving tech world.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI & ML</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile Apps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cloud Computing</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechVerse. All rights reserved. Made with ❤️ for the tech community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App