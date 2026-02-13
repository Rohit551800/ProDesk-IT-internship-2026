// server.js - Backend for Level 2 and Level 3
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize Gemini AI
// IMPORTANT: Make sure to set GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        apiKeyConfigured: !!process.env.GEMINI_API_KEY 
    });
});

// Main endpoint for generating cover letters
app.post('/api/generate-letter', async (req, res) => {
    try {
        const { name, role, company, skills, jobDescription, resumeText, level } = req.body;

        // Validate API key
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ 
                error: 'API key not configured. Please set GEMINI_API_KEY in your .env file.' 
            });
        }

        let prompt;
        
        if (level === 2) {
            // Level 2: Basic AI generation
            prompt = createLevel2Prompt(name, role, company, skills, jobDescription);
        } else if (level === 3) {
            // Level 3: AI with resume context
            prompt = createLevel3Prompt(name, role, company, skills, jobDescription, resumeText);
        } else {
            return res.status(400).json({ error: 'Invalid level specified' });
        }

        // Call Gemini AI
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const coverLetter = response.text();

        // Format the response properly
        const formattedLetter = formatCoverLetter(coverLetter, name);

        res.json({ 
            coverLetter: formattedLetter,
            level: level,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error generating cover letter:', error);
        
        // Provide helpful error messages
        if (error.message?.includes('API key')) {
            res.status(500).json({ 
                error: 'Invalid API key. Please check your GEMINI_API_KEY in the .env file.' 
            });
        } else if (error.message?.includes('quota')) {
            res.status(429).json({ 
                error: 'API quota exceeded. Please try again later or check your Google AI Studio limits.' 
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to generate cover letter. Please try again.',
                details: error.message 
            });
        }
    }
});

// Create prompt for Level 2
function createLevel2Prompt(name, role, company, skills, jobDescription) {
    return `You are a professional cover letter writer. Generate a compelling, personalized cover letter with the following details:

Candidate Name: ${name}
Job Role: ${role}
Company Name: ${company}
Key Skills: ${skills}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Requirements:
1. Write in a professional, engaging tone
2. Highlight how the candidate's skills match the role
3. Show genuine interest in the company
4. Keep it concise (3-4 paragraphs)
5. Use proper business letter format
6. Make it personalized and unique (avoid generic templates)
${jobDescription ? '7. Reference specific requirements from the job description' : ''}

Format the letter with:
- Proper header with candidate's contact info placeholder
- Date
- Company address placeholder
- Professional greeting
- 3-4 well-structured body paragraphs
- Professional closing

Do not include any markdown formatting, asterisks, or special characters. Just plain text with proper line breaks.`;
}

// Create prompt for Level 3
function createLevel3Prompt(name, role, company, skills, jobDescription, resumeText) {
    return `You are an expert cover letter writer with access to the candidate's resume. Generate an exceptional, highly personalized cover letter.

Candidate Name: ${name}
Target Role: ${role}
Target Company: ${company}
Key Skills: ${skills}
${jobDescription ? `Job Description:\n${jobDescription}` : ''}

Resume Content:
${resumeText}

Requirements:
1. Analyze the resume to find the MOST RELEVANT experiences
2. Match specific resume achievements to job requirements
3. Use concrete examples from the candidate's background
4. Show deep understanding of both the role and candidate's qualifications
5. Demonstrate how past experiences prepare them for THIS specific role
6. Keep it professional yet engaging (3-4 paragraphs)
7. Use proper business letter format
8. Make every sentence count - no filler or generic statements

Format the letter with:
- Proper header with candidate's contact info placeholder
- Date
- Company address placeholder
- Professional greeting
- 3-4 well-structured, highly personalized body paragraphs
- Professional closing

The letter should feel like it was written BY the candidate ABOUT their specific experiences FOR this specific role.

Do not include any markdown formatting, asterisks, or special characters. Just plain text with proper line breaks.`;
}

// Format the AI response into a proper cover letter
function formatCoverLetter(text, name) {
    // Clean up any markdown or special formatting
    let formatted = text
        .replace(/\*\*/g, '')  // Remove bold markdown
        .replace(/\*/g, '')     // Remove italics markdown
        .replace(/#{1,6}\s/g, '') // Remove headers
        .trim();

    // Ensure proper spacing between paragraphs
    formatted = formatted
        .split('\n\n')
        .map(para => para.trim())
        .filter(para => para.length > 0)
        .join('\n\n');

    // Add date if not present
    if (!formatted.includes(new Date().getFullYear().toString())) {
        const today = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        formatted = `${today}\n\n${formatted}`;
    }

    return formatted;
}

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 AI Cover Letter Generator`);
    console.log(`✅ API Key Configured: ${!!process.env.GEMINI_API_KEY}`);
    console.log(`\n💡 Visit http://localhost:${PORT} to use the app`);
    
    if (!process.env.GEMINI_API_KEY) {
        console.log('\n⚠️  WARNING: GEMINI_API_KEY not found in .env file!');
        console.log('   Level 2 and Level 3 will not work until you add your API key.');
        console.log('   Get your free API key from: https://makersuite.google.com/app/apikey');
    }
});

// Error handling
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});