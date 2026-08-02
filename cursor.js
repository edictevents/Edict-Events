/**
 * Custom Animated Dual Cursor with Sparkles for Edict Events
 */
(function () {
  // Only disable on pure touch mobile devices (coarse pointer without fine control & small screen)
  if (window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches && window.innerWidth < 768) {
    return;
  }

  function initCustomCursor() {
    if (document.querySelector('.custom-cursor-dot')) return;

    document.body.classList.add('has-custom-cursor');

    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    
    const ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let ringX = -100, ringY = -100;
    let isHovering = false;
    let isActive = false;
    let isVisible = false;
    let lastSparkleTime = 0;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      const now = Date.now();
      if (now - lastSparkleTime > 45 && Math.random() < 0.4) {
        lastSparkleTime = now;
        createSparkle(e.clientX, e.clientY);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    const interactiveSelector = 'a, button, input, select, textarea, [role="button"], label, summary, .btn, .service-card, .flip-card, nav a, details';
    
    document.addEventListener('mouseover', function (e) {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        isHovering = true;
        dot.classList.add('hover');
        ring.classList.add('hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        isHovering = false;
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      }
    }, { passive: true });

    document.addEventListener('mousedown', function (e) {
      isActive = true;
      for (let i = 0; i < 6; i++) {
        createSparkle(e.clientX, e.clientY, true);
      }
    }, { passive: true });

    document.addEventListener('mouseup', function () {
      isActive = false;
    }, { passive: true });

    function animate() {
      // Dot follows cursor immediately
      dotX += (mouseX - dotX) * 0.8;
      dotY += (mouseY - dotY) * 0.8;

      // Ring follows cursor with smooth spring delay
      ringX += (mouseX - ringX) * 0.25;
      ringY += (mouseY - ringY) * 0.25;

      dot.style.transform = `translate3d(${dotX - 5}px, ${dotY - 5}px, 0)`;
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    function createSparkle(x, y, isBurst = false) {
      const sparkle = document.createElement('div');
      sparkle.className = 'custom-cursor-sparkle';

      const colors = ['#ff007f', '#3300fc', '#95008a', '#ff9900', '#00f0ff', '#ff00d4', '#ffd700'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = isBurst ? (Math.random() * 6 + 4) : (Math.random() * 4 + 2);

      const angle = Math.random() * Math.PI * 2;
      const distance = isBurst ? (Math.random() * 30 + 10) : (Math.random() * 12 + 4);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.backgroundColor = color;
      sparkle.style.boxShadow = `0 0 ${size + 2}px ${color}`;
      sparkle.style.setProperty('--dx', `${dx}px`);
      sparkle.style.setProperty('--dy', `${dy}px`);

      document.body.appendChild(sparkle);

      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 750);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomCursor);
  } else {
    initCustomCursor();
  }
})();
