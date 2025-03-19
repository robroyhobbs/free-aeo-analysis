import React, { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number; // 0-100 score
  description?: string;
  category: string;
  animationDelay?: number;
  tooltip?: string;
  benchmark?: number; // Optional benchmark value for comparison
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  category,
  animationDelay = 0,
  tooltip,
  benchmark
}: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animateHighlight, setAnimateHighlight] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Determine color based on the score value
  const getColorClass = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200 text-green-700";
    if (score >= 60) return "bg-blue-50 border-blue-200 text-blue-700";
    if (score >= 40) return "bg-yellow-50 border-yellow-200 text-yellow-700";
    return "bg-red-50 border-red-200 text-red-700";
  };
  
  // Get badge type based on score comparison with benchmark
  const getBadgeType = () => {
    if (!benchmark) return null;
    
    const diff = value - benchmark;
    if (diff > 5) return { type: "positive", icon: <TrendingUp className="w-3 h-3" />, text: `+${diff.toFixed(0)}%` };
    if (diff < -5) return { type: "negative", icon: <TrendingDown className="w-3 h-3" />, text: `${diff.toFixed(0)}%` };
    return { type: "neutral", icon: <Minus className="w-3 h-3" />, text: "On par" };
  };
  
  const badge = getBadgeType();
  
  // Animate the card once it becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Animate the score value counting up
  useEffect(() => {
    if (!isVisible) return;
    
    const timeout = setTimeout(() => {
      setAnimateHighlight(true);
    }, animationDelay);
    
    let startValue = 0;
    const duration = 1500;
    const startTime = Date.now();
    
    const updateValue = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      setDisplayValue(Math.floor(startValue + easedProgress * (value - startValue)));
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    const animationFrame = requestAnimationFrame(updateValue);
    
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, value, animationDelay]);
  
  return (
    <div 
      ref={cardRef}
      className={`metric-card rounded-lg border p-4 ${animateHighlight ? 'animate-metric-highlight' : ''}`}
      style={{ 
        animationDelay: `${animationDelay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        transitionDelay: `${animationDelay}ms`
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="font-medium text-sm">{title}</h3>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help animate-tooltip-fade" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {badge && (
          <Badge 
            variant={badge.type === "positive" ? "success" : badge.type === "negative" ? "destructive" : "outline"}
            className={`text-xs px-1.5 py-0 h-5 animate-badge-pop`}
            style={{ animationDelay: `${animationDelay + 800}ms` }}
          >
            <span className="flex items-center gap-0.5">
              {badge.icon}
              <span>{badge.text}</span>
            </span>
          </Badge>
        )}
      </div>
      
      <div className="flex items-end gap-2 mb-2">
        <span 
          className={`text-2xl font-bold ${isVisible ? 'animate-number-increment' : ''}`}
          style={{ animationDelay: `${animationDelay + 300}ms` }}
        >
          {displayValue}
        </span>
        <span className="text-muted-foreground text-sm">/ 100</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
        <div 
          className={`${getColorClass(value)} h-1.5 rounded-full animate-metric-bar-fill`}
          style={{ 
            width: `${displayValue}%`,
            animationDelay: `${animationDelay + 400}ms`
          }}
        ></div>
      </div>
      
      {description && (
        <p 
          className="text-xs text-muted-foreground mt-1"
          style={{ 
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.5s ease',
            transitionDelay: `${animationDelay + 600}ms`
          }}
        >
          {description}
        </p>
      )}
      
      <div 
        className="text-xs text-primary font-medium mt-2"
        style={{ 
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease',
          transitionDelay: `${animationDelay + 700}ms`
        }}
      >
        {category}
      </div>
    </div>
  );
}