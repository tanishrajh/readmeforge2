import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

export default function AntigravityBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let particlesArray = [];
    let animationFrameId;
    let time = 0;

    const mouse = {
      x: null,
      y: null,
      radius: 200 // Slightly larger radius for gradient effect
    };

    // Make canvas full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);
    
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseout', handleMouseLeave);

    const codeSymbols = ['{ }', '< />', '[ ]', '()', '=>', ';', '#', '*', '&&', '||'];
    
    const isDark = theme !== 'light';
    const baseColor = isDark ? 'rgba(249, 243, 239, 0.15)' : 'rgba(27, 60, 83, 0.2)';
    const pulseColor = isDark ? 'rgba(111, 168, 201, 0.7)' : 'rgba(27, 60, 83, 0.75)';

    // Gradient colors for mouse proximity
    const getMouseGradient = (distance, maxDistance, timeOffset) => {
      // Create a shifting vibrant hue around the mouse
      const hue = ((timeOffset / 2) + (distance / maxDistance) * 150) % 360;
      const opacity = Math.max(0.4, 1 - Math.pow(distance / maxDistance, 1.2));
      return `hsla(${hue}, 90%, ${isDark ? '75%' : '30%'}, ${opacity})`;
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 4 + 4; // Really small, almost dot-like
        this.text = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        this.density = (Math.random() * 20) + 1;
        this.seed = Math.random() * 1000;
        this.color = baseColor;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px 'JetBrains Mono', monospace`;
        ctx.fillText(this.text, this.x, this.y);
      }

      returnToBase() {
        // Light movements in resting state (orbiting around base position)
        let targetX = this.baseX + Math.sin(time / 60 + this.seed) * 8;
        let targetY = this.baseY + Math.cos(time / 60 + this.seed) * 8;
        
        if (Math.abs(this.x - targetX) > 0.1) {
          this.x -= (this.x - targetX) / 15;
        }
        if (Math.abs(this.y - targetY) > 0.1) {
          this.y -= (this.y - targetY) / 15;
        }
      }

      update() {
        let distanceToMouse = Infinity;
        if (mouse.x != null && mouse.y != null) {
          // Calculate distance between mouse and particle
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          distanceToMouse = Math.sqrt(dx * dx + dy * dy);

          if (distanceToMouse < mouse.radius) {
            // Push particles away (antigravity)
            let maxDistance = mouse.radius;
            let force = (maxDistance - distanceToMouse) / maxDistance;
            let forceDirectionX = dx / distanceToMouse;
            let forceDirectionY = dy / distanceToMouse;
            
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
          } else {
            // Return to dynamic base position smoothly
            this.returnToBase();
          }
        } else {
           // Return to dynamic base position smoothly when mouse is absent
           this.returnToBase();
        }

        // Color and Light Logic
        if (distanceToMouse < mouse.radius) {
          this.color = getMouseGradient(distanceToMouse, mouse.radius, time);
        } else {
          // Pulse logic: horizontal/diagonal wave moving across
          let wave = Math.sin((this.baseX / 200) + (this.baseY / 150) - (time / 40));
          let pulseThreshold = 0.96; // Only strict peaks of the wave will trigger a pulse
          if (wave > pulseThreshold) { 
             this.color = pulseColor;
          } else {
             this.color = baseColor;
          }
        }
      }
    }

    function init() {
      particlesArray = [];
      // Increased count for denser field
      const numberOfParticles = Math.min((canvas.width * canvas.height) / 4000, 500); 
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
      }
    }

    function animate() {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    // Set initial size and start
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-initialize when theme changes to update particle colors

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1, // Placed behind hero content
      }}
    />
  );
}
