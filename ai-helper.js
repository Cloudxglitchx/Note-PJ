// AI Helper using Google Gemini API
// Free tier: https://ai.google.dev/

export class AIHelper {
  constructor() {
    this.apiKey = localStorage.getItem('gemini_api_key') || '';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  // Check if API key is set
  hasApiKey() {
    return this.apiKey.length > 0;
  }

  // Set API key
  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
  }

  // Clear API key
  clearApiKey() {
    this.apiKey = '';
    localStorage.removeItem('gemini_api_key');
  }

  // Make API request to Gemini
  async makeRequest(prompt) {
    if (!this.hasApiKey()) {
      throw new Error('API key not set. Please add your Google Gemini API key in settings.');
    }

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('AI request error:', error);
      throw error;
    }
  }

  // Summarize note content
  async summarizeNote(title, content) {
    const prompt = `Summarize the following student note in 2-3 concise sentences. Focus on the main points and key takeaways.

Title: ${title}

Content:
${content}

Provide a clear, helpful summary:`;

    return await this.makeRequest(prompt);
  }

  // Generate quiz questions
  async generateQuiz(title, content, numQuestions = 5) {
    const prompt = `Based on the following student note, create ${numQuestions} multiple-choice quiz questions to test understanding. Format each question with 4 options (A, B, C, D) and indicate the correct answer.

Title: ${title}

Content:
${content}

Generate ${numQuestions} quiz questions in this format:
Q1: [Question]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [Letter]

Q2: ...`;

    return await this.makeRequest(prompt);
  }

  // Suggest tags
  async suggestTags(title, content) {
    const prompt = `Based on the following note, suggest 3-5 relevant tags or keywords that would help categorize and find this content. Return only the tags separated by commas.

Title: ${title}

Content:
${content}

Tags (comma-separated):`;

    const response = await this.makeRequest(prompt);
    return response.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  // Generate study tips
  async generateStudyTips(title, content) {
    const prompt = `Based on the following student note, provide 3-5 specific study tips or recommendations to help master this material. Be practical and actionable.

Title: ${title}

Content:
${content}

Study Tips:`;

    return await this.makeRequest(prompt);
  }

  // Extract key points
  async extractKeyPoints(content) {
    const prompt = `Extract the 5 most important key points from the following note content. Format as a bulleted list.

Content:
${content}

Key Points:`;

    return await this.makeRequest(prompt);
  }

  // Explain concept
  async explainConcept(concept, context = '') {
    const prompt = `Explain the concept of "${concept}" in simple terms that a student can understand. ${context ? `Context: ${context}` : ''}

Provide a clear, concise explanation:`;

    return await this.makeRequest(prompt);
  }

  // Chat with note - ask questions about the content
  async chatWithNote(question, noteTitle, noteContent, chatHistory = []) {
    let historyText = '';
    if (chatHistory.length > 0) {
      historyText = '\n\nPrevious conversation:\n' + 
        chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    }

    const prompt = `You are a helpful study assistant. A student is reading a note and has a question about it.

Note Title: ${noteTitle}

Note Content:
${noteContent}
${historyText}

Student's Question: ${question}

Provide a clear, helpful answer based on the note content. If the question cannot be answered from the note, politely say so and offer to help in another way.

Answer:`;

    return await this.makeRequest(prompt);
  }
}
