/**
 * AI Research Lab - Particles, Parallax & Reveals
 * Performance-optimized animations
 */

document.addEventListener("DOMContentLoaded", () => {
    initNeuralMesh();
    initParallax();
    initStaggerReveals();
    initMagneticButtons();
    initTextScramble();
});

function initNeuralMesh() {
    const canvas = document.getElementById("neuralMesh");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let w, h, particles;
    let animationFrameId;

    // Configuration for premium feel and high visibility
    const config = {
        particleCount: window.innerWidth < 768 ? 45 : 95,
        connectionDist: 170, // Increased for more connections
        baseSpeedY: -0.32,
        baseSpeedX: 0.1,
        // Dark Mode: Emerald/Teal glow
        colorDark: "52, 230, 194",
        // Light Mode: Deep Sapphire for ultra-high contrast on white bg
        colorLight: "20, 50, 180",
        mouseRadius: 220
    };

    const mouse = { x: -1000, y: -1000 };

    // Dynamic contrast overlay to ensure premium visibility
    let overlay = document.querySelector('.hero-overlay');
    if (!overlay && canvas.parentElement) {
        overlay = document.createElement('div');
        overlay.className = 'hero-overlay';
        canvas.parentElement.insertBefore(overlay, canvas.nextSibling);

        Object.assign(overlay.style, {
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            zIndex: '0',
            opacity: '0.6',
            background: 'radial-gradient(circle at center, transparent 30%, var(--bg) 100%)'
        });
    }

    window.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * w;
            this.y = initial ? Math.random() * h : h + 20;
            this.z = Math.random() * 0.8 + 0.2;

            this.size = (Math.random() * 2.2 + 0.8) * this.z; // Slightly larger nodes
            this.vx = (Math.random() - 0.5) * 0.4 * this.z;
            this.vy = (config.baseSpeedY * this.z) * 1.1 + (Math.random() - 0.5) * 0.08;

            this.opacity = (Math.random() * 0.5 + 0.3) * this.z; // Stronger base opacity
            this.pulseBias = Math.random() * Math.PI;
        }

        update() {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < config.mouseRadius) {
                const force = (config.mouseRadius - dist) / config.mouseRadius;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force * 0.1;
                this.vy += Math.sin(angle) * force * 0.1;
            }

            this.vx *= 0.94;
            this.x += this.vx + Math.sin(this.y * 0.005) * 0.15 * this.z;
            this.y += this.vy;
            this.pulseBias += 0.035;

            if (this.y < -50) this.reset();
            if (this.x < -50 || this.x > w + 50) this.reset();
        }

        draw() {
            const isLight = document.documentElement.getAttribute("data-theme") === "light";
            const color = isLight ? config.colorLight : config.colorDark;
            const pulse = this.opacity + Math.sin(this.pulseBias) * 0.25;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${Math.max(0.15, pulse)})`;

            // Layered Glow
            ctx.shadowBlur = isLight ? this.size * 5 : this.size * 12;
            ctx.shadowColor = `rgba(${color}, ${pulse})`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        w = rect.width;
        h = rect.height;
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const color = isLight ? config.colorLight : config.colorDark;

        // HIGH VISIBILITY: Thicker Lines
        ctx.lineWidth = isLight ? 1.4 : 0.8;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;
                const thresholdSq = config.connectionDist * config.connectionDist;

                if (distSq < thresholdSq) {
                    const alpha = (1 - distSq / thresholdSq) * p.opacity * p2.opacity;
                    if (alpha > 0.05) {
                        ctx.beginPath();
                        // Never faint: minimum alpha floor + 2.5x boost
                        const finalAlpha = Math.max(0.12, Math.min(1, alpha * 2.5));
                        ctx.strokeStyle = `rgba(${color}, ${finalAlpha})`;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    const observer = new ResizeObserver(() => {
        resize();
    });
    if (canvas.parentElement) {
        observer.observe(canvas.parentElement);
    }

    init();
    animate();
}

function initParallax() {
    const parallaxWraps = document.querySelectorAll('.parallax-wrap');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        parallaxWraps.forEach(wrap => {
            const img = wrap.querySelector('img');
            if (!img) return;

            const speed = 0.12;
            const rect = wrap.getBoundingClientRect();
            const offset = rect.top + scrollY;
            const visible = rect.top < window.innerHeight && rect.bottom > 0;

            if (visible) {
                const yPos = (scrollY - offset) * speed;
                img.style.transform = `translateY(${yPos}px) scale(1.15)`;
            }
        });
    }, { passive: true });
}

function initStaggerReveals() {
    const containers = document.querySelectorAll('.grid-3, .team-grid, .blog-grid, .hero-actions');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('in');
                        child.style.opacity = "1";
                        child.style.transform = "translateY(0)";
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    containers.forEach(c => {
        Array.from(c.children).forEach(child => {
            child.style.opacity = "0";
            child.style.transform = "translateY(20px)";
            child.style.transition = "all 0.6s cubic-bezier(0.2, 0.9, 0.2, 1)";
        });
        observer.observe(c);
    });
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('[data-magnetic]');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Subtle movement: max 10px translate
            btn.style.transition = 'none';
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'all 0.4s var(--ease)';
            btn.style.transform = `translate(0, 0)`;
        });
    });
}

function initTextScramble() {
    const elements = document.querySelectorAll('[data-scramble]');
    const chars = '!<>-_\\/[]{}—=+*^?#________';

    class TextScramble {
        constructor(el) {
            this.el = el;
            this.update = this.update.bind(this);
            this.originalContent = el.innerHTML;
            // Extract the actual text content but keep track of HTML tags if necessary.
            // For simplicity and speed, we'll scramble the visible text.
            this.text = el.innerText;
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char" style="opacity:0.5">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                // Restore original HTML to preserve gradients/spans
                this.el.innerHTML = this.originalContent;
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return chars[Math.floor(Math.random() * chars.length)];
        }
    }

    elements.forEach(el => {
        const fx = new TextScramble(el);
        const originalText = el.innerText;
        // Start scramble on load
        fx.setText(originalText);
    });
}
