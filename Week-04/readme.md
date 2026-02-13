# 🤖 AI Cover Letter Generator

A modern, multi-level web application that generates professional cover letters using AI. Built for **Mission 4: AI Integration**.

![Project Banner](https://via.placeholder.com/800x200/6366f1/ffffff?text=AI+Cover+Letter+Generator)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [How to Run](#how-to-run)
- [Difficulty Levels](#difficulty-levels)
- [API Key Setup](#api-key-setup)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#screenshots)

---

## ✨ Features

### Level 1: Template Mode ✅
- Professional cover letter templates
- Dynamic data insertion
- No API required
- Perfect for learning the UI

### Level 2: AI-Powered 🤖
- Real AI integration (Google Gemini)
- Personalized content generation
- Secure API key management with `.env`
- Loading states and error handling
- 2-5 second generation time

### Level 3: SaaS Mode 🚀
- PDF resume upload and parsing
- Highly personalized cover letters
- AI analyzes resume content
- Matches skills to job descriptions
- Production-ready features

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern, responsive design
- **Vanilla JavaScript** - No framework dependencies

### Backend (Levels 2 & 3)
- **Node.js** - Runtime environment
- **Express.js** - Web server
- **Google Gemini API** - AI text generation
- **pdf-parse** - PDF text extraction
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
ai-cover-letter-generator/
├── index.html          # Main UI
├── styles.css          # Styling
├── script.js           # Frontend logic (all 3 levels)
├── server.js           # Backend API (Levels 2 & 3)
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .env               # Your API keys (DO NOT COMMIT!)
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** (for Levels 2 & 3) - [Get it free here](https://makersuite.google.com/app/apikey)

### Step 1: Clone or Download

```bash
# If using Git
git clone <your-repo-url>
cd ai-cover-letter-generator

# Or download the ZIP and extract it
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `@google/generative-ai` - Gemini SDK
- `pdf-parse` - PDF text extraction
- `multer` - File upload handling

### Step 3: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API key
# Use any text editor (VS Code, Notepad, etc.)
```

**In `.env` file:**
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

**⚠️ CRITICAL SECURITY RULE:**
- **NEVER** commit `.env` to GitHub
- **NEVER** share your API key publicly
- `.env` is already in `.gitignore` to protect you

---

## 🎮 How to Run

### Option 1: Level 1 Only (No Backend Needed)

Simply open `index.html` in your browser:
```bash
# On Mac
open index.html

# On Windows
start index.html

# Or just double-click index.html
```

### Option 2: Levels 2 & 3 (With Backend)

```bash
# Start the server
npm start

# Server will start on http://localhost:3000
```

**You should see:**
```
🚀 Server running on http://localhost:3000
📝 AI Cover Letter Generator
✅ API Key Configured: true

💡 Visit http://localhost:3000 to use the app
```

### Development Mode (Auto-restart)

```bash
# Install nodemon globally (one-time)
npm install -g nodemon

# Run in dev mode
npm run dev
```

---

## 🎯 Difficulty Levels

### Level 1: Template Mode 💼

**What it does:**
- Uses a pre-built template
- Fills in user's information
- No AI or API needed
- Instant generation

**How to use:**
1. Click "Level 1: Template" button
2. Fill in the form
3. Click "Generate Cover Letter"
4. Copy or download the result

**Perfect for:** Learning the UI, testing without API keys

---

### Level 2: AI-Powered 🧠

**What it does:**
- Connects to Google Gemini API
- Generates personalized content
- Uses job description for context
- Professional AI writing

**Requirements:**
- ✅ Backend server running (`npm start`)
- ✅ `GEMINI_API_KEY` in `.env` file
- ✅ Internet connection

**How to use:**
1. Start server: `npm start`
2. Click "Level 2: AI Powered"
3. Fill in form (job description helps!)
4. Click "Generate" (wait 2-5 seconds)
5. Get AI-generated cover letter

**What makes it Level 2:**
- Real API integration
- Secure key management with `.env`
- Loading states during generation
- Error handling

---

### Level 3: SaaS Mode 🚀

**What it does:**
- Everything from Level 2, PLUS:
- PDF resume upload
- Extracts text from resume
- AI analyzes resume content
- Matches resume to job description
- Hyper-personalized output

**Requirements:**
- ✅ Everything from Level 2
- ✅ Resume in PDF format

**How to use:**
1. Start server: `npm start`
2. Click "Level 3: SaaS Mode"
3. Fill in form
4. **Upload your resume PDF**
5. Click "Generate"
6. Get highly personalized letter

**What makes it Level 3:**
- PDF parsing with `pdf-parse`
- Resume content analysis
- Advanced prompt engineering
- Production-ready features

---

## 🔑 API Key Setup

### Getting Your Free Gemini API Key

1. **Visit:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click:** "Create API Key"
4. **Copy** the key (looks like: `AIzaSyD...`)
5. **Paste** into your `.env` file

```env
GEMINI_API_KEY=AIzaSyD_your_actual_key_here
```

### Verifying Your Setup

```bash
# Start the server
npm start

# You should see:
✅ API Key Configured: true
```

### Free Tier Limits

- **60 requests per minute**
- **1,500 requests per day**
- Perfect for development and testing

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use `.env` for API keys
- ✅ Add `.env` to `.gitignore`
- ✅ Share only `.env.example`
- ✅ Rotate keys if exposed
- ✅ Use environment variables on deployment

### ❌ DON'T:
- ❌ Commit `.env` to GitHub
- ❌ Hardcode API keys in code
- ❌ Share keys in screenshots
- ❌ Push keys to public repos
- ❌ Use production keys in dev

### If You Accidentally Expose Your Key:

1. **Immediately** go to Google AI Studio
2. **Revoke** the exposed key
3. **Generate** a new key
4. **Update** your `.env` file
5. **Never** commit the old key

---

## 🐛 Troubleshooting

### Problem: "Server not running" error

**Solution:**
```bash
# Make sure you started the server
npm start

# Check if port 3000 is available
# If not, change PORT in .env
```

### Problem: "API key not configured"

**Solution:**
```bash
# Check your .env file exists
ls -la | grep .env

# Verify it has your key
cat .env

# Make sure there are no extra spaces
GEMINI_API_KEY=your_key_here  # ✅ Correct
GEMINI_API_KEY = your_key_here  # ❌ Wrong (spaces)
```

### Problem: "API quota exceeded"

**Solution:**
- You've hit the free tier limit (60/min or 1500/day)
- Wait a few minutes or until tomorrow
- Or upgrade to a paid plan

### Problem: Level 1 works, but Level 2 fails

**Checklist:**
- [ ] Server is running (`npm start`)
- [ ] `.env` file exists with valid key
- [ ] No spaces around `=` in `.env`
- [ ] Internet connection is active
- [ ] Gemini API key is active (not revoked)

### Problem: PDF upload not working (Level 3)

**Solution:**
- Make sure the file is actually a PDF
- Check file size (keep under 5MB for best results)
- Backend must be running
- Check browser console for errors

### Problem: "Cannot find module" error

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📸 Screenshots

### Level 1: Template Mode
Clean, professional UI with instant generation.

### Level 2: AI-Powered
Real-time AI generation with loading states.

### Level 3: SaaS Mode
Advanced features with resume upload.

---

## 🎓 Learning Outcomes

After completing this project, you will understand:

1. ✅ **Frontend Development**
   - Form handling and validation
   - Dynamic UI updates
   - File upload interfaces
   - Loading states and UX

2. ✅ **Backend Development**
   - Express.js server setup
   - RESTful API design
   - Request/response handling
   - Error handling

3. ✅ **AI Integration**
   - API key management
   - Prompt engineering
   - AI response handling
   - Rate limiting

4. ✅ **Security**
   - Environment variables
   - `.gitignore` best practices
   - API key protection
   - Secure deployment

5. ✅ **DevOps**
   - Package management (npm)
   - Environment configuration
   - Server deployment
   - Debugging

---

## 📝 Assessment Criteria

### Level 1 (Pass)
- ✅ Professional UI
- ✅ Form validation
- ✅ Template generation
- ✅ Copy/download features

### Level 2 (Good)
- ✅ Everything from Level 1
- ✅ Working AI integration
- ✅ `.env` setup (NO hardcoded keys!)
- ✅ Loading states
- ✅ Error handling

### Level 3 (Excellent)
- ✅ Everything from Level 2
- ✅ PDF upload and parsing
- ✅ Resume content extraction
- ✅ Advanced personalization
- ✅ Production-ready code

### Automatic Fail Conditions
- ❌ API key committed to GitHub
- ❌ No `.gitignore` file
- ❌ Hardcoded secrets in code

---

## 🚀 Deployment (Optional)

### Deploy to Vercel/Netlify

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in dashboard
# Set GEMINI_API_KEY in Vercel settings
```

### Deploy to Render/Railway

1. Connect your GitHub repo
2. Add `GEMINI_API_KEY` in environment variables
3. Set build command: `npm install`
4. Set start command: `npm start`

---

## 🤝 Contributing

This is a learning project, but improvements are welcome!

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - Feel free to use this for learning!

---

## 🎉 Congratulations!

You've built a full-stack AI application with:
- Modern frontend design
- Secure backend API
- Real AI integration
- Production-ready features

**Next Steps:**
- Add more AI providers (OpenAI, Claude)
- Implement user authentication
- Add cover letter history
- Create PDF export
- Build a Chrome extension

---

## 📞 Support

If you're stuck:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review your console errors
3. Verify `.env` configuration
4. Check server logs
5. Google the specific error message

---

**Built with ❤️ for Mission 4**

*Remember: NEVER commit your `.env` file to GitHub!*

---

## Quick Start Checklist

- [ ] Node.js installed
- [ ] Ran `npm install`
- [ ] Created `.env` file
- [ ] Added Gemini API key to `.env`
- [ ] Added `.env` to `.gitignore`
- [ ] Started server with `npm start`
- [ ] Tested Level 1 (template)
- [ ] Tested Level 2 (AI)
- [ ] Tested Level 3 (resume upload)
- [ ] Verified no API keys in Git history

**You're ready to submit! 🎊**