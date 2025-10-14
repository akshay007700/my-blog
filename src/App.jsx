import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Mera Blog</h1>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Blog</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to My
          <span className="text-blue-600"> Advanced Blog</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Yaha aap amazing content padhenge aur share kar sakte hain
        </p>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Recent Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blog Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop" 
              alt="AI Technology"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">Technology</span>
              <h3 className="text-xl font-bold mt-3 mb-2">Artificial Intelligence Future</h3>
              <p className="text-gray-600 mb-4">AI ka future kya hoga? Jaaniye is post mein...</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>March 20, 2024</span>
                <span>5 min read</span>
              </div>
            </div>
          </div>

          {/* Blog Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop" 
              alt="Web Development"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">Programming</span>
              <h3 className="text-xl font-bold mt-3 mb-2">React.js Sikhein</h3>
              <p className="text-gray-600 mb-4">Step-by-step React.js seekhein beginner se expert tak...</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>March 18, 2024</span>
                <span>8 min read</span>
              </div>
            </div>
          </div>

          {/* Blog Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop" 
              alt="Cloud Computing"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">Cloud</span>
              <h3 className="text-xl font-bold mt-3 mb-2">Cloud Computing Guide</h3>
              <p className="text-gray-600 mb-4">Cloud computing kya hai aur kaise use karein...</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>March 15, 2024</span>
                <span>6 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Mera Blog. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Made with ❤️ using React</p>
        </div>
      </footer>
    </div>
  )
}

export default App