import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  onChange,
  size = 20,
  readOnly = false,
  className = "",
}) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            className={`transition-transform ${
              readOnly ? "cursor-default" : "hover:scale-110 cursor-pointer"
            }`}
            aria-label={`${star} star`}
          >
            <Star
              size={size}
              className={filled ? "text-amber-400" : "text-slate-300 dark:text-zinc-600"}
              fill={filled ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
}

export function StarRatingDisplay({ value = 0, size = 16, className = "" }) {
  return <StarRating value={value} readOnly size={size} className={className} />;
}
