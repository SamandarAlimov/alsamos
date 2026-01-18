import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Rocket, Brain, Globe2, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { VideoModal } from "@/components/VideoModal";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface Node {
  x: number;
  y: number;
  icon: string;
  scale: number;
  rotation: number;
  rotationSpeed: number;
}

export const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { t } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let nodes: Node[] = [];
    let time = 0;
    let lastFrameTime = 0;
    const targetFPS = 30; // Throttle to 30 FPS for performance
    const frameInterval = 1000 / targetFPS;

    const colors = ["#f26c21", "#22d3ee", "#00b3ff", "#ff8b4d", "#ffffff"];
    const nodeIcons = ["⚡", "🚀", "🤖", "🧬", "🌍", "💡", "🔬", "🛸"];

    // Detect mobile device
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles();
      initNodes();
    };

    const initParticles = () => {
      particles = [];
      // Reduce particle count based on device
      let maxParticles = 150;
      if (isMobile) maxParticles = 40;
      else if (isTablet) maxParticles = 80;
      
      const count = Math.min(maxParticles, Math.floor((window.innerWidth * window.innerHeight) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2.5 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.008,
        });
      }
    };

    const initNodes = () => {
      nodes = [];
      const nodeCount = 8;
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
        nodes.push({
          x: window.innerWidth / 2 + Math.cos(angle) * radius,
          y: window.innerHeight / 2 + Math.sin(angle) * radius * 0.6,
          icon: nodeIcons[i % nodeIcons.length],
          scale: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    };

    const animate = (currentTime: number) => {
      // Throttle frame rate
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime - (elapsed % frameInterval);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      time += 0.01;

      // Draw gradient background glow
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const gradient = ctx.createRadialGradient(
        centerX + mousePosRef.current.x * 0.05,
        centerY + mousePosRef.current.y * 0.05,
        0,
        centerX,
        centerY,
        window.innerWidth * 0.6
      );
      gradient.addColorStop(0, "rgba(242, 108, 33, 0.15)");
      gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and draw particles
      particles.forEach((p, i) => {
        // Mouse interaction
        if (isHoveringRef.current) {
          const dx = mousePosRef.current.x - p.x;
          const dy = mousePosRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const force = (200 - dist) / 200;
            p.vx += (dx / dist) * force * 0.02;
            p.vy += (dy / dist) * force * 0.02;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Boundary bounce
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -0.9;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -0.9;

        // Keep in bounds
        p.x = Math.max(0, Math.min(window.innerWidth, p.x));
        p.y = Math.max(0, Math.min(window.innerHeight, p.y));

        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        const pulseSize = p.size * (1 + Math.sin(p.pulse) * 0.3);
        const pulseOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);

        // Draw particle with glow
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulseOpacity;
        ctx.fill();
        ctx.restore();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, p2.color);
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = (1 - dist / 180) * 0.25;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw orbital nodes
      nodes.forEach((node, i) => {
        node.rotation += node.rotationSpeed;
        
        // Orbit animation
        const orbitX = Math.sin(time + i) * 20;
        const orbitY = Math.cos(time + i) * 10;
        
        const x = node.x + orbitX;
        const y = node.y + orbitY;
        
        // Draw node glow
        ctx.save();
        const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
        nodeGradient.addColorStop(0, "rgba(242, 108, 33, 0.3)");
        nodeGradient.addColorStop(1, "rgba(242, 108, 33, 0)");
        ctx.fillStyle = nodeGradient;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node circle
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "rgba(242, 108, 33, 0.2)";
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw icon
        ctx.globalAlpha = 1;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.icon, x, y);
        ctx.restore();

        // Connect nodes to center
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(centerX, centerY);
        ctx.strokeStyle = "rgba(242, 108, 33, 0.1)";
        ctx.globalAlpha = 0.5;
        ctx.setLineDash([5, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw center orb
      ctx.save();
      const orbGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
      orbGradient.addColorStop(0, "rgba(242, 108, 33, 0.4)");
      orbGradient.addColorStop(0.5, "rgba(242, 108, 33, 0.1)");
      orbGradient.addColorStop(1, "rgba(242, 108, 33, 0)");
      ctx.fillStyle = orbGradient;
      ctx.globalAlpha = 0.8 + Math.sin(time * 2) * 0.2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80 + Math.sin(time * 2) * 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const stats = [
    { value: "100+", label: t("stats.industries"), icon: <Globe2 className="w-5 h-5" /> },
    { value: "50M+", label: t("stats.users"), icon: <Zap className="w-5 h-5" /> },
    { value: "180+", label: t("stats.countries"), icon: <Rocket className="w-5 h-5" /> },
    { value: "$500B+", label: t("stats.assets"), icon: <Brain className="w-5 h-5" /> },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => { isHoveringRef.current = true; }}
      onMouseLeave={() => { isHoveringRef.current = false; }}
    >
      {/* Particle Canvas */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ background: "transparent" }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-[1]" />

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6"
          >
            <span className="text-foreground">ALSAMOS</span>
            <br />
            <motion.span 
              className="gradient-text inline-block"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {t("hero.title")}
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-10 px-2"
          >
            {t("hero.subtitle")}
            <br className="hidden sm:block" />
            {t("hero.subtitle2")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl glow-primary group"
            >
              <Link to="/investors">
                {t("hero.cta_investor")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-xl border-border hover:bg-accent hover:border-primary/50 transition-all"
            >
              <Link to="/industries">
                {t("hero.cta_explore")}
              </Link>
            </Button>
          </motion.div>

          {/* Video Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="group inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <motion.span 
                className="w-14 h-14 rounded-full bg-surface-soft border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </motion.span>
              <span className="text-sm font-medium">{t("hero.watch_story")}</span>
            </button>
          </motion.div>

          {/* Video Modal */}
          <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        </div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 sm:mt-20 lg:mt-32"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl text-center cursor-default group"
              >
                <div className="flex justify-center mb-2 sm:mb-3 text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                  {stat.icon}
                </div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text mb-0.5 sm:mb-1">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-primary drop-shadow-lg" />
        </motion.div>
      </motion.div>
    </section>
  );
};
