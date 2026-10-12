async function loadMarkdown(filePath, targetElementId) {
    const targetEl = document.getElementById(targetElementId);
    if (!targetEl) return;

    if (window.location.protocol === 'file:') {
        targetEl.innerHTML = `
            <div style="padding:1rem; border:1px solid var(--accent-fire); border-radius:8px; background:var(--card-inner);">
                ⚠️ Local file safety lock. Please open via <strong>Live Server</strong> or view directly on GitHub Pages!
            </div>`;
        return;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("File not found");
        const markdownText = await response.text();
        targetEl.innerHTML = marked.parse(markdownText);
    } catch (err) {
        targetEl.innerHTML = `<p style="color:var(--accent-fire);">⚠️ Unable to load document (${filePath}).</p>`;
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add('active');

    const activeBtn = Array.from(document.querySelectorAll('.nav-btn'))
        .find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) activeBtn.classList.add('active');

    if (tabId === 'about') loadMarkdown('src/docs/about.md', 'about-doc');
    else if (tabId === 'constitution') loadMarkdown('src/docs/constitution.md', 'constitution-doc');
    else if (tabId === 'statutes') loadMarkdown('src/docs/statutes.md', 'statutes-doc');
    else if (tabId === 'civics') loadMarkdown('src/docs/civics.md', 'civics-doc');
}

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

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('kindleTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) themeBtn.innerText = savedTheme === 'light' ? '☀️ Light' : '🌙 Dark';

    // Load About tab markdown on startup
    loadMarkdown('src/docs/about.md', 'about-doc');
});

function copyIP() {
    navigator.clipboard.writeText("kindlemc.mcshost.com");
    alert("Copied IP to clipboard: kindlemc.mcshost.com");
}