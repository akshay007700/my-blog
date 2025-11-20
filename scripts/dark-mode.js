// Dark/Light Mode Toggle System

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
    
    // Show notification
    showNotification(`${isDarkMode ? 'Dark' : 'Light'} mode activated`, 'success');
}

// Enable dark mode
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('bg-gray-50');
    document.body.classList.add('bg-gray-900');
    
    // Update toggle button
    const toggleBtn = document.getElementById('darkModeToggle');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    toggleBtn.classList.remove('bg-gray-200');
    toggleBtn.classList.add('bg-yellow-500', 'text-white');
    
    isDarkMode = true;
}

// Disable dark mode
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('bg-gray-900');
    document.body.classList.add('bg-gray-50');
    
    // Update toggle button
    const toggleBtn = document.getElementById('darkModeToggle');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toggleBtn.classList.remove('bg-yellow-500', 'text-white');
    toggleBtn.classList.add('bg-gray-200');
    
    isDarkMode = false;
}

// Detect system preference
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode();
    }
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme === 'true') {
        enableDarkMode();
    } else if (savedTheme === null) {
        detectSystemTheme();
    }
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('darkMode')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeTheme);