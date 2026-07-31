/**
 * Custom Animated Cursor with Sparkles for Edict Events
 */
(function () {
  // Respect touch devices and reduced-motion preferences
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  function initCustomCursor() {
    if (document.querySelector('.custom-cursor')) return;

    document.body.classList.add('has-custom-cursor');

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isHovering = false;
    let isActive = false;
    let isVisible = false;
    let lastSparkleTime = 0;

    // Track mouse movement
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
      }

      // Create subtle sparkle trail when moving
      const now = Date.now();
      if (now - lastSparkleTime > 40 && Math.random() < 0.35) {
        lastSparkleTime = now;
        createSparkle(e.clientX, e.clientY);
      }
    }, { passive: true });

    // Handle mouse leaving and entering window
    document.addEventListener('mouseleave', function () {
      isVisible = false;
      cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;
      cursor.style.opacity = '1';
    });

    // Interactive elements hover detector
    const interactiveSelector = 'a, button, input, select, textarea, [role="button"], label, summary, .btn, .card, nav a';
    
    document.addEventListener('mouseover', function (e) {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        isHovering = true;
        cursor.classList.add('hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        isHovering = false;
        cursor.classList.remove('hover');
      }
    }, { passive: true });

    // Click press feedback & star particle burst
    document.addEventListener('mousedown', function (e) {
      isActive = true;
      for (let i = 0; i < 7; i++) {
        createSparkle(e.clientX, e.clientY, true);
      }
    }, { passive: true });

    document.addEventListener('mouseup', function () {
      isActive = false;
    }, { passive: true });

    // High performance animation frame
    function animate() {
      // Smooth spring interpolation
      cursorX += (mouseX - cursorX) * 0.45;
      cursorY += (mouseY - cursorY) * 0.45;

      const scale = isHovering ? 'scale(1.25)' : (isActive ? 'scale(0.92)' : 'scale(1)');
      // Pointer arrow tip offset (-5px x offset aligns tip perfectly with click point)
      cursor.style.transform = `translate3d(${cursorX - 5}px, ${cursorY}px, 0) ${scale}`;

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Sparkle generator
    function createSparkle(x, y, isBurst = false) {
      const sparkle = document.createElement('div');
      sparkle.className = 'custom-cursor-sparkle';

      const colors = ['#ff007f', '#3300fc', '#95008a', '#ff9900', '#00f0ff', '#ff00d4', '#ffd700'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = isBurst ? (Math.random() * 7 + 4) : (Math.random() * 5 + 3);

      const angle = Math.random() * Math.PI * 2;
      const distance = isBurst ? (Math.random() * 32 + 12) : (Math.random() * 14 + 4);
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
