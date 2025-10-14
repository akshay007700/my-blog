// Real-time Notification System

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // Set message and type
    notificationText.textContent = message;
    
    // Remove all type classes
    notification.classList.remove('notification-success', 'notification-error', 'notification-warning');
    
    // Add appropriate type class
    notification.classList.add(`notification-${type}`);
    
    // Show notification
    notification.classList.remove('notification-hidden');
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        hideNotification();
    }, 4000);
    
    // Log notification
    console.log(`Notification [${type}]: ${message}`);
}

// Hide notification
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('notification-hidden');
}

// Show loading notification
function showLoadingNotification(message) {
    showNotification(`⏳ ${message}`, 'warning');
}

// Show success notification
function showSuccessNotification(message) {
    showNotification(`✅ ${message}`, 'success');
}

// Show error notification
function showErrorNotification(message) {
    showNotification(`❌ ${message}`, 'error');
}

// Network status notifications
function setupNetworkNotifications() {
    window.addEventListener('online', () => {
        showSuccessNotification('Connection restored! Syncing data...');
        syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
        showErrorNotification('You are offline. Changes will be saved locally.');
    });
}

// Initialize network monitoring
document.addEventListener('DOMContentLoaded', setupNetworkNotifications);