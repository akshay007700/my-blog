// Smart Auto-Upload System

function addNewPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const category = document.getElementById('postCategory').value;
    const imageFile = document.getElementById('imageUpload').files[0];
    
    // Validation
    if (!title || !content) {
        showNotification('Please fill in both title and content!', 'error');
        return;
    }
    
    // AI Content Analysis
    const sentiment = analyzeContentSentiment(content);
    const readTime = calculateReadTime(content);
    
    // Create post object
    const post = {
        id: Date.now(),
        title: title,
        content: content,
        category: category,
        sentiment: sentiment,
        readTime: readTime,
        date: new Date().toLocaleString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        image: imageFile ? URL.createObjectURL(imageFile) : getDefaultImage(category)
    };
    
    // Save post
    savePost(post);
    
    // Show success message
    showNotification(`"${title}" published successfully!`, 'success');
    
    // Close editor and clear form
    closeEditor();
}

// Save post to storage
function savePost(post) {
    // Add to current posts array
    currentPosts.unshift(post);
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(currentPosts));
    
    // Update UI
    renderPosts();
    
    // Auto backup
    performAutoBackup();
}

// Render posts to the grid
function renderPosts() {
    const blogPostsContainer = document.getElementById('blogPosts');
    
    if (currentPosts.length === 0) {
        blogPostsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600">No posts yet</h3>
                <p class="text-gray-500">Create your first post to get started!</p>
            </div>
        `;
        return;
    }
    
    blogPostsContainer.innerHTML = currentPosts.map(post => `
        <div class="blog-card bg-white rounded-lg shadow-md overflow-hidden">
            <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                        ${post.category}
                    </span>
                    <span class="text-xs text-gray-500">${post.readTime}</span>
                </div>
                <h3 class="text-xl font-bold mb-2 text-gray-800">${post.title}</h3>
                <p class="text-gray-600 mb-4 text-sm leading-relaxed">
                    ${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}
                </p>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>${post.date}</span>
                    <div class="flex space-x-2">
                        <button onclick="editPost(${post.id})" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deletePost(${post.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${post.sentiment !== 'neutral' ? `
                    <div class="mt-2 text-xs ${post.sentiment === 'positive' ? 'text-green-600' : 'text-red-600'}">
                        <i class="fas fa-${post.sentiment === 'positive' ? 'smile' : 'frown'} mr-1"></i>
                        ${post.sentiment} sentiment
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Load posts from storage
function loadPostsFromStorage() {
    const savedPosts = localStorage.getItem('blogPosts');
    currentPosts = savedPosts ? JSON.parse(savedPosts) : [];
    renderPosts();
}

// Calculate read time
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Get default image based on category
function getDefaultImage(category) {
    const images = {
        technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop',
        programming: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop',
        lifestyle: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
        education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=300&fit=crop'
    };
    return images[category] || images.technology;
}