/**
 * Main Application Entry Point
 * Initializes all systems and manages global state
 */

// Global instances
let snowEngine;
let windowManager;
let terminal;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Winter Retro OS Starting...');

    // Initialize Snow Engine
    snowEngine = new SnowEngine('snow-canvas');
    console.log('❄️  Snow Engine initialized');

    // Initialize Window Manager
    windowManager = new WindowManager();
    console.log('🪟 Window Manager initialized');

    // Initialize Terminal
    terminal = new Terminal('terminal-input', 'terminal-output');
    console.log('💻 Terminal initialized');

    // Initialize Clock
    initClock();

    // Setup global interactions
    setupInteractions();

    // Welcome message
    setTimeout(() => {
        console.log('✨ Winter Retro OS Ready!');
    }, 500);

    // Open terminal by default
    setTimeout(() => {
        windowManager.openWindow('terminal');
    }, 1000);
});

/**
 * Initialize the taskbar clock
 */
function initClock() {
    const clockElement = document.getElementById('clock');

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Setup global interactions and Easter eggs
 */
function setupInteractions() {
    // Easter egg: Click on canvas to create snow burst
    const canvas = document.getElementById('snow-canvas');
    canvas.addEventListener('click', (e) => {
        if (snowEngine) {
            snowEngine.addBurst(e.clientX, e.clientY, 30);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + T: Open Terminal
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            windowManager.openWindow('terminal');
        }

        // Alt + A: Open About
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            windowManager.openWindow('about');
        }

        // Alt + F: Open Files
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            windowManager.openWindow('files');
        }

        // F11: Toggle fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
    });

    // Start button interaction
    const startButton = document.querySelector('.start-button');
    startButton.addEventListener('click', () => {
        showStartMenu();
    });

    // File item selection
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', function() {
            fileItems.forEach(f => f.classList.remove('selected'));
            this.classList.add('selected');
        });

        item.addEventListener('dblclick', function() {
            const fileName = this.querySelector('.file-name').textContent;
            alert(`Opening ${fileName}...`);
        });
    });

    // Desktop context menu prevention (to maintain retro feel)
    document.querySelector('.desktop').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

/**
 * Show start menu (placeholder for now)
 */
function showStartMenu() {
    const menu = document.createElement('div');
    menu.className = 'start-menu';
    menu.style.cssText = `
        position: absolute;
        bottom: 40px;
        left: 4px;
        width: 250px;
        background: var(--window-bg);
        border: 2px solid;
        border-color: var(--window-border-light) var(--window-border-dark) var(--window-border-dark) var(--window-border-light);
        box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
        z-index: 10001;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    `;

    const menuItems = [
        { icon: '▶', label: 'Terminal', window: 'terminal' },
        { icon: 'ℹ', label: 'About', window: 'about' },
        { icon: '📁', label: 'Files', window: 'files' },
        { icon: '⚙', label: 'Settings', window: null },
        { icon: '🔌', label: 'Shut Down', window: null }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            font-size: 20px;
            color: #000;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        menuItem.innerHTML = `<span>${item.icon}</span><span>${item.label}</span>`;

        menuItem.addEventListener('mouseenter', function() {
            this.style.background = 'var(--titlebar-active)';
            this.style.color = '#fff';
        });

        menuItem.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.color = '#000';
        });

        menuItem.addEventListener('click', () => {
            if (item.window) {
                windowManager.openWindow(item.window);
            } else if (item.label === 'Shut Down') {
                handleShutdown();
            } else {
                alert('Feature not implemented yet!');
            }
            document.body.removeChild(menu);
        });

        menu.appendChild(menuItem);
    });

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.classList.contains('start-button')) {
                if (document.body.contains(menu)) {
                    document.body.removeChild(menu);
                }
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);

    document.body.appendChild(menu);
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Handle shutdown sequence
 */
function handleShutdown() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        color: var(--terminal-text);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-size: 32px;
        font-family: 'VT323', monospace;
        flex-direction: column;
        gap: 20px;
        opacity: 0;
        transition: opacity 0.5s;
    `;

    const message = document.createElement('div');
    message.textContent = 'It\'s now safe to turn off your computer.';
    message.style.textAlign = 'center';

    const icon = document.createElement('div');
    icon.textContent = '❄️';
    icon.style.fontSize = '64px';

    overlay.appendChild(icon);
    overlay.appendChild(message);

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);

    // Allow restarting by clicking
    overlay.addEventListener('click', () => {
        location.reload();
    });
}

/**
 * Export global instances for console debugging
 */
window.snowEngine = snowEngine;
window.windowManager = windowManager;
window.terminal = terminal;

// Console Easter egg
console.log('%c❄️ Winter Retro OS', 'font-size: 24px; color: #00ff41; font-weight: bold;');
console.log('%cTip: Try these commands in the terminal:', 'color: #00ff41;');
console.log('%c  snow 300    - Increase snow', 'color: #00ff41;');
console.log('%c  wind 1.5    - Add wind', 'color: #00ff41;');
console.log('%c  matrix      - ???', 'color: #00ff41;');
console.log('%c  winter      - Display ASCII art', 'color: #00ff41;');
console.log('%cKeyboard shortcuts:', 'color: #00ff41;');
console.log('%c  Alt+T - Open Terminal', 'color: #00ff41;');
console.log('%c  Alt+A - Open About', 'color: #00ff41;');
console.log('%c  Alt+F - Open Files', 'color: #00ff41;');
console.log('%c  F11   - Toggle Fullscreen', 'color: #00ff41;');
