import { generateText } from '@rork-ai/toolkit-sdk';
import { NewsCategory } from '@/types/news';

export interface TrendingTopic {
  id: string;
  title: string;
  category: NewsCategory;
  description: string;
  detectedAt: string;
}

export interface GeneratedNewsContent {
  title: string;
  description: string;
  content: string;
  tags: string[];
  imageUrl: string;
}

export async function detectTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    console.log('Detecting trending topics...');
    
    const prompt = `You are a news trend detector. Identify 3-5 current trending news topics across different categories (National, International, Sports, Tech, Entertainment, Business, Health).
    
Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "Brief topic title",
    "category": "Tech",
    "description": "One sentence describing why this is trending"
  }
]

Categories must be one of: National, International, Sports, Tech, Entertainment, Business, Health
Focus on real, current events and trends.`;

    const response = await generateText(prompt);
    
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON array found in AI response');
      return [];
    }
    
    const topics = JSON.parse(jsonMatch[0]);
    
    return topics.map((topic: any, index: number) => ({
      id: `trending_${Date.now()}_${index}`,
      title: topic.title,
      category: topic.category as NewsCategory,
      description: topic.description,
      detectedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error detecting trending topics:', error);
    return [];
  }
}

export async function generateNewsFromTopic(
  topic: TrendingTopic,
  author: string,
  source: string
): Promise<GeneratedNewsContent> {
  try {
    console.log('Generating news content for topic:', topic.title);
    
    const prompt = `You are a professional news writer. Write a complete news article about: "${topic.title}"
    
Category: ${topic.category}
Context: ${topic.description}

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Engaging news headline",
  "description": "2-3 sentence summary",
  "content": "Full article content (3-4 paragraphs, detailed and informative)",
  "tags": ["tag1", "tag2", "tag3"]
}

Write professionally, factually, and engagingly. Include relevant details and context.`;

    const response = await generateText(prompt);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }
    
    const content = JSON.parse(jsonMatch[0]);
    
    const imageUrl = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80`;
    
    return {
      title: content.title,
      description: content.description,
      content: content.content,
      tags: content.tags || [],
      imageUrl,
    };
  } catch (error) {
    console.error('Error generating news content:', error);
    throw error;
  }
}
