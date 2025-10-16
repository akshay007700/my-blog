// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.currentArticle = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadStats();
    }

    checkAuthentication() {
        const adminToken = localStorage.getItem('techverse_admin_token');
        if (adminToken && this.validateToken(adminToken)) {
            this.isAuthenticated = true;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    validateToken(token) {
        // Simple token validation
        return token === btoa('admin:' + new Date().toISOString().split('T')[0]);
    }

    showLogin() {
        document.body.innerHTML = `
            <div class="admin-login">
                <form class="admin-form" onsubmit="admin.handleLogin(event)">
                    <h2 class="text-2xl font-bold text-center mb-6">Admin Login</h2>
                    <input type="password" id="adminPassword" 
                           placeholder="Enter admin password" 
                           class="w-full p-3 border rounded-lg mb-4" required>
                    <button type="submit" class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                        Login
                    </button>
                </form>
            </div>
        `;
    }

    handleLogin(event) {
        event.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === 'admin123') { // Default password
            const token = btoa('admin:' + new Date().toISOString().split('T')[0]);
            localStorage.setItem('techverse_admin_token', token);
            this.isAuthenticated = true;
            this.showDashboard();
        } else {
            alert('Invalid password!');
        }
    }

    showDashboard() {
        document.body.innerHTML = `
            <div class="admin-dashboard">
                <nav class="bg-white shadow-sm border-b">
                    <div class="container mx-auto px-4 py-3">
                        <div class="flex justify-between items-center">
                            <h1 class="text-xl font-bold">Admin Dashboard</h1>
                            <button onclick="admin.logout()" class="text-red-500 hover:text-red-700">
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <div class="container mx-auto px-4 py-6">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number" id="totalArticles">0</div>
                            <div class="text-gray-600">Total Articles</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="totalViews">0</div>
                            <div class="text-gray-600">Total Views</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="subscribers">0</div>
                            <div class="text-gray-600">Subscribers</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <div class="post-editor">
                                <h3 class="text-lg font-bold mb-4">Create New Article</h3>
                                <form onsubmit="admin.handleArticleSubmit(event)">
                                    <input type="text" id="articleTitle" placeholder="Article Title" 
                                           class="w-full p-3 border rounded-lg mb-4" required>
                                    <textarea id="articleContent" placeholder="Article Content" 
                                              class="w-full p-3 border rounded-lg h-40 mb-4" required></textarea>
                                    <select id="articleCategory" class="w-full p-3 border rounded-lg mb-4">
                                        <option value="technology">Technology</option>
                                        <option value="ai">AI & ML</option>
                                        <option value="web">Web Development</option>
                                        <option value="security">Cybersecurity</option>
                                    </select>
                                    <input type="file" id="articleImage" accept="image/*" class="w-full p-3 border rounded-lg mb-4">
                                    <button type="submit" class="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
                                        Publish Article
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div>
                            <div class="post-editor">
                                <h3 class="text-lg font-bold mb-4">Recent Articles</h3>
                                <div id="recentArticles">
                                    <!-- Recent articles will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadRecentArticles();
    }

    loadStats() {
        const articles = JSON.parse(localStorage.getItem('techverse_articles') || '[]');
        const subscribers = JSON.parse(localStorage.getItem('techverse_subscribers') || '[]');
        
        document.getElementById('totalArticles').textContent = articles.length;
        document.getElementById('subscribers').textContent = subscribers.length;
        
        // Calculate total views
        const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
        document.getElementById('totalViews').textContent = totalViews;
    }

    loadRecentArticles() {
        const articles = JSON.parse(localStorage.getItem('techverse_articles') || '[]');
        const recentArticles = articles.slice(0, 5);
        
        const container = document.getElementById('recentArticles');
        if (recentArticles.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No articles yet</p>';
            return;
        }

        container.innerHTML = recentArticles.map(article => `
            <div class="border-b border-gray-200 py-3">
                <h4 class="font-semibold">${article.title}</h4>
                <div class="flex justify-between text-sm text-gray-500">
                    <span>${article.date}</span>
                    <button onclick="admin.deleteArticle('${article.id}')" class="text-red-500 hover:text-red-700">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    handleArticleSubmit(event) {
        event.preventDefault();
        
        const title = document.getElementById('articleTitle').value;
        const content = document.getElementById('articleContent').value;
        const category = document.getElementById('articleCategory').value;
        const imageFile = document.getElementById('articleImage').files[0];

        if (!title || !content) {
            alert('Please fill in all fields!');
            return;
        }

        const newArticle = {
            id: 'article-' + Date.now(),
            title: title,
            content: content,
            excerpt: content.substring(0, 150) + '...',
            category: category,
            categoryColor: this.getCategoryColor(category),
            author: 'Admin',
            authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            image: imageFile ? URL.createObjectURL(imageFile) : this.getDefaultImage(category),
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            readTime: this.calculateReadTime(content),
            views: 0
        };

        this.saveArticle(newArticle);
        this.resetForm();
        this.loadStats();
        this.loadRecentArticles();
        
        alert('Article published successfully!');
    }

    saveArticle(article) {
        const articles = JSON.parse(localStorage.getItem('techverse_articles') || '[]');
        articles.unshift(article);
        localStorage.setItem('techverse_articles', JSON.stringify(articles));
    }

    deleteArticle(articleId) {
        if (confirm('Are you sure you want to delete this article?')) {
            let articles = JSON.parse(localStorage.getItem('techverse_articles') || '[]');
            articles = articles.filter(article => article.id !== articleId);
            localStorage.setItem('techverse_articles', JSON.stringify(articles));
            this.loadStats();
            this.loadRecentArticles();
            alert('Article deleted successfully!');
        }
    }

    getCategoryColor(category) {
        const colors = {
            'technology': 'blue',
            'ai': 'purple',
            'web': 'green',
            'security': 'red'
        };
        return colors[category] || 'blue';
    }

    getDefaultImage(category) {
        const images = {
            'technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop',
            'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
            'web': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
            'security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop'
        };
        return images[category] || images.technology;
    }

    calculateReadTime(content) {
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    }

    resetForm() {
        document.getElementById('articleTitle').value = '';
        document.getElementById('articleContent').value = '';
        document.getElementById('articleImage').value = '';
    }

    logout() {
        localStorage.removeItem('techverse_admin_token');
        this.isAuthenticated = false;
        this.showLogin();
    }
}

// Initialize admin panel
const admin = new AdminPanel();