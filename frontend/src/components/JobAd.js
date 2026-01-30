import "editor.css";
import icon from "assets/icon.jpg";
import { Rating } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import apiList from "libs/apiList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getId } from "libs/isAuth";

export default function JobAd({ job, tags = [], about, edit }) {
  const [recruiters, setRecruiters] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // ✅ SINGLE recruiter fetch
  useEffect(() => {
    const userId =
      about?.userId || job?.userId || edit?.userId || getId();

    if (!userId) return;

    axios.get(apiList.allRecruiter).then((response) => {
      const filtered = response.data.allUser.filter(
        (r) => r.userId === userId
      );
      setRecruiters(filtered);
    });
  }, [about?.userId, job?.userId, edit?.userId]);

  const handleReadMoreClick = () => {
    setIsExpanded((prev) => !prev);
  };

  function calculateDays(date) {
    const daysAgo = Math.floor((new Date() - date) / (1000 * 3600 * 24));
    if (daysAgo < 1) return "Today";
    if (daysAgo < 2) return "1 day ago";
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 14) return "1 week ago";
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    if (daysAgo < 60) return "1 month ago";
    return `${Math.floor(daysAgo / 30)} months ago`;
  }

  const remainingBg =
    about && about.maxPositions - about.acceptedCandidates > 0
      ? "bg-yellow-100"
      : "bg-gray-400";

  return (
    <>
      {/* JOB PREVIEW (CREATE MODE) */}
      {job && (
        <div className="w-11/12 mx-auto mt-20 pb-8">
          <div className="flex">
            {recruiters.map((r) => (
              <img
                key={r.userId}
                alt="company logo"
                className="md:h-24 md:w-24 w-20 h-20 mr-4 rounded-md"
                src={r.profile}
              />
            ))}

            <div>
              <h1 className="font-semibold text-2xl lg:text-4xl mt-3">
                {job.title || "Job title"}
              </h1>
              <h6 className="md:text-xl text-lg">Company</h6>
            </div>
          </div>

          <table className="table-auto w-full my-6">
            <tbody className="text-lg">
              <tr>
                <td>Salary</td>
                <td className="text-right">{job.salary} $</td>
              </tr>
              <tr>
                <td>Skills</td>
                <td className="text-right">
                  <div className="flex flex-row-reverse gap-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Duration</td>
                <td className="text-right">{job.duration}</td>
              </tr>
              <tr>
                <td>Deadline</td>
                <td className="text-right">{job.deadline}</td>
              </tr>
              <tr>
                <td>Location</td>
                <td className="text-right">{job.location}</td>
              </tr>
            </tbody>
          </table>

          <div className="my-8">
            <h1 className="text-3xl font-medium mb-2">About the job</h1>
            <div dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>
        </div>
      )}

      {/* ABOUT / VIEW MODE */}
      {about && (
        <div className="w-11/12 mx-auto mt-10 pb-6 bg-slate-50 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {recruiters.map((r) => (
                <img
                  key={r.userId}
                  src={r.profile}
                  className="w-20 h-20 rounded-md"
                  alt="company"
                />
              ))}
              <div>
                <p className="text-xl font-semibold">{about.title}</p>
                <span className="text-gray-500">{about.location}</span>
                {recruiters[0] && (
                  <Link
                    to={`/companies/${recruiters[0].userId}`}
                    className="block text-blue-600"
                  >
                    Posted by: {recruiters[0].name}
                  </Link>
                )}
                <span className="text-sm text-gray-400">
                  {calculateDays(new Date(about.dateOfPosting))}
                </span>
              </div>
            </div>
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="w-8 h-8 text-green-300"
            />
          </div>

          <div className="mt-6">
            <Rating value={about.rating !== -1 ? about.rating : null} readonly />
          </div>

          <div className={`mt-6 ${remainingBg} p-4 rounded-lg text-center`}>
            Remaining Positions:{" "}
            {about.maxPositions - about.acceptedCandidates}
          </div>

          <div className="my-6">
            <p className="text-xl font-semibold">About the job</p>
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: isExpanded
                    ? about.description
                    : about.description.slice(0, 600) + "...",
                }}
              />
              <span
                className="text-blue-500 cursor-pointer"
                onClick={handleReadMoreClick}
              >
                {isExpanded ? "Read less" : "Read more"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
