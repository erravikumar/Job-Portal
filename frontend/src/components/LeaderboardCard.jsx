import { faAward, faMedal, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

export default function LeaderboardCard({ user }) {
  function generateIcon(index) {
    if (index === 1) {
      return (
        <FontAwesomeIcon icon={faTrophy} className="text-primary text-4xl" />
      );
    } else if (index === 2) {
      return (
        <FontAwesomeIcon icon={faMedal} className="text-gray-400 text-4xl" />
      );
    } else if (index === 3) {
      return (
        <FontAwesomeIcon icon={faAward} className="text-yellow-600 text-4xl" />
      );
    } else return <>{index}.</>;
  }

  // sort safely (do not mutate props)
  const sortedJobs =
    Array.isArray(user) && user.length > 0
      ? [...user].sort(
          (a, b) => new Date(a.dateOfPosting) - new Date(b.dateOfPosting)
        )
      : [];

  return (
    <div>
      <h2 className="text-4xl font-semibold text-gray-900 text-center mt-10">
        Leaderboard
      </h2>
      <p className="text-md text-gray-600 pb-8 text-center pt-2 px-4">
        Helping your friends land their dream job deserves recognition 🎉
      </p>

      {sortedJobs.length > 0 ? (
        sortedJobs.map((job, index) => (
          <LeaderboardRow key={job._id || index} job={job} index={index} />
        ))
      ) : (
        <p className="text-center">No data available</p>
      )}

      <p className="text-sm text-center mt-10 mb-3">
        * The leaderboard table only displays currently available jobs.
      </p>
    </div>
  );
}

/* ================= CLICKABLE STAR ROW ================= */

function LeaderboardRow({ job, index }) {
  const [rating, setRating] = useState(job.rating || 0);
  const [hover, setHover] = useState(null);

  return (
    <div className="px-3 py-5 border-b border-gray-200">
      <div className="flex items-center">
        <h1 className="text-4xl font-bold mt-2">
          {index + 1 <= 3 ? (
            index + 1 === 1 ? (
              <FontAwesomeIcon
                icon={faTrophy}
                className="text-primary text-4xl"
              />
            ) : index + 1 === 2 ? (
              <FontAwesomeIcon
                icon={faMedal}
                className="text-gray-400 text-4xl"
              />
            ) : (
              <FontAwesomeIcon
                icon={faAward}
                className="text-yellow-600 text-4xl"
              />
            )
          ) : (
            `${index + 1}.`
          )}
        </h1>

        <div className="ml-5">
          <div className="text-lg font-medium text-gray-900">
            {job.title}
          </div>

          {/* ⭐ CLICKABLE STARS */}
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <FaStar
                key={value}
                size={20}
                style={{ cursor: "pointer" }}
                color={
                  value <= (hover || rating)
                    ? "#facc15" // yellow
                    : "#9ca3af" // gray
                }
                onClick={() => {
                  setRating(value);
                  console.log("Rated:", value, "for job:", job._id);
                  // TODO: API call to save rating
                }}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </div>
        </div>

        <div className="ml-auto">
          <span className="text-base text-blue-600">
            {job.recruiter?.name}
          </span>
        </div>
      </div>
    </div>
  );
}
