import { useState } from "react";
import { Recommendation, RecommendationType } from "@/types";
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, ThumbsUp } from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index?: number;
}

export function RecommendationCard({ recommendation, index = 0 }: RecommendationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Configure visual properties based on recommendation type
  const getTypeConfig = () => {
    switch (recommendation.type) {
      case RecommendationType.Positive:
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          ringColor: "ring-green-100",
          glowColor: "rgba(34, 197, 94, 0.2)", // green glow
          actionIcon: <ThumbsUp className="w-4 h-4" />,
          actionText: "Keep this up",
          badgeClass: "bg-green-100 text-green-800"
        };
      case RecommendationType.Warning:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-700",
          ringColor: "ring-amber-100",
          glowColor: "rgba(245, 158, 11, 0.2)", // amber glow
          actionIcon: <ArrowRight className="w-4 h-4" />,
          actionText: recommendation.action,
          badgeClass: "bg-amber-100 text-amber-800"
        };
      case RecommendationType.Critical:
        return {
          icon: <XCircle className="w-5 h-5" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          ringColor: "ring-red-100",
          glowColor: "rgba(239, 68, 68, 0.2)", // red glow
          actionIcon: <ArrowRight className="w-4 h-4" />,
          actionText: recommendation.action,
          badgeClass: "bg-red-100 text-red-800"
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div 
      className={`bg-white p-5 rounded-lg border ${config.borderColor} shadow-sm transition-all duration-300 hover:shadow-md`}
      style={{ 
        animation: 'metric-highlight 1.5s ease-in-out',
        animationDelay: `${index * 200}ms`,
        animationFillMode: 'backwards',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 4px 12px ${config.glowColor}` : ''
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        <div 
          className={`${config.bgColor} ${config.textColor} p-3 rounded-full flex items-center justify-center ring-2 ${config.ringColor}`}
          style={{ 
            transition: 'transform 0.3s ease', 
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {config.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`text-lg font-medium ${config.textColor}`}>{recommendation.title}</h4>
            
            <div 
              className={`text-xs px-2 py-0.5 rounded-full ${config.badgeClass} font-medium animate-badge-pop`}
              style={{ animationDelay: `${index * 200 + 500}ms` }}
            >
              {recommendation.type === RecommendationType.Positive ? "Strength" : 
               recommendation.type === RecommendationType.Warning ? "Improve" : "Critical"}
            </div>
          </div>
          
          <p 
            className="text-slate-600 mb-3 text-sm"
            style={{ 
              opacity: 0, 
              animation: 'score-reveal 0.6s ease forwards',
              animationDelay: `${index * 200 + 200}ms` 
            }}
          >
            {recommendation.description}
          </p>
          
          <div 
            className={`${config.textColor} font-medium text-sm flex items-center gap-1.5 mt-2 group`}
            style={{ 
              transition: 'transform 0.3s ease', 
              transform: isHovered ? 'translateX(3px)' : 'translateX(0)'
            }}
          >
            <span className="transition-transform duration-300 transform group-hover:translate-x-0.5">
              {config.actionIcon}
            </span>
            <span>{config.actionText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
