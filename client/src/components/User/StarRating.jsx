import { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ storeId, initialRating = 0, onRatingSubmit }) => {
  const [selected, setSelected] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      setIsSubmitting(true);
      await onRatingSubmit(storeId, selected);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer text-xl transition ${
              (hovered || selected) >= star ? "text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(star)}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected || isSubmitting}
        className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
};

export default StarRating;
