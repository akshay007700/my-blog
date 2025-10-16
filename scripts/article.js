// Article Page JavaScript
class ArticlePage {
    constructor() {
        this.articleId = this.getArticleIdFromURL();
        this.article = null;
        this.comments = [];
        this.init();
    }

    init() {
        this.loadArticle();
        this.loadComments();
        this.setupEventListeners();
        this.incrementViewCount();
    }

    getArticleIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    loadArticle() {
        if (!this.articleId) {
            this.showError('Article ID not found in URL');
            return;
        }

        // Try to load from localStorage first
        const savedArticles = localStorage.getItem('blogPosts');
        const articles = savedArticles ? JSON.parse(savedArticles) : [];
        
        this.article = articles.find(article => article.id === this.articleId);
        
        if (this.article) {
            this.renderArticle();
            this.loadRelatedArticles();
        } else {
            this.showError('Article not found');
        }
    }

    renderArticle() {
        if (!this.article) return;

        // Update page title
        document.title = `${this.article.title} - TechVerse`;

        // Update article header
        document.getElementById('articleTitle').textContent = this.article.title;
        document.getElementById('articleAuthor').textContent = this.article.author;
        document.getElementById('articleDate').textContent = this.article.date;
        document.getElementById('readTime').textContent = this.article.readTime;
        document.getElementById('viewCount').textContent = `${this.article.views || 0} views`;
        document.getElementById('articleCategory').textContent = this.article.category;
        
        // Update images
        const authorAvatar = document.getElementById('authorAvatar');
        const articleImage = document.getElementById('articleImage');
        
        if (authorAvatar) authorAvatar.src = this.article.authorAvatar;
        if (articleImage) articleImage.src = this.article.image;
        if (articleImage) articleImage.alt = this.article.title;

        // Update content
        const contentDiv = document.getElementById('articleContent');
        contentDiv.innerHTML = this.formatArticleContent(this.article.content);

        // Update likes
        document.getElementById('likeCount').textContent = this.article.likes || 0;

        // Update author bio
        this.renderAuthorBio();

        // Update tags
        this.renderTags();
    }

    formatArticleContent(content) {
        // Convert plain text to formatted HTML
        let formattedContent = content
            .split('\n')
            .map(paragraph => {
                if (paragraph.trim() === '') return '';
                
                // Check if it's a heading
                if (paragraph.startsWith('# ')) {
                    return `<h2>${paragraph.substring(2)}</h2>`;
                }
                if (paragraph.startsWith('## ')) {
                    return `<h3>${paragraph.substring(3)}</h3>`;
                }
                
                // Check if it's a list item
                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                    return `<li>${paragraph.substring(2)}</li>`;
                }
                
                // Regular paragraph
                return `<p>${paragraph}</p>`;
            })
            .join('');

        // Wrap list items in ul
        formattedContent = formattedContent.replace(/(<li>.*?<\/li>)+/gs, 
            match => `<ul>${match}</ul>`);

        return `<div class="article-content">${formattedContent}</div>`;
    }

    renderAuthorBio() {
        const authorBio = document.getElementById('authorBio');
        if (!authorBio) return;

        const bioContent = `
            <div class="flex items-start space-x-4">
                <img src="${this.article.authorAvatar}" alt="${this.article.author}" 
                     class="w-16 h-16 rounded-full">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${this.article.author}</h3>
                    <p class="text-gray-600 leading-relaxed">
                        Technology enthusiast and content creator passionate about sharing 
                        knowledge and insights with the developer community.
                    </p>
                    <div class="flex space-x-3 mt-3">
                        <a href="#" class="text-blue-500 hover:text-blue-700">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="text-blue-600 hover:text-blue-800">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="#" class="text-gray-800 hover:text-gray-900">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;

        authorBio.innerHTML = bioContent;
    }

    renderTags() {
        const tagsContainer = document.getElementById('articleTags');
        if (!tagsContainer) return;

        const tags = [
            this.article.category,
            'Technology',
            'Programming',
            'Web Development'
        ];

        tagsContainer.innerHTML = tags.map(tag => `
            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                #${tag}
            </span>
        `).join('');
    }

    loadRelatedArticles() {
        const container = document.getElementById('relatedArticles');
        if (!container) return;

        const savedArticles = localStorage.getItem('blogPosts');
        const articles = savedArticles ? JSON.parse(savedArticles) : [];
        
        // Filter related articles (same category, exclude current)
        const relatedArticles = articles
            .filter(article => 
                article.id !== this.articleId && 
                article.category === this.article.category
            )
            .slice(0, 3);

        if (relatedArticles.length === 0) {
            container.innerHTML = '<p class="text-gray-500 col-span-full text-center">No related articles found</p>';
            return;
        }

        container.innerHTML = relatedArticles.map(article => `
            <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                     onclick="window.location.href='article.html?id=${article.id}'">
                <img src="${article.image}" alt="${article.title}" 
                     class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">${article.title}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${article.excerpt}</p>
                    <div class="flex justify-between text-xs text-gray-500">
                        <span>${article.date}</span>
                        <span>${article.readTime}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }

    loadComments() {
        const savedComments = localStorage.getItem(`comments_${this.articleId}`);
        this.comments = savedComments ? JSON.parse(savedComments) : [];
        this.renderComments();
    }

    renderComments() {
        const container = document.getElementById('commentsList');
        const countElement = document.getElementById('commentCount');
        
        if (!container) return;

        if (this.comments.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-comments text-4xl mb-4"></i>
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            `;
            if (countElement) countElement.textContent = '(0)';
            return;
        }

        container.innerHTML = this.comments.map(comment => `
            <div class="comment">
                <div class="flex justify-between items-start mb-2">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
            </div>
        `).join('');

        if (countElement) countElement.textContent = `(${this.comments.length})`;
    }

    setupEventListeners() {
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        }
    }

    handleCommentSubmit(event) {
        event.preventDefault();
        
        const authorInput = document.getElementById('commentAuthor');
        const textInput = document.getElementById('commentText');
        
        const author = authorInput.value.trim();
        const text = textInput.value.trim();

        if (!author || !text) {
            alert('Please fill in both name and comment!');
            return;
        }

        const newComment = {
            id: 'comment-' + Date.now(),
            author: author,
            text: text,
            date: new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        this.comments.push(newComment);
        this.saveComments();
        this.renderComments();
        
        // Reset form
        textInput.value = '';
        
        this.showNotification('Comment posted successfully!', 'success');
    }

    saveComments() {
        localStorage.setItem(`comments_${this.articleId}`, JSON.stringify(this.comments));
    }

    incrementViewCount() {
        if (!this.article) return;

        // Initialize views if not exists
        if (!this.article.views) {
            this.article.views = 0;
        }

        // Increment view count
        this.article.views++;
        
        // Update in localStorage
        const savedArticles = localStorage.getItem('blogPosts');
        if (savedArticles) {
            const articles = JSON.parse(savedArticles);
            const articleIndex = articles.findIndex(article => article.id === this.articleId);
            if (articleIndex !== -1) {
                articles[articleIndex].views = this.article.views;
                localStorage.setItem('blogPosts', JSON.stringify(articles));
            }
        }

        // Update view count display
        const viewCountElement = document.getElementById('viewCount');
        if (viewCountElement) {
            viewCountElement.textContent = `${this.article.views} views`;
        }
    }

    showError(message) {
        const contentDiv = document.getElementById('articleContent');
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <a href="index.html" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Home
                    </a>
                </div>
            `;
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } z-50`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle mr-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions for buttons
function likeArticle() {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');
    
    let currentLikes = parseInt(likeCount.textContent) || 0;
    currentLikes++;
    
    likeCount.textContent = currentLikes;
    likeButton.innerHTML = '<i class="fas fa-heart text-red-500"></i><span>' + currentLikes + '</span>';
    
    // Save to localStorage
    const articlePage = window.articlePage;
    if (articlePage && articlePage.article) {
        articlePage.article.likes = currentLikes;
        
        const savedArticles = localStorage.getItem('blogPosts');
        if (savedArticles) {
            const articles = JSON.parse(savedArticles);
            const articleIndex = articles.findIndex(article => article.id === articlePage.articleId);
            if (articleIndex !== -1) {
                articles[articleIndex].likes = currentLikes;
                localStorage.setItem('blogPosts', JSON.stringify(articles));
            }
        }
    }
}

function shareArticle() {
    document.getElementById('shareModal').classList.remove('hidden');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.add('hidden');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function copyArticleLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => {
            alert('Article link copied to clipboard!');
            closeShareModal();
        })
        .catch(() => {
            alert('Failed to copy link');
        });
}

// Initialize article page
const articlePage = new ArticlePage();
window.articlePage = articlePage;