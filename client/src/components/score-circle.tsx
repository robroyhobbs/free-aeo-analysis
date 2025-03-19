import { useEffect, useState } from "react";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function ScoreCircle({ 
  score, 
  size = "lg", 
  animated = true,
  className = "" 
}: ScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Size configurations
  const sizeConfig = {
    sm: { width: 100, height: 100, radius: 40, fontSize: 20, subtextSize: 10 },
    md: { width: 140, height: 140, radius: 48, fontSize: 24, subtextSize: 11 },
    lg: { width: 180, height: 180, radius: 54, fontSize: 28, subtextSize: 12 }
  };
  
  // Get configuration based on size prop
  const config = sizeConfig[size];
  
  // Calculate the stroke-dashoffset based on the score
  const circumference = 2 * Math.PI * config.radius;
  const initialDashoffset = circumference;
  const [dashoffset, setDashoffset] = useState(initialDashoffset);
  
  // Score category and color
  const getScoreCategory = (value: number) => {
    if (value >= 90) return { label: "Excellent", color: "#10b981" };
    if (value >= 75) return { label: "Very Good", color: "#3b82f6" };
    if (value >= 60) return { label: "Good", color: "#6366f1" };
    if (value >= 40) return { label: "Average", color: "#f59e0b" };
    if (value >= 20) return { label: "Poor", color: "#f97316" };
    return { label: "Critical", color: "#ef4444" };
  };
  
  const scoreInfo = getScoreCategory(score);
  
  // Animation effect when component mounts or score changes
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      setDashoffset(circumference - (score / 100) * circumference);
      return;
    }
    
    setIsAnimating(true);
    
    // Animate the score counter
    let start = 0;
    const duration = 1500; // milliseconds
    const startTime = Date.now();
    
    const animateScore = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Use easing function for smoother animation
      // Cubic easing out function
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOut(progress);
      
      // Update display score
      const currentScore = Math.round(easedProgress * score);
      setDisplayScore(currentScore);
      
      // Update circle dash offset for progress visualization
      const newDashoffset = initialDashoffset - (easedProgress * score / 100) * circumference;
      setDashoffset(newDashoffset);
      
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        setIsAnimating(false);
      }
    };
    
    // Start animation
    requestAnimationFrame(animateScore);
    
    // Cleanup
    return () => {
      setIsAnimating(false);
    };
  }, [score, animated, circumference, initialDashoffset]);
  
  // Dynamic styles based on score
  const getGradientColors = () => {
    if (score >= 80) return { start: "#10b981", end: "#059669" }; // Green
    if (score >= 60) return { start: "#3b82f6", end: "#2563eb" }; // Blue
    if (score >= 40) return { start: "#f59e0b", end: "#d97706" }; // Amber
    return { start: "#ef4444", end: "#dc2626" }; // Red
  };
  
  const gradientColors = getGradientColors();
  
  return (
    <div className={`relative ${className}`}>
      {/* Pulsing effect for emphasized scores */}
      {score >= 80 && (
        <div className="absolute inset-0 rounded-full animate-metric-glow"></div>
      )}
      
      <svg 
        className={`w-${config.width} h-${config.height}`} 
        viewBox={`0 0 120 120`}
        style={{ filter: score >= 70 ? 'drop-shadow(0 0 6px rgba(79, 70, 229, 0.2))' : 'none' }}
      >
        {/* Particle effect dots */}
        {score > 60 && (
          <>
            <circle cx="90" cy="30" r="1.5" fill="#6366f180" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="100" cy="50" r="1" fill="#6366f180" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
            <circle cx="85" cy="85" r="1.2" fill="#6366f180" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
            <circle cx="30" cy="90" r="1" fill="#6366f180" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
            <circle cx="20" cy="40" r="1.4" fill="#6366f180" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
          </>
        )}
        
        {/* Background circle */}
        <circle 
          cx="60" 
          cy="60" 
          r={config.radius} 
          fill="none" 
          stroke="#e2e8f0" 
          strokeWidth="10"
        />
        
        {/* Animated progress circle */}
        <circle 
          cx="60" 
          cy="60" 
          r={config.radius} 
          fill="none" 
          stroke={`url(#scoreGradient-${score})`} 
          strokeWidth="10" 
          strokeDasharray={circumference} 
          strokeDashoffset={dashoffset} 
          strokeLinecap="round"
          style={{ 
            transition: animated ? 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors.start}>
              <animate 
                attributeName="stop-color" 
                values={`${gradientColors.start}; ${gradientColors.end}; ${gradientColors.start}`} 
                dur="3s" 
                repeatCount="indefinite" 
              />
            </stop>
            <stop offset="100%" stopColor={gradientColors.end}>
              <animate 
                attributeName="stop-color" 
                values={`${gradientColors.end}; ${gradientColors.start}; ${gradientColors.end}`} 
                dur="3s" 
                repeatCount="indefinite" 
              />
            </stop>
          </linearGradient>
        </defs>
        
        {/* Score text with custom font/styling */}
        <text 
          x="60" 
          y="58" 
          fontSize={config.fontSize} 
          textAnchor="middle" 
          fontWeight="bold" 
          fill="#1e293b"
          className={isAnimating ? "animate-number-increment" : ""}
        >
          {displayScore}
        </text>
        
        {/* Secondary text */}
        <text x="60" y="74" fontSize={config.subtextSize} textAnchor="middle" fill="#64748b">
          out of 100
        </text>
        
        {/* Score category label */}
        <text 
          x="60" 
          y="90" 
          fontSize={config.subtextSize} 
          textAnchor="middle" 
          fontWeight="medium" 
          fill={scoreInfo.color}
          style={{ 
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.3s ease-in',
            transitionDelay: '1.2s'
          }}
        >
          {scoreInfo.label}
        </text>
      </svg>
    </div>
  );
}
