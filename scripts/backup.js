// Auto Backup and Offline Support System

// Perform auto backup
function performAutoBackup() {
    const backupData = {
        posts: currentPosts,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    localStorage.setItem('blogBackup', JSON.stringify(backupData));
    console.log('Auto backup completed at:', new Date().toLocaleTimeString());
}

// Save draft
function saveDraft(draft) {
    const draftData = {
        ...draft,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('blogDraft', JSON.stringify(draftData));
}

// Load draft
function loadDraft() {
    const draft = localStorage.getItem('blogDraft');
    if (draft) {
        const draftData = JSON.parse(draft);
        document.getElementById('postTitle').value = draftData.title || '';
        document.getElementById('postContent').value = draftData.content || '';
        
        showNotification(`Draft loaded from ${new Date(draftData.savedAt).toLocaleTimeString()}`, 'success');
    }
}

// Export data
function exportData() {
    const data = {
        posts: currentPosts,
        exportDate: new Date().toISOString(),
        totalPosts: currentPosts.length
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `blog-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showSuccessNotification('Data exported successfully!');
}

// Import data
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (importedData.posts && Array.isArray(importedData.posts)) {
                currentPosts = importedData.posts;
                localStorage.setItem('blogPosts', JSON.stringify(currentPosts));
                renderPosts();
                showSuccessNotification(`Imported ${importedData.posts.length} posts successfully!`);
            } else {
                throw new Error('Invalid file format');
            }
        } catch (error) {
            showErrorNotification('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Sync offline data (when coming online)
function syncOfflineData() {
    // This would typically sync with a server
    console.log('Syncing offline data...');
    performAutoBackup();
}

// Initialize backup system
function initializeBackupSystem() {
    // Auto backup every 5 minutes
    setInterval(performAutoBackup, 300000);
    
    // Load any existing draft
    loadDraft();
}

// Additional utility functions
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        currentPosts = currentPosts.filter(post => post.id !== postId);
        localStorage.setItem('blogPosts', JSON.stringify(currentPosts));
        renderPosts();
        showSuccessNotification('Post deleted successfully!');
    }
}

function editPost(postId) {
    const post = currentPosts.find(p => p.id === postId);
    if (post) {
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
        document.getElementById('postCategory').value = post.category;
        openEditor();
        
        // Remove the post being edited
        currentPosts = currentPosts.filter(p => p.id !== postId);
        renderPosts();
    }
}

// Initialize when app starts
document.addEventListener('DOMContentLoaded', initializeBackupSystem);