import { Recommendation, RecommendationType } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  // Set icon and background color based on recommendation type
  let iconClass = "fas fa-check";
  let bgColor = "bg-green-100 text-green-600";
  let actionIcon = "fas fa-thumbs-up";
  let actionText = "Keep this up";

  if (recommendation.type === RecommendationType.Warning) {
    iconClass = "fas fa-exclamation-triangle";
    bgColor = "bg-amber-100 text-amber-600";
    actionIcon = "fas fa-arrow-right";
    actionText = recommendation.action;
  } else if (recommendation.type === RecommendationType.Critical) {
    iconClass = "fas fa-times";
    bgColor = "bg-red-100 text-red-600";
    actionIcon = "fas fa-arrow-right";
    actionText = recommendation.action;
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`${bgColor} p-2 rounded-full`}>
          <i className={iconClass}></i>
        </div>
        <div>
          <h4 className="text-lg font-medium mb-1">{recommendation.title}</h4>
          <p className="text-slate-600 mb-2">
            {recommendation.description}
          </p>
          <div className="text-primary font-medium text-sm">
            <i className={`${actionIcon} mr-1`}></i> {actionText}
          </div>
        </div>
      </div>
    </div>
  );
}
