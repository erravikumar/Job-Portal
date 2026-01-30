import axios from "axios";
import apiList from "libs/apiList";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function Recruiter(props) {
  const { recruiter } = props;
  const [jobs, setJobs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(apiList.jobs, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJobs(response.data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const handleReadMoreClick = () => {
    setIsExpanded((prev) => !prev);
  };

  // ✅ FIXED FILTER LOGIC
  const filteredReferrals = useMemo(() => {
    if (!jobs.length || !recruiter?.userId) return [];

    return jobs.filter((job) => {
      if (!job.userId) return false;

      // handle both ObjectId and populated object
      const jobUserId =
        typeof job.userId === "object"
          ? job.userId._id?.toString()
          : job.userId.toString();

      return jobUserId === recruiter.userId.toString();
    });
  }, [jobs, recruiter]);

  return (
    <>
      {recruiter ? (
        <div
          className="transform ease-in duration-100 hover:-translate-y-2 
          hover:shadow-lg w-full bg-white rounded-2xl p-6 text-left"
        >
          {/* Header */}
          <div className="flex items-center text-left pb-4">
            <img
              className="w-16 h-16 rounded-2xl mr-4"
              src={recruiter.profile}
              alt="Company logo"
            />
            <div>
              <p className="text-2xl font-bold text-gray-700 leading-none">
                {recruiter.name}
              </p>
            </div>
          </div>

          {/* Banner */}
          <p className="pl-1 pb-1">
            {recruiter.banner ? (
              <>
                <span className="text-lg text-gray-600 font-semibold">
                  {isExpanded
                    ? recruiter.banner
                    : recruiter.banner.slice(0, 60) + "..."}
                </span>
                <span
                  className="text-blue-500 hover:opacity-60 cursor-pointer ml-1"
                  onClick={handleReadMoreClick}
                >
                  {isExpanded ? "Read less" : "Read more"}
                </span>
              </>
            ) : (
              <span className="font-bold text-lg text-red-500">
                Banner is not available!
              </span>
            )}
          </p>

          {/* Footer */}
          <div className="flex items-center pt-6 justify-between">
            <Link
              className="hover:opacity-80 flex items-center font-semibold 
              text-md justify-center px-8 py-3 bg-primary rounded-xl text-black"
              to={`/companies/${recruiter.userId}`}
            >
              Read more
            </Link>

            <span className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 shadow-inner flex justify-center items-center rounded-3xl">
                <div className="w-4 h-4 rounded-3xl bg-green-200 shadow-inner">
                  <div className="w-2 h-2 rounded-3xl bg-green-300 shadow-inner"></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-400">
                {filteredReferrals.length} Jobs
              </span>
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
