/**
 * WindowManager Class
 * Handles window drag-and-drop, z-index management, and window states
 */
class WindowManager {
    constructor() {
        this.windows = [];
        this.activeWindow = null;
        this.draggedWindow = null;
        this.dragOffset = { x: 0, y: 0 };
        this.zIndexCounter = 1000;
        this.minimizedWindows = new Set();

        this.init();
    }

    init() {
        // Get all windows
        const windowElements = document.querySelectorAll('.window');
        windowElements.forEach(windowEl => {
            this.registerWindow(windowEl);
        });

        // Setup desktop icon clicks
        const desktopIcons = document.querySelectorAll('.desktop-icon');
        desktopIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const windowId = icon.getAttribute('data-window');
                this.openWindow(windowId);
            });
        });

        // Setup double-click to open windows
        desktopIcons.forEach(icon => {
            icon.addEventListener('dblclick', (e) => {
                e.preventDefault();
                const windowId = icon.getAttribute('data-window');
                this.openWindow(windowId);
            });
        });
    }

    registerWindow(windowEl) {
        const windowId = windowEl.getAttribute('data-window-id');

        this.windows.push({
            id: windowId,
            element: windowEl,
            minimized: false
        });

        // Setup titlebar drag
        const titlebar = windowEl.querySelector('.window-titlebar');
        titlebar.addEventListener('mousedown', (e) => this.startDrag(e, windowEl));

        // Setup window controls
        const minimizeBtn = windowEl.querySelector('.minimize');
        const maximizeBtn = windowEl.querySelector('.maximize');
        const closeBtn = windowEl.querySelector('.close');

        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(windowEl);
        });

        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.maximizeWindow(windowEl);
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(windowEl);
        });

        // Click to focus
        windowEl.addEventListener('mousedown', () => {
            this.focusWindow(windowEl);
        });
    }

    openWindow(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (!window) return;

        const windowEl = window.element;

        if (this.minimizedWindows.has(windowId)) {
            this.restoreWindow(windowEl);
        } else {
            windowEl.style.display = 'flex';
            this.focusWindow(windowEl);
            this.updateTaskbar();
        }
    }

    closeWindow(windowEl) {
        windowEl.style.display = 'none';
        windowEl.classList.remove('active');
        const windowId = windowEl.getAttribute('data-window-id');
        this.minimizedWindows.delete(windowId);
        this.updateTaskbar();
    }

    minimizeWindow(windowEl) {
        const windowId = windowEl.getAttribute('data-window-id');
        windowEl.classList.add('minimized');
        this.minimizedWindows.add(windowId);

        if (this.activeWindow === windowEl) {
            this.activeWindow = null;
            windowEl.classList.remove('active');
        }

        this.updateTaskbar();
    }

    restoreWindow(windowEl) {
        const windowId = windowEl.getAttribute('data-window-id');
        windowEl.classList.remove('minimized');
        windowEl.style.display = 'flex';
        this.minimizedWindows.delete(windowId);
        this.focusWindow(windowEl);
        this.updateTaskbar();
    }

    maximizeWindow(windowEl) {
        const isMaximized = windowEl.classList.contains('maximized');

        if (isMaximized) {
            windowEl.classList.remove('maximized');
            windowEl.style.width = windowEl.dataset.originalWidth;
            windowEl.style.height = windowEl.dataset.originalHeight;
            windowEl.style.top = windowEl.dataset.originalTop;
            windowEl.style.left = windowEl.dataset.originalLeft;
        } else {
            windowEl.dataset.originalWidth = windowEl.style.width || windowEl.offsetWidth + 'px';
            windowEl.dataset.originalHeight = windowEl.style.height || windowEl.offsetHeight + 'px';
            windowEl.dataset.originalTop = windowEl.style.top || '100px';
            windowEl.dataset.originalLeft = windowEl.style.left || '150px';

            windowEl.classList.add('maximized');
            windowEl.style.width = '100%';
            windowEl.style.height = 'calc(100% - 40px)';
            windowEl.style.top = '0';
            windowEl.style.left = '0';
        }
    }

    focusWindow(windowEl) {
        // Remove active class from all windows
        this.windows.forEach(w => {
            w.element.classList.remove('active');
        });

        // Add active class to focused window
        windowEl.classList.add('active');
        windowEl.style.zIndex = ++this.zIndexCounter;
        this.activeWindow = windowEl;

        this.updateTaskbar();
    }

    startDrag(e, windowEl) {
        if (e.target.classList.contains('window-btn')) return;

        this.draggedWindow = windowEl;
        this.focusWindow(windowEl);

        const rect = windowEl.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.stopDrag);

        e.preventDefault();
    }

    drag = (e) => {
        if (!this.draggedWindow) return;

        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;

        // Constrain to viewport
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 100;

        this.draggedWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.draggedWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }

    stopDrag = () => {
        this.draggedWindow = null;
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.stopDrag);
    }

    updateTaskbar() {
        const taskbarApps = document.getElementById('taskbar-apps');
        taskbarApps.innerHTML = '';

        this.windows.forEach(window => {
            const windowEl = window.element;
            const isVisible = windowEl.style.display !== 'none';

            if (isVisible) {
                const appBtn = document.createElement('div');
                appBtn.className = 'taskbar-app';
                appBtn.textContent = windowEl.querySelector('.window-title').textContent;

                if (windowEl === this.activeWindow && !this.minimizedWindows.has(window.id)) {
                    appBtn.classList.add('active');
                }

                appBtn.addEventListener('click', () => {
                    if (this.minimizedWindows.has(window.id)) {
                        this.restoreWindow(windowEl);
                    } else if (windowEl === this.activeWindow) {
                        this.minimizeWindow(windowEl);
                    } else {
                        this.focusWindow(windowEl);
                    }
                });

                taskbarApps.appendChild(appBtn);
            }
        });
    }

    getActiveWindowId() {
        return this.activeWindow ? this.activeWindow.getAttribute('data-window-id') : null;
    }
}
