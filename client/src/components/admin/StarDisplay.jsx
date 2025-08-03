import { Star } from "lucide-react";

const StarDisplay = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" stroke="none" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} stroke="currentColor" fill="none" />
      ))}
    </div>
  );
};

export default StarDisplay;
