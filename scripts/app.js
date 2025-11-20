// Main Application JavaScript

// Global variables
let currentPosts = [];
let isDarkMode = false;

// Initialize application
function initializeApp() {
    loadPostsFromStorage();
    setupEventListeners();
    loadUserPreferences();
    initializeAutoSave();
    
    console.log('Advanced Blog App Initialized');
}

// Setup event listeners
function setupEventListeners() {
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    
    // Enter key to submit form
    document.getElementById('postContent').addEventListener('keypress', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            addNewPost();
        }
    });
    
    // Image upload preview
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            previewImage(this.files[0]);
        }
    });
}

// Load user preferences from localStorage
function loadUserPreferences() {
    const darkModePref = localStorage.getItem('darkMode');
    if (darkModePref === 'true') {
        enableDarkMode();
    }
}

// Initialize auto-save functionality
function initializeAutoSave() {
    setInterval(() => {
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        
        if (title || content) {
            saveDraft({ title, content });
        }
    }, 30000); // Auto-save every 30 seconds
}

// Open editor function
function openEditor() {
    document.getElementById('editorSection').classList.remove('hidden');
    document.getElementById('postTitle').focus();
}

// Close editor function
function closeEditor() {
    document.getElementById('editorSection').classList.add('hidden');
    clearEditor();
}

// Clear editor fields
function clearEditor() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('imageUpload').value = '';
    document.getElementById('postCategory').value = 'technology';
}

// Preview uploaded image
function previewImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // You can implement image preview here
        console.log('Image selected:', file.name);
    };
    reader.readAsDataURL(file);
}

// Load when document is ready
document.addEventListener('DOMContentLoaded', initializeApp);