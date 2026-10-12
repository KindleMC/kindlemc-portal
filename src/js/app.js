// Dynamic Markdown Fetcher with local file protocol detector
async function loadMarkdown(filePath, targetElementId) {
    const targetEl = document.getElementById(targetElementId);
    
    // Warn user if opened directly via file:// protocol
    if (window.location.protocol === 'file:') {
        targetEl.innerHTML = `
            <div style="background: var(--card-inner); border: 1px solid var(--accent-fire); padding: 1.5rem; border-radius: 8px;">
                <h3 style="color: var(--accent-fire); margin-top:0;">⚠️ Local Browser Security Warning</h3>
                <p>Browsers block <code>fetch()</code> requests when opening HTML files directly (<code>file:///</code>).</p>
                <p><strong>How to fix:</strong> Right-click <code>index.html</code> in VS Code and choose <strong>"Open with Live Server"</strong>, or push changes to GitHub Pages!</p>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("File not found");
        const markdownText = await response.text();
        targetEl.innerHTML = marked.parse(markdownText);
    } catch (err) {
        targetEl.innerHTML = `<p style="color: var(--accent-fire);">⚠️ Unable to load document (${filePath}). Make sure the file exists!</p>`;
    }
}

// Tab Switching & Markdown Lazy Loading
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add('active');

    const activeBtn = Array.from(document.querySelectorAll('.nav-btn'))
        .find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) activeBtn.classList.add('active');

    if (tabId === 'constitution') {
        loadMarkdown('src/docs/constitution.md', 'constitution-doc');
    } else if (tabId === 'statutes') {
        loadMarkdown('src/docs/statutes.md', 'statutes-doc');
    } else if (tabId === 'civics') {
        loadMarkdown('src/docs/civics.md', 'civics-doc');
    }
}

// Light / Dark Theme Toggle
function toggleTheme() {
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById('theme-btn');
    const currentTheme = htmlEl.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        htmlEl.setAttribute('data-theme', 'light');
        themeBtn.innerText = '☀️ Light';
        localStorage.setItem('kindleTheme', 'light');
    } else {
        htmlEl.setAttribute('data-theme', 'dark');
        themeBtn.innerText = '🌙 Dark';
        localStorage.setItem('kindleTheme', 'dark');
    }
}

// Load saved theme on boot
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('kindleTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.innerText = savedTheme === 'light' ? '☀️ Light' : '🌙 Dark';
    }
});

// Copy Server IP
function copyIP() {
    navigator.clipboard.writeText("play.kindlemc.com");
    alert("✨ Copied IP to clipboard: play.kindlemc.com");
}