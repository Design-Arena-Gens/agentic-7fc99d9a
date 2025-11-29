/**
 * Terminal Class
 * Handles user input, command parsing, and typing effects
 */
class Terminal {
    constructor(inputId, outputId) {
        this.input = document.getElementById(inputId);
        this.output = document.getElementById(outputId);
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentDirectory = 'C:\\WINTER';

        this.commands = {
            help: this.cmdHelp.bind(this),
            clear: this.cmdClear.bind(this),
            cls: this.cmdClear.bind(this),
            dir: this.cmdDir.bind(this),
            ls: this.cmdDir.bind(this),
            echo: this.cmdEcho.bind(this),
            date: this.cmdDate.bind(this),
            time: this.cmdTime.bind(this),
            ver: this.cmdVersion.bind(this),
            snow: this.cmdSnow.bind(this),
            wind: this.cmdWind.bind(this),
            about: this.cmdAbout.bind(this),
            credits: this.cmdCredits.bind(this),
            tree: this.cmdTree.bind(this),
            sysinfo: this.cmdSysinfo.bind(this),
            matrix: this.cmdMatrix.bind(this),
            winter: this.cmdWinter.bind(this),
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.focus();

        // Refocus input when clicking in terminal
        document.getElementById('terminal-window').addEventListener('click', () => {
            this.input.focus();
        });
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.input.value.trim();

            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command);
            } else {
                this.addLine('');
            }

            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        }
    }

    executeCommand(commandLine) {
        this.addLine(`C:\\> ${commandLine}`);

        const parts = commandLine.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.addLine(`'${command}' is not recognized as an internal or external command.`);
            this.addLine(`Type 'help' for available commands.`);
        }

        this.addLine('');
        this.scrollToBottom();
    }

    autoComplete() {
        const input = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));

        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addLine(`C:\\> ${input}`);
            this.addLine(matches.join('  '));
            this.addLine('');
        }
    }

    addLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
    }

    typeText(text, callback) {
        let i = 0;
        const line = document.createElement('div');
        line.className = 'terminal-line';
        this.output.appendChild(line);

        const interval = setInterval(() => {
            if (i < text.length) {
                line.textContent += text[i];
                i++;
                this.scrollToBottom();
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 30);
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    // Command implementations
    cmdHelp(args) {
        this.addLine('Available commands:');
        this.addLine('');
        this.addLine('  help       - Display this help message');
        this.addLine('  clear/cls  - Clear the terminal screen');
        this.addLine('  dir/ls     - List directory contents');
        this.addLine('  echo       - Display a message');
        this.addLine('  date       - Display current date');
        this.addLine('  time       - Display current time');
        this.addLine('  ver        - Display system version');
        this.addLine('  snow       - Control snow intensity (0-500)');
        this.addLine('  wind       - Control wind speed (-2 to 2)');
        this.addLine('  about      - Display about information');
        this.addLine('  credits    - Show credits');
        this.addLine('  tree       - Display directory tree');
        this.addLine('  sysinfo    - Display system information');
        this.addLine('  matrix     - Enter the matrix...');
        this.addLine('  winter     - Display winter ASCII art');
    }

    cmdClear(args) {
        this.output.innerHTML = '';
    }

    cmdDir(args) {
        this.addLine(` Directory of ${this.currentDirectory}`);
        this.addLine('');
        this.addLine(' [DIR]   DOCUMENTS');
        this.addLine(' [DIR]   SYSTEM');
        this.addLine(' [DIR]   PROGRAMS');
        this.addLine('         README.TXT          1,024 bytes');
        this.addLine('         AUTOEXEC.BAT          256 bytes');
        this.addLine('         WINTER.MID          4,096 bytes');
        this.addLine('');
        this.addLine('         3 directories, 3 files');
    }

    cmdEcho(args) {
        this.addLine(args.join(' '));
    }

    cmdDate(args) {
        const date = new Date().toLocaleDateString();
        this.addLine(`Current date: ${date}`);
    }

    cmdTime(args) {
        const time = new Date().toLocaleTimeString();
        this.addLine(`Current time: ${time}`);
    }

    cmdVersion(args) {
        this.addLine('Winter Retro OS [Version 1.0.0]');
        this.addLine('(c) 1995-2025 Winter Corporation. All rights reserved.');
    }

    cmdSnow(args) {
        if (args.length === 0) {
            this.addLine('Usage: snow <amount>');
            this.addLine('Set snow particle count (0-500)');
            return;
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 0 || amount > 500) {
            this.addLine('Error: Amount must be between 0 and 500');
            return;
        }

        if (window.snowEngine) {
            window.snowEngine.setParticleCount(amount);
            this.addLine(`Snow intensity set to ${amount} particles`);
        }
    }

    cmdWind(args) {
        if (args.length === 0) {
            this.addLine('Usage: wind <speed>');
            this.addLine('Set wind speed (-2 to 2)');
            return;
        }

        const speed = parseFloat(args[0]);
        if (isNaN(speed) || speed < -2 || speed > 2) {
            this.addLine('Error: Speed must be between -2 and 2');
            return;
        }

        if (window.snowEngine) {
            window.snowEngine.setWind(speed);
            this.addLine(`Wind speed set to ${speed}`);
        }
    }

    cmdAbout(args) {
        this.addLine('Winter Retro OS - A nostalgic journey to the 90s');
        this.addLine('');
        this.addLine('Features:');
        this.addLine('  - Advanced snow particle system');
        this.addLine('  - CRT monitor effects');
        this.addLine('  - Draggable windows');
        this.addLine('  - Interactive terminal');
        this.addLine('  - Retro aesthetics');
    }

    cmdCredits(args) {
        this.addLine('=== WINTER RETRO OS CREDITS ===');
        this.addLine('');
        this.addLine('Developed with:');
        this.addLine('  HTML5 Canvas API');
        this.addLine('  Modern JavaScript ES6+');
        this.addLine('  CSS3 Animations');
        this.addLine('');
        this.addLine('Special thanks to:');
        this.addLine('  The 90s for inspiration');
        this.addLine('  Snow for being beautiful');
        this.addLine('  You for visiting!');
    }

    cmdTree(args) {
        this.addLine('C:\\WINTER');
        this.addLine('│');
        this.addLine('├── DOCUMENTS');
        this.addLine('│   ├── LETTERS');
        this.addLine('│   └── REPORTS');
        this.addLine('│');
        this.addLine('├── SYSTEM');
        this.addLine('│   ├── CONFIG.SYS');
        this.addLine('│   └── DRIVERS');
        this.addLine('│');
        this.addLine('└── PROGRAMS');
        this.addLine('    ├── GAMES');
        this.addLine('    └── TOOLS');
    }

    cmdSysinfo(args) {
        this.addLine('=== SYSTEM INFORMATION ===');
        this.addLine('');
        this.addLine(`OS Name:           Winter Retro OS`);
        this.addLine(`Version:           1.0.0`);
        this.addLine(`System Type:       Web-based OS`);
        this.addLine(`Processor:         ${navigator.hardwareConcurrency || 'Unknown'} cores`);
        this.addLine(`Browser:           ${navigator.userAgent.split(' ').pop()}`);
        this.addLine(`Screen Resolution: ${window.innerWidth}x${window.innerHeight}`);
        this.addLine(`Language:          ${navigator.language}`);
        this.addLine(`Online Status:     ${navigator.onLine ? 'Online' : 'Offline'}`);
    }

    cmdMatrix(args) {
        this.addLine('Wake up, Neo...');
        setTimeout(() => {
            this.addLine('The Matrix has you...');
        }, 1000);
        setTimeout(() => {
            this.addLine('Follow the white rabbit.');
        }, 2000);
        setTimeout(() => {
            this.addLine('');
            this.addLine('Knock, knock, Neo.');
        }, 3000);
    }

    cmdWinter(args) {
        this.addLine('');
        this.addLine('    ╔════════════════════════════════════╗');
        this.addLine('    ║                                    ║');
        this.addLine('    ║     ❄️  WINTER RETRO OS  ❄️      ║');
        this.addLine('    ║                                    ║');
        this.addLine('    ║        *    .  *       *           ║');
        this.addLine('    ║     *       *     *  .             ║');
        this.addLine('    ║   .   *   ❄️   *     *            ║');
        this.addLine('    ║        *    .     *    .           ║');
        this.addLine('    ║   *  .    *    .    *              ║');
        this.addLine('    ║                                    ║');
        this.addLine('    ║   Stay cozy, stay retro!  ☃️       ║');
        this.addLine('    ║                                    ║');
        this.addLine('    ╚════════════════════════════════════╝');
        this.addLine('');
    }
}
