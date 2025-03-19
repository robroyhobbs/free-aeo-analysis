import { useEffect, useState, useMemo, memo } from "react";
import { Brain, Cpu, Database, Search, Zap } from "lucide-react";

// Constants
const ANIMATION_DURATION = 8000; // 8 seconds
const UPDATE_INTERVAL = 40; // 40ms for smooth animation

interface AILoadingAnimationProps {
  step: number;
  subStep: number;
  progress: number;
}

// Step information with types
interface StepInfo {
  icon: JSX.Element;
  title: string;
  subtitle: string;
}

// Particle interface
interface Particle {
  angle: number;
  radius: number;
  delay: number;
}

// Memoized step icons to prevent unnecessary re-renders
const SearchIcon = memo(() => <Search className="w-5 h-5" />);
const CpuIcon = memo(() => <Cpu className="w-5 h-5" />);
const BrainIcon = memo(() => <Brain className="w-5 h-5" />);
const DatabaseIcon = memo(() => <Database className="w-5 h-5" />);
const ZapIcon = memo(() => <Zap className="w-5 h-5" />);

export function AILoadingAnimation({ step, subStep, progress }: AILoadingAnimationProps) {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Timer to ensure animation runs for at least 8 seconds
  useEffect(() => {
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentComplete = Math.min(100, (elapsed / ANIMATION_DURATION) * 100);
      setTimeElapsed(percentComplete);
      
      // If animation completed, clear the timer
      if (percentComplete >= 100) {
        clearInterval(timer);
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // Memoized step information to avoid recalculations on re-renders
  const stepInfo = useMemo(() => {
    const stepMap: Record<number, StepInfo> = {
      0: { 
        icon: <ZapIcon />,
        title: 'Initializing',
        subtitle: 'Preparing analysis tools'
      },
      1: { 
        icon: <SearchIcon />,
        title: 'Crawling Website',
        subtitle: 'Gathering content and structure data'
      },
      2: { 
        icon: <CpuIcon />,
        title: 'Processing Content',
        subtitle: 'Analyzing text and semantic structure'
      },
      3: { 
        icon: <BrainIcon />,
        title: 'AI Analysis',
        subtitle: 'Evaluating user-intent alignment'
      },
      4: { 
        icon: <DatabaseIcon />,
        title: 'Generating Report',
        subtitle: 'Compiling insights and recommendations'
      }
    };
    
    return stepMap[step] || stepMap[0];
  }, [step]);

  // Use the current step info directly from our memoized value
  const currentStepInfo = stepInfo;

  // Force natural-looking progress increase to ensure animation runs for full 8 seconds
  const displayProgress = Math.min(progress, timeElapsed);

  // Memoized particle positions to avoid recalculations
  const particles: Particle[] = useMemo(() => {
    const particleCount = 15;
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 40 + (i % 3) * 15;
      const delay = i * 0.1;
      return { angle, radius, delay };
    });
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Main container with enhanced visual design */}
      <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200 shadow-lg overflow-hidden p-8">
        {/* Neural network background grid with gradient overlay */}
        <div className="absolute inset-0 bg-grid-pattern">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-indigo-50/90"></div>
          
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Dynamic grid pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6366F1" strokeWidth="0.2" />
              </pattern>
              
              <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.7">
                  <animate attributeName="stopOpacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.5">
                  <animate attributeName="stopOpacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <rect width="100" height="100" fill="url(#grid)" />
            
            {/* Neural nodes - more dynamic with animation */}
            {[0, 20, 40, 60, 80].map((x, xIndex) => (
              [0, 20, 40, 60, 80].map((y, yIndex) => (
                <circle 
                  key={`${x}-${y}`}
                  cx={x} 
                  cy={y} 
                  r={xIndex === 2 && yIndex === 2 ? "1.5" : "0.8"}
                  fill="url(#pulse-gradient)" 
                  className="animate-neural-pulse" 
                  filter="url(#glow)"
                  style={{ animationDelay: `${(xIndex + yIndex) * 0.2}s` }} 
                />
              ))
            ))}
            
            {/* Connection lines that appear based on progress */}
            {step >= 1 && (
              Array.from({ length: 8 }, (_, i) => {
                const x1 = 20 * (i % 4);
                const y1 = 20 * Math.floor(i / 4);
                const x2 = x1 + 20;
                const y2 = y1;
                return (
                  <line 
                    key={`h-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2} 
                    stroke="#6366F1" 
                    strokeWidth="0.4"
                    className="animate-path-trace" 
                    style={{ animationDelay: `${i * 0.15}s` }} 
                  />
                );
              })
            )}
            
            {step >= 2 && (
              Array.from({ length: 8 }, (_, i) => {
                const x1 = 20 * (i % 4);
                const y1 = 20 * Math.floor(i / 4);
                const x2 = x1;
                const y2 = y1 + 20;
                return (
                  <line 
                    key={`v-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2} 
                    stroke="#6366F1" 
                    strokeWidth="0.4"
                    className="animate-path-trace" 
                    style={{ animationDelay: `${i * 0.15 + 0.6}s` }} 
                  />
                );
              })
            )}
            
            {step >= 3 && (
              <>
                <path 
                  d="M20,20 C30,10 50,30 60,20 S80,40 80,30"
                  fill="none"
                  stroke="#6366F1" 
                  strokeWidth="0.5"
                  className="animate-path-trace" 
                  style={{ animationDelay: "1.2s" }} 
                />
                <path 
                  d="M20,60 C40,70 60,50 80,60"
                  fill="none"
                  stroke="#6366F1" 
                  strokeWidth="0.5"
                  className="animate-path-trace" 
                  style={{ animationDelay: "1.5s" }} 
                />
              </>
            )}
            
            {step >= 4 && (
              <g opacity="0.6" className="animate-fade-in">
                <circle cx="40" cy="40" r="15" fill="none" stroke="#6366F1" strokeWidth="0.3" strokeDasharray="1,1" />
                <circle cx="60" cy="60" r="10" fill="none" stroke="#6366F1" strokeWidth="0.3" strokeDasharray="1,1" />
              </g>
            )}
          </svg>
        </div>
        
        {/* Current step indicator with enhanced visuals */}
        <div className="relative mb-6 z-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className={`p-2 rounded-full bg-indigo-100 text-primary animate-metric-glow`}>
              {stepInfo.icon}
            </div>
            <div className="text-xl font-medium text-slate-800 animate-fade-in">{stepInfo.title}</div>
          </div>
          <div className="text-center text-slate-500 text-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {stepInfo.subtitle}
          </div>
        </div>
        
        {/* Brain visualization with enhanced visual effects */}
        <div className="relative flex justify-center items-center py-8 z-10">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Multi-layered glowing effect */}
            <div className="absolute inset-0 rounded-full bg-indigo-200 opacity-20 animate-thinking"></div>
            <div className="absolute inset-1 rounded-full bg-indigo-100 opacity-40 animate-thinking" style={{ animationDelay: "0.5s" }}></div>
            <div className="absolute inset-2 rounded-full bg-indigo-50 opacity-60 animate-thinking" style={{ animationDelay: "1s" }}></div>
            
            {/* Circular outline with gradient effect */}
            <div className="absolute inset-0 rounded-full border-2 border-indigo-200 opacity-60 animate-spin-slow"></div>
            
            {/* Particle system */}
            {particles.map((particle, index) => {
              const x = 50 + Math.cos(particle.angle + (timeElapsed / 25)) * particle.radius;
              const y = 50 + Math.sin(particle.angle + (timeElapsed / 25)) * particle.radius;
              return (
                <div
                  key={index}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary opacity-70 animate-pulse"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${particle.delay}s`,
                    animationDuration: "1.5s"
                  }}
                />
              );
            })}
            
            {/* Brain icon with enhanced animation */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-14 h-14 text-primary filter drop-shadow-lg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8.5C12 6.29086 10.2091 4.5 8 4.5C5.79086 4.5 4 6.29086 4 8.5C4 8.5 4 10.5 6 10.5C6 14 7 15.5 10 17.5V19.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={step >= 1 ? "animate-path-trace" : "opacity-30"}
                style={{ filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.6))" }}
              />
              <path
                d="M12 8.5C12 6.29086 13.7909 4.5 16 4.5C18.2091 4.5 20 6.29086 20 8.5C20 8.5 20 10.5 18 10.5C18 14 17 15.5 14 17.5V19.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={step >= 2 ? "animate-path-trace" : "opacity-30"}
                style={{ animationDelay: "0.4s", filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.6))" }}
              />
              <path
                d="M10 19.5C10 20.6046 10.8954 21.5 12 21.5C13.1046 21.5 14 20.6046 14 19.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={step >= 3 ? "animate-path-trace" : "opacity-30"}
                style={{ animationDelay: "0.8s", filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.6))" }}
              />
              
              {/* Data processing signals with enhanced visual effects */}
              {step >= 1 && (
                <circle 
                  cx="8" 
                  cy="8.5" 
                  r="2" 
                  fill="url(#pulse-gradient)" 
                  className="animate-neural-pulse" 
                  filter="url(#glow)"
                />
              )}
              
              {step >= 2 && (
                <circle 
                  cx="16" 
                  cy="8.5" 
                  r="2" 
                  fill="url(#pulse-gradient)" 
                  className="animate-neural-pulse" 
                  style={{ animationDelay: "0.4s" }}
                  filter="url(#glow)"
                />
              )}
              
              {step >= 3 && (
                <circle 
                  cx="12" 
                  cy="19.5" 
                  r="2" 
                  fill="url(#pulse-gradient)" 
                  className="animate-neural-pulse" 
                  style={{ animationDelay: "0.8s" }}
                  filter="url(#glow)"
                />
              )}
            </svg>
            
            {/* Central pulsing core with enhanced glow */}
            <div className="absolute w-4 h-4 bg-primary rounded-full opacity-70 animate-pulse filter blur-sm"></div>
          </div>
        </div>
        
        {/* Enhanced data flow progress indicator */}
        <div className="w-4/5 mx-auto mt-6 relative z-10">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Analysis Progress</span>
            <span className="font-medium animate-number-increment">{Math.round(displayProgress)}%</span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full relative overflow-hidden animate-metric-bar-fill"
              style={{ 
                width: `${displayProgress}%`,
                background: "linear-gradient(90deg, #818CF8, #6366F1, #4F46E5)"
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
            </div>
          </div>
        </div>
        
        {/* Step indicator pills with active state */}
        <div className="mt-6 flex justify-between gap-2 relative z-10">
          {[1, 2, 3, 4].map((idx) => (
            <div 
              key={idx}
              className={`flex-1 h-2 rounded-full transition-all duration-500 ease-out ${idx <= step ? "bg-primary" : "bg-slate-200"} ${idx === step ? "animate-pulse shadow-md shadow-indigo-200" : ""}`}
              style={{ opacity: idx <= step ? 1 : 0.5 }}
            ></div>
          ))}
        </div>
        
        {/* Processing activity indicators */}
        <div className="mt-8 grid grid-cols-4 gap-2 relative z-10">
          {[1, 2, 3, 4].map((idx) => (
            <div 
              key={idx} 
              className={`py-2 px-3 rounded-lg ${
                idx < step ? "bg-indigo-50 text-primary" : 
                idx === step ? "bg-primary text-white animate-pulse" : 
                "bg-slate-100 text-slate-400"
              } text-xs font-medium text-center transition-all duration-300`}
            >
              Step {idx}
            </div>
          ))}
        </div>
        
        {/* Data stream visualization */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-indigo-300 via-primary to-indigo-300 animate-data-flow" style={{ backgroundSize: "200% 100%" }}></div>
        </div>
      </div>
    </div>
  );
}