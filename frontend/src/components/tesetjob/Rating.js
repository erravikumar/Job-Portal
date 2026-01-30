import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Rate() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        fontSize: "40px",
        marginTop: "50px",
      }}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <FaStar
          key={value}
          style={{
            cursor: "pointer",
            pointerEvents: "auto",
          }}
          color={value <= (hover || rating) ? "#facc15" : "#9ca3af"}
          onClick={() => {
            console.log("clicked:", value);
            setRating(value);
          }}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  );
}
