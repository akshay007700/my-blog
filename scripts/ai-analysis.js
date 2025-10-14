// AI Content Analysis System

// Analyze content sentiment
function analyzeContentSentiment(content) {
    const positiveWords = [
        'good', 'great', 'awesome', 'excellent', 'amazing', 'wonderful',
        'fantastic', 'perfect', 'nice', 'love', 'happy', 'joy', 'best',
        'better', 'beautiful', 'brilliant', 'outstanding', 'superb'
    ];
    
    const negativeWords = [
        'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate',
        'angry', 'sad', 'disappointing', 'poor', 'ugly', 'stupid',
        'useless', 'waste', 'boring', 'annoying', 'hate'
    ];
    
    const words = content.toLowerCase().split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
}

// Analyze content complexity
function analyzeContentComplexity(content) {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length - 1;
    const avgSentenceLength = words / sentences;
    
    if (avgSentenceLength > 20) return 'complex';
    if (avgSentenceLength > 15) return 'moderate';
    return 'simple';
}

// Extract keywords from content
function extractKeywords(content) {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = content.toLowerCase().split(/\s+/);
    
    const wordFrequency = {};
    words.forEach(word => {
        if (word.length > 3 && !commonWords.includes(word)) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
    });
    
    // Get top 5 keywords
    return Object.entries(wordFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);
}

// Content quality score
function calculateContentQuality(content) {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length - 1;
    
    if (words < 50) return 3; // Too short
    if (words > 1000) return 8; // Comprehensive
    if (words > 500) return 9; // Detailed
    return 7; // Good
}