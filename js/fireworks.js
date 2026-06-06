/* ==========================================================================
   FIREWORKS CELEBRATION CANVAS ENGINE
   ========================================================================== */

(function(global) {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const fireworks = [];
  let animationId = null;
  let autoLaunchInterval = null;

  const colors = [
    '#FF6B8B', // Pink
    '#FF8E53', // Peach
    '#FFD2A8', // Soft Gold
    '#FF4D80', // Hot Pink
    '#FF85A7', // Light Coral
    '#FFD700', // Gold
    '#FFC0CB'  // Light Pink
  ];

  class Firework {
    constructor(startX, startY, targetX, targetY) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.distance = Math.hypot(targetX - startX, targetY - startY);
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(targetY - startY, targetX - startX);
      this.speed = 3;
      this.acceleration = 1.05;
      this.brightness = Math.random() * 20 + 60;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.speed *= this.acceleration;

      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = Math.hypot(vx, vy) + this.distanceTraveled;

      if (this.distanceTraveled >= this.distance) {
        // Explode!
        createExplosion(this.targetX, this.targetY);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  class Particle {
    constructor(x, y, color, isHeart = false, angle = 0, speed = 0) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.isHeart = isHeart;
      this.coordinates = [];
      this.coordinateCount = 5;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      
      if (this.isHeart) {
        this.angle = angle;
        this.speed = speed;
      } else {
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 6 + 2;
      }
      
      this.friction = 0.95;
      this.gravity = 0.12;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.012;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.isHeart ? 2.5 : 1.5;
      ctx.globalAlpha = this.alpha;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  }

  function createExplosion(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isHeartShape = Math.random() < 0.6; // 60% chance of romantic heart-shaped firework!

    if (isHeartShape) {
      // Generate particles along a heart equation: x = 16sin^3(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
      const particleCount = 70;
      for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        // Speed and angle based on heart coordinate offset from center
        const angle = Math.atan2(heartY, heartX);
        const speed = Math.hypot(heartX, heartY) * 0.28; // scale magnitude
        
        particles.push(new Particle(x, y, color, true, angle, speed));
      }
    } else {
      // Normal radial burst
      const particleCount = 80;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color, false));
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw fireworks rockets
    let i = fireworks.length;
    while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    // Update & draw particles
    let j = particles.length;
    while (j--) {
      particles[j].draw();
      particles[j].update(j);
    }

    animationId = requestAnimationFrame(animate);
  }

  function launchFirework(targetX, targetY) {
    const startX = Math.random() * width * 0.4 + width * 0.3; // start from middle region of bottom
    const startY = height;
    fireworks.push(new Firework(startX, startY, targetX, targetY));
  }

  // API exposed globally
  global.celebrationFireworks = {
    start: function() {
      if (animationId) return;
      
      // Start requestAnimationFrame loop
      animate();

      // Launch automated fireworks periodically
      autoLaunchInterval = setInterval(() => {
        const targetX = Math.random() * width * 0.8 + width * 0.1;
        const targetY = Math.random() * height * 0.5 + height * 0.1;
        launchFirework(targetX, targetY);
      }, 900);

      // Bind click launches
      window.addEventListener('click', this.clickLaunch);
    },
    
    stop: function() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      if (autoLaunchInterval) {
        clearInterval(autoLaunchInterval);
        autoLaunchInterval = null;
      }
      window.removeEventListener('click', this.clickLaunch);
      ctx.clearRect(0, 0, width, height);
      particles.length = 0;
      fireworks.length = 0;
    },

    clickLaunch: function(e) {
      // Ignore clicks on buttons/inputs/modals to avoid launching rocket behind click actions
      if (e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'INPUT' || 
          e.target.closest('.glass') ||
          e.target.closest('.lightbox-content') ||
          e.target.closest('.modal-card')) {
        return;
      }
      launchFirework(e.clientX, e.clientY);
    }
  };

  // Resize Handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

})(window);
