// ==============================
// TIMENIX - JavaScript Logic (Enhanced)
// ==============================

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');
const searchInput = document.getElementById('searchLogs');
const usageLogs = document.getElementById('usageLogs');
const notification = document.getElementById('notification');
const rewardPoints = document.getElementById('rewardPoints');

// Dashboard stat elements
const ageGroupEl = document.getElementById('ageGroup');
const timeRemainingEl = document.getElementById('timeRemaining');
const avgUseEl = document.getElementById('avgUse');
const longestSessionEl = document.getElementById('longestSession');
const lockMessage = document.getElementById('lockMessage');
const unlockedMessage = document.getElementById('unlockedMessage');

// ==============================
// Theme Toggle Logic
// ==============================
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
        themeToggle.textContent = '☀️ Light Mode';
        showNotification('Dark mode enabled');
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
        showNotification('Light mode enabled');
    }
});

// ==============================
// Notification Logic
// ==============================
function showNotification(message, duration = 2000) {
    notification.textContent = message;
    notification.classList.add('show');
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, duration);
}

// ==============================
// Modal Logic & Accessibility
// ==============================
function openSignInModal() {
    signInModal.classList.remove('hidden');
    setTimeout(() => signInModal.querySelector('input').focus(), 100);
}
function closeSignInModal() {
    signInModal.classList.add('hidden');
}
function openSignUpModal() {
    signUpModal.classList.remove('hidden');
    setTimeout(() => signUpModal.querySelector('input').focus(), 100);
}
function closeSignUpModal() {
    signUpModal.classList.add('hidden');
}
// Close modals on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSignInModal();
        closeSignUpModal();
    }
});

// ==============================
// Sign In Logic (Mockup)
// ==============================
function signIn() {
    const username = document.getElementById('signInUser').value.trim();
    const password = document.getElementById('signInPass').value;
    if (username === 'admin' && password === 'admin123') {
        showNotification('Sign In Successful!');
        closeSignInModal();
    } else {
        showNotification('Invalid Credentials', 2500);
    }
}

// ==============================
// Sign Up Logic (Mockup)
// ==============================
function signUp() {
    const username = document.getElementById('signUpUser').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPass').value;
    if (username && email && password) {
        showNotification('Sign Up Successful!');
        closeSignUpModal();
    } else {
        showNotification('All fields are required.', 2500);
    }
}

// ==============================
// Search Logic for Logs
// ==============================
searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const logs = usageLogs.getElementsByTagName('li');
    Array.from(logs).forEach(log => {
        log.style.display = log.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
});

// ==============================
// Dashboard Data Fetch (Mockup)
// ==============================
let points = 0;
function fetchUsageLogs() {
    usageLogs.innerHTML = '';
    // Mock data with more stats
    const mockData = [
        { timestamp: '2025-05-18 10:00', age_group: 'Teenager', minutes_spent: 30 },
        { timestamp: '2025-05-18 12:00', age_group: 'Child', minutes_spent: 15 },
        { timestamp: '2025-05-18 14:00', age_group: 'Adult', minutes_spent: 45 },
        { timestamp: '2025-05-18 16:00', age_group: 'Teenager', minutes_spent: 25 }
    ];

    let total = 0, maxSession = 0, today = 0, group = 'Unknown';
    mockData.forEach((entry, idx) => {
        const logItem = document.createElement('li');
        logItem.textContent = `${entry.timestamp} - ${entry.age_group}: ${entry.minutes_spent} mins`;
        usageLogs.appendChild(logItem);

        total += entry.minutes_spent;
        today += entry.minutes_spent;
        if (entry.minutes_spent > maxSession) maxSession = entry.minutes_spent;
        if (idx === mockData.length - 1) group = entry.age_group;
    });

    // Update dashboard stats
    ageGroupEl.textContent = group;
    timeRemainingEl.textContent = today + ' mins';
    avgUseEl.textContent = Math.round(total / mockData.length) + ' mins';
    longestSessionEl.textContent = maxSession + ' mins';

    // Lock/unlock status based on arbitrary limit
    if (today > 90) {
        lockMessage.classList.remove('hidden');
        unlockedMessage.classList.add('hidden');
        showNotification('Screen Locked! Take a break 😊', 2500);
    } else {
        lockMessage.classList.add('hidden');
        unlockedMessage.classList.remove('hidden');
    }

    // Gamification: award points for each log under 30 mins
    let earned = 0;
    mockData.forEach(entry => {
        if (entry.minutes_spent <= 30) earned += 10;
    });
    updatePoints(earned);
}

// ==============================
// Gamification Points Logic
// ==============================
function updatePoints(earned) {
    points += earned;
    rewardPoints.textContent = `Points: ${points}`;
    if (earned > 0) {
        showNotification(`+${earned} points for healthy habits!`);
        // Animate points
        rewardPoints.style.transform = 'scale(1.15)';
        setTimeout(() => rewardPoints.style.transform = 'scale(1)', 400);
    }
}

// ==============================
// Initialize Dashboard
// ==============================
fetchUsageLogs();

// ==============================
// Accessibility: Trap focus in open modal
// ==============================
function trapFocus(modal) {
    if (!modal) return;
    const focusableEls = modal.querySelectorAll('input, button');
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    modal.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === firstEl) {
                lastEl.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastEl) {
                firstEl.focus();
                e.preventDefault();
            }
        }
    });
}
signInModal.addEventListener('transitionend', () => {
    if (!signInModal.classList.contains('hidden')) trapFocus(signInModal);
});
signUpModal.addEventListener('transitionend', () => {
    if (!signUpModal.classList.contains('hidden')) trapFocus(signUpModal);
});
