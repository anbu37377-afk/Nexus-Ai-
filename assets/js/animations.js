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

    // Optimized particle count for performance
    const particleCount = 60;
    const connectionDistance = 160;
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 1,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // Theme-aware particle color
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        ctx.fillStyle = isLight ? "rgba(52, 230, 194, 0.4)" : "rgba(52, 230, 194, 0.5)";
        ctx.strokeStyle = isLight ? "rgba(93, 176, 255, 0.08)" : "rgba(93, 176, 255, 0.12)";
        ctx.lineWidth = 1;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            // Mouse interaction
            if (mouse.x && mouse.y) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x -= dx * force * 0.02;
                    p.y -= dy * force * 0.02;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.globalAlpha = 1 - (dist / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
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

