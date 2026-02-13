// Global State
let currentLevel = 1;
let resumeText = '';

// DOM Elements
const form = document.getElementById('coverLetterForm');
const levelButtons = document.querySelectorAll('.level-card');
const generateBtn = document.getElementById('generateBtn');
const outputSection = document.getElementById('outputSection');
const coverLetterOutput = document.getElementById('coverLetterOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const resumeUploadSection = document.getElementById('resumeUploadSection');
const resumeFile = document.getElementById('resumeFile');
const fileName = document.getElementById('fileName');
const infoBox = document.getElementById('infoBox');

// Info Content for Each Level
const levelInfo = {
    1: {
        icon: '📝',
        title: 'Template Mode',
        description: 'Uses a professional template with your information. Perfect for getting started instantly!'
    },
    2: {
        icon: '🤖',
        title: 'AI Powered',
        description: 'Connects to real AI (Gemini) to generate personalized, professional cover letters!'
    },
    3: {
        icon: '🚀',
        title: 'SaaS Mode',
        description: 'Upload your resume PDF and get hyper-personalized cover letters with AI analysis!'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateInfoBox();
    createParticles();
    initAnimations();
});

// Event Listeners
function setupEventListeners() {
    // Level Selection
    levelButtons.forEach(btn => {
        btn.addEventListener('click', () => handleLevelChange(btn));
    });

    // Form Submit
    form.addEventListener('submit', handleFormSubmit);

    // Copy Button
    copyBtn.addEventListener('click', copyToClipboard);

    // Download Button
    downloadBtn.addEventListener('click', downloadCoverLetter);

    // Regenerate Button
    regenerateBtn.addEventListener('click', () => {
        outputSection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // File Upload
    resumeFile.addEventListener('change', handleFileUpload);
}

// Level Change Handler
function handleLevelChange(btn) {
    levelButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLevel = parseInt(btn.dataset.level);
    
    // Show/Hide Resume Upload Section
    if (currentLevel === 3) {
        resumeUploadSection.style.display = 'block';
    } else {
        resumeUploadSection.style.display = 'none';
        resumeText = '';
        fileName.classList.remove('active');
    }
    
    updateInfoBox();
}

// Update Info Box
function updateInfoBox() {
    const info = levelInfo[currentLevel];
    infoBox.innerHTML = `
        <div class="info-icon-3d">${info.icon}</div>
        <div class="info-content">
            <h3 class="info-title">${info.title}</h3>
            <p class="info-desc">${info.description}</p>
        </div>
    `;
}

// File Upload Handler (Level 3)
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only!');
        resumeFile.value = '';
        return;
    }

    fileName.textContent = `📄 ${file.name}`;
    fileName.classList.add('active');

    // For Level 3, we need to parse the PDF
    if (currentLevel === 3) {
        try {
            resumeText = await parsePDF(file);
            console.log('Resume text extracted:', resumeText.substring(0, 100) + '...');
        } catch (error) {
            console.error('Error parsing PDF:', error);
            alert('Error reading PDF. Please try another file.');
            resumeFile.value = '';
            fileName.classList.remove('active');
        }
    }
}

// PDF Parser (Level 3)
async function parsePDF(file) {
    // In a real implementation with Node.js, you would use pdf-parse
    // For frontend-only, we'll use a workaround or library like PDF.js
    
    // This is a simplified version - in production, use pdf.js or send to backend
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                // This is a placeholder - in real implementation, use PDF.js
                // For now, we'll simulate extraction
                const arrayBuffer = e.target.result;
                
                // NOTE: This is simplified. In production, use:
                // import * as pdfjsLib from 'pdfjs-dist';
                // Or send to backend with pdf-parse
                
                // Simulated text for demo purposes
                resolve(`[Resume text would be extracted here from PDF]
                
Skills: JavaScript, React, Node.js, Python, AWS
Experience: 5+ years in software development
Education: Bachelor's in Computer Science
Projects: Built multiple full-stack applications
                `);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

// Form Submit Handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('candidateName').value.trim(),
        role: document.getElementById('jobRole').value.trim(),
        company: document.getElementById('companyName').value.trim(),
        skills: document.getElementById('keySkills').value.trim(),
        jobDescription: document.getElementById('jobDescription').value.trim(),
        resumeText: resumeText
    };

    // Show loading state
    showLoading(true);

    try {
        let coverLetter;

        switch (currentLevel) {
            case 1:
                coverLetter = generateTemplateLetterLevel1(formData);
                break;
            case 2:
                coverLetter = await generateAILetterLevel2(formData);
                break;
            case 3:
                coverLetter = await generateAILetterLevel3(formData);
                break;
        }

        displayCoverLetter(coverLetter);
    } catch (error) {
        console.error('Error generating cover letter:', error);
        alert('Error generating cover letter: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// LEVEL 1: Template-Based Generation
function generateTemplateLetterLevel1(data) {
    const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return `${data.name}
[Your Address]
[City, State ZIP Code]
[Your Email]
[Your Phone Number]

${today}

Hiring Manager
${data.company}
[Company Address]

Dear Hiring Manager,

I am writing to express my strong interest in the ${data.role} position at ${data.company}. With my comprehensive skill set and passion for excellence, I believe I would be a valuable addition to your team.

Throughout my career, I have developed expertise in ${data.skills}. These skills have enabled me to deliver high-quality results and contribute meaningfully to every project I've undertaken. I am particularly drawn to ${data.company} because of your reputation for innovation and excellence in the industry.

My key qualifications include:
• Proficiency in ${data.skills.split(',')[0]?.trim() || 'relevant technologies'}
• Strong problem-solving and analytical abilities
• Excellent communication and teamwork skills
• Proven track record of meeting deadlines and exceeding expectations

I am excited about the opportunity to bring my skills and enthusiasm to ${data.company} as a ${data.role}. I am confident that my background and passion for continuous learning make me an ideal candidate for this position.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team's success.

Sincerely,
${data.name}`;
}

// LEVEL 2: AI-Powered Generation
async function generateAILetterLevel2(data) {
    // This function calls your backend API which uses Gemini/OpenAI
    const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: data.name,
            role: data.role,
            company: data.company,
            skills: data.skills,
            jobDescription: data.jobDescription,
            level: 2
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate AI letter. Make sure your server is running!');
    }

    const result = await response.json();
    return result.coverLetter;
}

// LEVEL 3: AI with Resume Parsing
async function generateAILetterLevel3(data) {
    if (!data.resumeText) {
        throw new Error('Please upload your resume PDF for Level 3!');
    }

    const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: data.name,
            role: data.role,
            company: data.company,
            skills: data.skills,
            jobDescription: data.jobDescription,
            resumeText: data.resumeText,
            level: 3
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate AI letter. Make sure your server is running!');
    }

    const result = await response.json();
    return result.coverLetter;
}

// Display Cover Letter
function displayCoverLetter(letter) {
    coverLetterOutput.textContent = letter;
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show/Hide Loading State
function showLoading(isLoading) {
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoader = generateBtn.querySelector('.btn-loader');

    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        generateBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        generateBtn.disabled = false;
    }
}

// Copy to Clipboard
async function copyToClipboard() {
    const text = coverLetterOutput.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copy-success');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copy-success');
        }, 2000);
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Cover letter copied to clipboard!');
    }
}

// Download Cover Letter
function downloadCoverLetter() {
    const text = coverLetterOutput.textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const candidateName = document.getElementById('candidateName').value.trim();
    const company = document.getElementById('companyName').value.trim();
    const filename = `CoverLetter_${candidateName.replace(/\s+/g, '_')}_${company.replace(/\s+/g, '_')}.txt`;
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Easter Egg: Console message
console.log('%c🚀 AI Cover Letter Generator', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt for Mission 4 - AI Integration Project', 'font-size: 12px; color: #6b7280;');
console.log('%cCurrent Level:', currentLevel, 'font-size: 12px; color: #10b981;');

// ===== PARTICLE EFFECTS =====
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.animation = `particleFloat ${duration}s ${delay}s infinite ease-in-out`;
        
        container.appendChild(particle);
    }
    
    // Add particle float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== INIT ANIMATIONS =====
function initAnimations() {
    // Add hover effect to form inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-3d, .level-card, .toolbar-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.floating-shape');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - 0.5) * 50 * speed;
            const y = (mouseY - 0.5) * 50 * speed;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}