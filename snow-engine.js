/**
 * SnowEngine Class
 * Handles advanced Canvas snow animation with physics simulation
 */
class SnowEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 200;
        this.wind = 0;
        this.windChangeRate = 0.001;
        this.targetWind = 0;

        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(reset = false) {
        const size = Math.random() * 3 + 1;
        const x = reset ? Math.random() * this.width : Math.random() * this.width;
        const y = reset ? -10 : Math.random() * this.height;

        return {
            x: x,
            y: y,
            size: size,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.6 + 0.4,
            swing: Math.random() * 0.5,
            swingSpeed: Math.random() * 0.01 + 0.005,
            angle: Math.random() * Math.PI * 2,
            blur: Math.random() * 2,
            depth: Math.random() // For parallax effect
        };
    }

    updateParticle(particle) {
        // Swing motion (sinusoidal movement)
        particle.angle += particle.swingSpeed;
        particle.x += Math.sin(particle.angle) * particle.swing;

        // Apply wind effect
        particle.x += this.wind * particle.depth;

        // Gravity and base speed
        particle.y += particle.speedY * (0.5 + particle.depth * 0.5);
        particle.x += particle.speedX;

        // Reset particle when it goes off screen
        if (particle.y > this.height + 10) {
            const newParticle = this.createParticle(true);
            Object.assign(particle, newParticle);
        }

        if (particle.x > this.width + 10) {
            particle.x = -10;
        } else if (particle.x < -10) {
            particle.x = this.width + 10;
        }
    }

    updateWind() {
        // Smoothly transition wind to target
        this.wind += (this.targetWind - this.wind) * 0.01;

        // Randomly change wind direction
        if (Math.random() < 0.01) {
            this.targetWind = (Math.random() - 0.5) * 2;
        }
    }

    drawParticle(particle) {
        this.ctx.save();

        // Create glow effect for larger particles
        if (particle.size > 2) {
            this.ctx.shadowBlur = 10 * particle.depth;
            this.ctx.shadowColor = `rgba(255, 255, 255, ${particle.opacity * 0.5})`;
        }

        // Draw particle with opacity and blur
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = '#ffffff';

        // Draw as circle for snowflake
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Add slight blur effect for depth
        if (particle.blur > 0.5) {
            this.ctx.globalAlpha = particle.opacity * 0.3;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size + 1, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    render() {
        // Clear canvas with slight trail effect for motion blur
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Update and draw all particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
    }

    animate() {
        this.updateWind();
        this.render();
        requestAnimationFrame(() => this.animate());
    }

    // Public methods for external control
    setParticleCount(count) {
        this.particleCount = count;
        this.init();
    }

    setWind(windSpeed) {
        this.targetWind = windSpeed;
    }

    addBurst(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle();
            particle.x = x;
            particle.y = y;
            particle.speedX = (Math.random() - 0.5) * 3;
            particle.speedY = Math.random() * 2;
            this.particles.push(particle);
        }

        // Remove excess particles
        if (this.particles.length > this.particleCount + 100) {
            this.particles.splice(0, this.particles.length - this.particleCount);
        }
    }
}
