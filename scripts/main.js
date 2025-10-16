// Main Application JavaScript
class TechVerseApp {
    constructor() {
        this.currentUser = null;
        this.articles = [];
        this.isDarkMode = false;
        this.init();
    }

    init() {
        this.loadArticles();
        this.setupEventListeners();
        this.checkAuth();
        this.setupServiceWorker();
        
        console.log('TechVerse App Initialized');
    }

    setupEventListeners() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Newsletter form
        const newsletterForm = document.querySelector('form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup();
            });
        }

        // Intersection Observer for animations
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.blog-card, .featured-post').forEach(el => {
            observer.observe(el);
        });
    }

    async loadArticles() {
        try {
            // Load from localStorage first
            const savedArticles = localStorage.getItem('techverse_articles');
            if (savedArticles) {
                this.articles = JSON.parse(savedArticles);
            } else {
                // Load from JSON file
                const response = await fetch('./data/articles.json');
                this.articles = await response.json();
                this.saveArticles();
            }
            this.renderArticles();
        } catch (error) {
            console.error('Error loading articles:', error);
            this.articles = this.getDefaultArticles();
            this.renderArticles();
        }
    }

    saveArticles() {
        localStorage.setItem('techverse_articles', JSON.stringify(this.articles));
    }

    renderArticles() {
        const container = document.getElementById('blogPosts');
        if (!container) return;

        if (this.articles.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        container.innerHTML = this.articles.map(article => `
            <article class="blog-card bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer" 
                     onclick="app.openArticle('${article.id}')">
                <div class="relative overflow-hidden">
                    <img src="${article.image}" alt="${article.title}" 
                         class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute top-4 left-4">
                        <span class="bg-${article.categoryColor}-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            ${article.category}
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-${article.categoryColor}-600 transition-colors">
                        ${article.title}
                    </h3>
                    <p class="text-gray-600 mb-4 leading-relaxed">
                        ${article.excerpt}
                    </p>
                    <div class="flex items-center justify-between text-sm text-gray-500">
                        <div class="flex items-center space-x-2">
                            <img src="${article.authorAvatar}" alt="${article.author}" 
                                 class="w-6 h-6 rounded-full">
                            <span>${article.author}</span>
                        </div>
                        <span>${article.date}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }

    openArticle(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (article) {
            // Open in modal or new page based on screen size
            if (window.innerWidth > 768) {
                this.openArticleModal(article);
            } else {
                window.open(`article.html?id=${articleId}`, '_self');
            }
        }
    }

    openArticleModal(article) {
        // Modal implementation would go here
        console.log('Opening article:', article.title);
    }

    handleNewsletterSignup() {
        const emailInput = document.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (this.validateEmail(email)) {
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
            
            // Save to localStorage
            this.saveSubscriber(email);
        } else {
            this.showNotification('Please enter a valid email address.', 'error');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    saveSubscriber(email) {
        const subscribers = JSON.parse(localStorage.getItem('techverse_subscribers') || '[]');
        subscribers.push({ email, date: new Date().toISOString() });
        localStorage.setItem('techverse_subscribers', JSON.stringify(subscribers));
    }

    showNotification(message, type = 'success') {
        // Notification implementation
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    checkAuth() {
        const user = localStorage.getItem('techverse_user');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('SW registered'))
                .catch(error => console.log('SW registration failed'));
        }
    }

    getDefaultArticles() {
        return [
            {
                id: 'ai-future',
                title: 'The Future of AI in 2024',
                excerpt: 'Explore how artificial intelligence is reshaping industries and creating new opportunities.',
                content: 'Full article content...',
                category: 'AI',
                categoryColor: 'purple',
                author: 'Dr. Sarah Chen',
                authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
                date: 'March 20, 2024',
                readTime: '8 min read'
            }
        ];
    }

    getEmptyStateHTML() {
        return `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600">No articles yet</h3>
                <p class="text-gray-500">Check back later for amazing content!</p>
            </div>
        `;
    }
}

// Initialize app
const app = new TechVerseApp();