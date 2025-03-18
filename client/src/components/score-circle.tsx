interface ScoreCircleProps {
  score: number;
}

export function ScoreCircle({ score }: ScoreCircleProps) {
  // Calculate the stroke-dashoffset based on the score
  // Circle circumference = 2 * PI * radius
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (score / 100) * circumference;

  return (
    <svg className="w-52 h-52" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <circle 
        cx="60" 
        cy="60" 
        r={radius} 
        fill="none" 
        stroke="url(#scoreGradient)" 
        strokeWidth="12" 
        strokeDasharray={circumference} 
        strokeDashoffset={dashoffset} 
        strokeLinecap="round" 
      />
      <defs>
        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <text x="60" y="65" fontSize="28" textAnchor="middle" fontWeight="bold" fill="#1e293b">
        {score}
      </text>
      <text x="60" y="85" fontSize="12" textAnchor="middle" fill="#64748b">
        out of 100
      </text>
    </svg>
  );
}
