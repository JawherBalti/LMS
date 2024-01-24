// Stars.tsx
import { Star } from "lucide-react";
import { useState } from "react";

interface StarsProps {
    review: string
 setReview: (value: string) => void;
 setReviewValue: (value: number) => void;
 hoverIndex: number
 setHoverIndex: (value: number) => void;
}

export const Stars = ({review, setReview, setReviewValue, hoverIndex, setHoverIndex }: StarsProps) => {
 const handleHoverEnter = (index: number) => {
    setHoverIndex(index);
    switch (index) {
      case 0:
        setReview("Bad");
        setReviewValue(1);
        break;
      case 1:
        setReview("Below average");
        setReviewValue(2);
        break;
      case 2:
        setReview("Average");
        setReviewValue(3);
        break;
      case 3:
        setReview("Good");
        setReviewValue(4);
        break;
      case 4:
        setReview("Excellent");
        setReviewValue(5);
        break;
      default:
        setReview("");
        setReviewValue(1);
    }
 };

 return (
    <div className="flex flex-col justify-center items-center">
      <span>{review}</span>
      <div className="flex gap-x-2 justify-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            onMouseEnter={() => handleHoverEnter(index)}
            onMouseLeave={() => setHoverIndex(index)}
            className="hover:cursor-pointer text-yellow-500"
            fill={
              hoverIndex >= index
                ? "rgb(234 179 8 / var(--tw-text-opacity))"
                : "transparent"
            }
            size={60}
          />
        ))}
      </div>
    </div>
 );
};
