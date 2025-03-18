interface LoadingStepProps {
  icon: string;
  title: string;
  step: number;
  isActive: boolean;
  isCompleted: boolean;
}

export function LoadingStep({ icon, title, step, isActive, isCompleted }: LoadingStepProps) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
          isCompleted 
            ? "bg-green-100 text-green-600" 
            : isActive 
              ? "bg-primary-100 text-primary" 
              : "bg-slate-100 text-slate-400"
        }`}
      >
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className={`font-medium ${
        !isActive && !isCompleted ? "text-slate-400" : ""
      }`}>
        {title}
      </div>
      <div className={`text-sm ${
        !isActive && !isCompleted ? "text-slate-400" : "text-slate-500"
      }`}>
        Step {step} of 4
      </div>
    </div>
  );
}
