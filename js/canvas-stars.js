/* ==========================================================================
   STARRY NIGHT BACKGROUND - HTML5 CANVAS
   ========================================================================== */

(function() {
  const canvas = document.getElementById('starry-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const stars = [];
  const shootingStars = [];
  const starCount = Math.min(150, Math.floor((width * height) / 8000));

  // Mouse interactivity variables
  let mouse = { x: null, y: null, active: false };

  class Star {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // initial spread
    }

    reset() {
      this.x = Math.random() * width;
      this.y = 0;
      this.size = Math.random() * 1.5 + 0.5;
      this.baseAlpha = Math.random() * 0.5 + 0.3;
      this.alpha = this.baseAlpha;
      this.speed = Math.random() * 0.05 + 0.01;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.twinkleFactor = Math.random() * Math.PI;
    }

    update() {
      // Drift slowly downwards
      this.y += this.speed;
      if (this.y > height) {
        this.reset();
      }

      // Twinkle alpha pulse
      this.twinkleFactor += this.twinkleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.twinkleFactor) * 0.25;
      if (this.alpha < 0.1) this.alpha = 0.1;
      if (this.alpha > 1) this.alpha = 1;
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width * 0.8;
      this.y = Math.random() * height * 0.4;
      this.length = Math.random() * 80 + 40;
      this.speed = Math.random() * 10 + 6;
      this.angle = Math.PI / 6 + Math.random() * (Math.PI / 12); // around 30-45 degrees down-right
      this.active = true;
      this.alpha = 1;
      this.fadeSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      if (!this.active) return;
      
      const dx = Math.cos(this.angle) * this.speed;
      const dy = Math.sin(this.angle) * this.speed;
      
      this.x += dx;
      this.y += dy;
      
      this.alpha -= this.fadeSpeed;
      if (this.alpha <= 0 || this.x > width || this.y > height) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;

      const endX = this.x - Math.cos(this.angle) * this.length;
      const endY = this.y - Math.sin(this.angle) * this.length;

      // Draw shooting star tail gradient
      const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 107, 139, ${this.alpha})`);
      grad.addColorStop(0.3, `rgba(255, 142, 83, ${this.alpha * 0.7})`);
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.random() * 1.5 + 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }

  // Initialize Stars
  function init() {
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and Draw Twinkling Stars
    stars.forEach(star => {
      star.update();
      
      // If mouse is near, add a small subtle parallax drift
      if (mouse.active) {
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          star.x -= dx * force * 0.03;
          star.y -= dy * force * 0.03;
        }
      }
      
      star.draw();
    });

    // Randomly spawn a shooting star
    if (Math.random() < 0.008 && shootingStars.length < 3) {
      // Find inactive shooting star or create new
      const inactiveStar = shootingStars.find(s => !s.active);
      if (inactiveStar) {
        inactiveStar.reset();
      } else {
        shootingStars.push(new ShootingStar());
      }
    }

    // Update and Draw Shooting Stars
    shootingStars.forEach(s => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(animate);
  }

  // Resize Handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
  });

  // Track Mouse movement
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Launch
  init();
  animate();
})();
