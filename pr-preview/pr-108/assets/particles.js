(() => {
  const canvas = document.getElementById("particle-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const root = document.documentElement;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fallbackColors = ["#b4befe", "#cba6f7", "#cdd6f4"];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let animationId = null;
  let lastTime = 0;

  const random = (min, max) => Math.random() * (max - min) + min;

  const readThemeColors = () => {
    const rootStyles = getComputedStyle(root);
    const names = [
      "--primary",
      "--accent",
      "--accent-primary",
      "--accent-secondary",
      "--link",
      "--link-hover",
      "--green",
      "--cyan",
      "--blue",
      "--lavender",
      "--text"
    ];

    const colors = names
      .map((name) => rootStyles.getPropertyValue(name).trim())
      .filter(Boolean)
      .map(toRgb)
      .filter(Boolean);

    return colors.length ? colors : fallbackColors.map(toRgb).filter(Boolean);
  };

  const toRgb = (color) => {
    const value = color.trim();
    const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      let raw = hex[1];
      if (raw.length === 3) {
        raw = raw.split("").map((char) => char + char).join("");
      }
      const intValue = parseInt(raw, 16);
      return {
        r: (intValue >> 16) & 255,
        g: (intValue >> 8) & 255,
        b: intValue & 255
      };
    }

    const rgb = value.match(/^rgba?\(([^)]+)\)$/i);
    if (rgb) {
      const parts = rgb[1].split(",").map((part) => Number.parseFloat(part.trim()));
      if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
        return { r: parts[0], g: parts[1], b: parts[2] };
      }
    }

    return null;
  };

  let themeColors = readThemeColors();

  const rgba = (color, alpha) => `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

  const getParticleCount = () => {
    if (reducedMotionQuery.matches) return Math.min(18, Math.max(10, Math.round(width / 90)));
    return width <= 700 ? Math.round(random(38, 48)) : Math.round(random(76, 96));
  };

  const createParticle = (fromBottom = true) => {
    const size = random(2, width <= 700 ? 4.6 : 6);
    return {
      x: random(0, width),
      y: fromBottom ? random(height + size, height + height * 0.32) : random(0, height),
      size,
      speed: reducedMotionQuery.matches ? random(1.5, 4) : random(8, 24),
      drift: reducedMotionQuery.matches ? random(-2, 2) : random(-8, 8),
      phase: random(0, Math.PI * 2),
      phaseSpeed: random(0.35, 0.9),
      opacity: random(0.25, 0.62),
      glow: random(3.8, 6.8),
      color: themeColors[Math.floor(random(0, themeColors.length))]
    };
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const targetCount = getParticleCount();
    if (particles.length > targetCount) {
      particles = particles.slice(0, targetCount);
    }
    while (particles.length < targetCount) {
      particles.push(createParticle(false));
    }
  };

  const respawn = (particle) => {
    Object.assign(particle, createParticle(true));
    particle.y = random(height + particle.size, height + 72);
  };

  const drawParticle = (particle) => {
    const progress = Math.max(0, Math.min(1, 1 - particle.y / height));
    const edgeFade = Math.sin(progress * Math.PI);
    const alpha = particle.opacity * Math.max(0.18, edgeFade);
    const glowRadius = particle.size * particle.glow;

    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      glowRadius
    );
    gradient.addColorStop(0, rgba(particle.color, alpha));
    gradient.addColorStop(0.35, rgba(particle.color, alpha * 0.28));
    gradient.addColorStop(1, rgba(particle.color, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = rgba(particle.color, alpha * 0.82);
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  };

  const animate = (time = 0) => {
    const delta = Math.min((time - lastTime) / 1000 || 0, 0.05);
    lastTime = time;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.phase += particle.phaseSpeed * delta;
      particle.y -= particle.speed * delta;
      particle.x += (particle.drift + Math.sin(particle.phase) * 9) * delta;

      if (particle.x < -particle.size * particle.glow) particle.x = width + particle.size;
      if (particle.x > width + particle.size * particle.glow) particle.x = -particle.size;
      if (particle.y < -particle.size * particle.glow) respawn(particle);

      drawParticle(particle);
    });

    animationId = window.requestAnimationFrame(animate);
  };

  const restart = () => {
    themeColors = readThemeColors();
    particles = [];
    resize();
    if (animationId) window.cancelAnimationFrame(animationId);
    lastTime = 0;
    animationId = window.requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize, { passive: true });

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", restart);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(restart);
  }

  restart();
})();
