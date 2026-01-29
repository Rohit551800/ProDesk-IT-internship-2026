// ==================== CONSTANTS ====================
const API_BASE_URL = 'https://api.github.com/users';

// ==================== DOM ELEMENTS ====================
const singleModeBtn = document.getElementById('singleModeBtn');
const battleModeBtn = document.getElementById('battleModeBtn');
const singleMode = document.getElementById('singleMode');
const battleMode = document.getElementById('battleMode');

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultContainer = document.getElementById('resultContainer');

const battleForm = document.getElementById('battleForm');
const battleInput1 = document.getElementById('battleInput1');
const battleInput2 = document.getElementById('battleInput2');
const battleResults = document.getElementById('battleResults');

// ==================== MODE SWITCHING ====================
singleModeBtn.addEventListener('click', () => switchMode('single'));
battleModeBtn.addEventListener('click', () => switchMode('battle'));

function switchMode(mode) {
    if (mode === 'single') {
        singleModeBtn.classList.add('active');
        battleModeBtn.classList.remove('active');
        singleMode.classList.add('active');
        battleMode.classList.remove('active');
        clearResults();
    } else {
        battleModeBtn.classList.add('active');
        singleModeBtn.classList.remove('active');
        battleMode.classList.add('active');
        singleMode.classList.remove('active');
        clearResults();
    }
}

function clearResults() {
    resultContainer.innerHTML = '';
    battleResults.innerHTML = '';
}

// ==================== SINGLE SEARCH MODE ====================
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = searchInput.value.trim();
    
    if (!username) {
        showError(resultContainer, 'Please enter a GitHub username');
        return;
    }
    
    await searchUser(username);
});

async function searchUser(username) {
    // Show loading state
    showLoading(resultContainer);
    
    try {
        // Fetch user data
        const userData = await fetchUserData(username);
        
        // Fetch repositories
        const repos = await fetchUserRepos(username);
        
        // Display profile
        displayProfile(userData, repos, resultContainer);
        
    } catch (error) {
        showError(resultContainer, error.message);
    }
}

// ==================== BATTLE MODE ====================
battleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username1 = battleInput1.value.trim();
    const username2 = battleInput2.value.trim();
    
    if (!username1 || !username2) {
        showError(battleResults, 'Please enter both usernames');
        return;
    }
    
    if (username1 === username2) {
        showError(battleResults, 'Please enter different usernames');
        return;
    }
    
    await battleUsers(username1, username2);
});

async function battleUsers(username1, username2) {
    // Show loading state
    showLoading(battleResults);
    
    try {
        // Fetch both users simultaneously
        const [user1Data, user2Data] = await Promise.all([
            fetchUserData(username1),
            fetchUserData(username2)
        ]);
        
        // Fetch both users' repos simultaneously
        const [repos1, repos2] = await Promise.all([
            fetchUserRepos(username1),
            fetchUserRepos(username2)
        ]);
        
        // Calculate total stars
        const stars1 = calculateTotalStars(repos1);
        const stars2 = calculateTotalStars(repos2);
        
        // Determine winner
        const winner = stars1 > stars2 ? 1 : stars1 < stars2 ? 2 : 0;
        
        // Display battle results
        displayBattleResults(user1Data, user2Data, repos1, repos2, stars1, stars2, winner);
        
    } catch (error) {
        showError(battleResults, error.message);
    }
}

// ==================== API FUNCTIONS ====================
async function fetchUserData(username) {
    const response = await fetch(`${API_BASE_URL}/${username}`);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`User "${username}" not found 😢`);
        }
        throw new Error('Failed to fetch user data. Please try again.');
    }
    
    return await response.json();
}

async function fetchUserRepos(username) {
    const response = await fetch(`${API_BASE_URL}/${username}/repos?sort=created&direction=desc&per_page=5`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch repositories');
    }
    
    return await response.json();
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function calculateTotalStars(repos) {
    return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

// ==================== DISPLAY FUNCTIONS ====================
function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p class="loading-text">Fetching data from GitHub...</p>
        </div>
    `;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error">
            <div class="error-icon">😢</div>
            <p class="error-text">${message}</p>
        </div>
    `;
}

function displayProfile(user, repos, container) {
    const reposHTML = repos.length > 0 ? `
        <div class="repos-section">
            <h3 class="repos-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                Latest Repositories
            </h3>
            <div class="repos-list">
                ${repos.map(repo => createRepoCard(repo)).join('')}
            </div>
        </div>
    ` : '';
    
    container.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <img src="${user.avatar_url}" alt="${user.name || user.login}" class="profile-avatar">
                <div class="profile-info">
                    <h2 class="profile-name">${user.name || user.login}</h2>
                    <p class="profile-username">@${user.login}</p>
                    ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
                </div>
            </div>
            
            <div class="profile-meta">
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Joined ${formatDate(user.created_at)}</span>
                </div>
                ${user.blog ? `
                    <div class="meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <a href="${user.blog.startsWith('http') ? user.blog : 'https://' + user.blog}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="meta-link">
                            ${user.blog}
                        </a>
                    </div>
                ` : ''}
            </div>
            
            <div class="profile-stats">
                <div class="stat-card">
                    <span class="stat-value">${user.public_repos}</span>
                    <span class="stat-label">Repositories</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${user.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${user.following}</span>
                    <span class="stat-label">Following</span>
                </div>
            </div>
            
            ${reposHTML}
        </div>
    `;
}

function createRepoCard(repo) {
    return `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card">
            <h4 class="repo-name">${repo.name}</h4>
            ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ''}
            <div class="repo-meta">
                <span class="repo-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    ${repo.stargazers_count}
                </span>
                <span class="repo-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m-6-6h6m6 0h6"></path>
                    </svg>
                    ${repo.forks_count}
                </span>
                <span class="repo-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${formatDate(repo.created_at)}
                </span>
            </div>
        </a>
    `;
}

function displayBattleResults(user1, user2, repos1, repos2, stars1, stars2, winner) {
    battleResults.innerHTML = `
        ${createBattleCard(user1, repos1, stars1, winner === 1 ? 'winner' : winner === 2 ? 'loser' : '')}
        ${createBattleCard(user2, repos2, stars2, winner === 2 ? 'winner' : winner === 1 ? 'loser' : '')}
    `;
}

function createBattleCard(user, repos, totalStars, status) {
    const reposHTML = repos.length > 0 ? `
        <div class="repos-section">
            <h3 class="repos-title">Top Repositories</h3>
            <div class="repos-list">
                ${repos.slice(0, 3).map(repo => createRepoCard(repo)).join('')}
            </div>
        </div>
    ` : '';
    
    return `
        <div class="battle-card ${status}">
            ${status === 'winner' ? '<div class="winner-badge">🏆 WINNER</div>' : ''}
            
            <div class="battle-score">
                <div class="battle-score-value">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    ${totalStars}
                </div>
                <div class="battle-score-label">Total Stars</div>
            </div>
            
            <div class="profile-header">
                <img src="${user.avatar_url}" alt="${user.name || user.login}" class="profile-avatar">
                <div class="profile-info">
                    <h2 class="profile-name">${user.name || user.login}</h2>
                    <p class="profile-username">@${user.login}</p>
                    ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-card">
                    <span class="stat-value">${user.public_repos}</span>
                    <span class="stat-label">Repos</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${user.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${user.following}</span>
                    <span class="stat-label">Following</span>
                </div>
            </div>
            
            ${reposHTML}
        </div>
    `;
}

// ==================== INITIALIZATION ====================
console.log('🚀 Dev-Detective initialized successfully!');
console.log('💡 Try searching for: octocat, torvalds, gaearon, or any GitHub user!');