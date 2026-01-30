import axios from "axios";
import JobAd from "components/JobAd";
import apiList from "../../libs/apiList";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Banner from "components/Banner";
import { userType } from "libs/isAuth";
import { SetPopupContext } from "App";

export default function Job() {
  const { id } = useParams();
  const setPopup = useContext(SetPopupContext);

  const [job, setJob] = useState(null);
  const [allJob, setAllJob] = useState([]);
  const [hasAcceptedJob, setHasAcceptedJob] = useState(false);
  const [sop, setSop] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [selectedPage, setSelectedPage] = useState(1);

  const token = localStorage.getItem("token");

  const userApply = () => {
    return job && (job.status === "accepted" || job.status === "finished");
  };

  // ================= APPLY JOB =================
  const handleApply = async () => {
    if (!job) return;

    if (userApply()) {
      setPopup({
        open: true,
        icon: "success",
        message:
          "You already have an accepted job. Cannot apply for another job.",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${apiList.jobs}/${job._id}/applications`,
        { sop },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPopup({
        open: true,
        icon: "success",
        message: res.data.message,
      });
    } catch (err) {
      setPopup({
        open: true,
        icon: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  // ========== CHECK ACCEPTED JOB (APPLICANT ONLY) ==========
  useEffect(() => {
    // 🔥 MOST IMPORTANT FIX
    if (userType() !== "applicant") return;
    if (!token || !id) return;

    const checkAcceptedJob = async () => {
      try {
        const res = await axios.get(
          `${apiList.jobs}/${id}/check-accepted`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHasAcceptedJob(res.data?.hasAcceptedJob || false);
      } catch (err) {
        console.error(
          "checkAcceptedJob error:",
          err.response?.data || err.message
        );
      }
    };

    checkAcceptedJob();
  }, [id, token]);

  // ================= FETCH SINGLE JOB =================
  useEffect(() => {
    axios
      .get(`${apiList.jobs}/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // ================= FETCH ALL JOBS =================
  useEffect(() => {
    axios
      .get(apiList.jobs)
      .then((res) => setAllJob(res.data))
      .catch((err) => console.error(err));
  }, []);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = allJob
    .filter((j) => j._id !== id)
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (page) => {
    setCurrentPage(page);
    setSelectedPage(page);
  };

  return (
    <>
      <div className="flex">
        {/* LEFT */}
        <div className="lg:w-6/12 w-11/12 ml-44 mr-20 md:mt-20 mt-10 pb-10">
          <JobAd about={job} />

          <div className="text-center mx-auto mt-12 mb-10">
            {userType() === "applicant" && job && (
              <>
                {job.maxPositions > job.acceptedCandidates ? (
                  <button
                    onClick={handleApply}
                    disabled={hasAcceptedJob}
                    title={
                      hasAcceptedJob
                        ? "You already have an accepted job"
                        : ""
                    }
                    className={`px-8 py-3 bg-primary rounded-xl font-semibold hover:opacity-80 ${
                      hasAcceptedJob
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {hasAcceptedJob ? "Job accepted!" : "Apply"}
                  </button>
                ) : (
                  <p className="px-8 py-3 bg-gray-400 rounded-xl cursor-not-allowed">
                    Position Filled
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/3 md:mt-20 mt-10 pb-10">
          <p className="text-gray-500 font-semibold">Similar Job Post</p>

          <div className="flex flex-wrap gap-4">
            {currentItems.map((job) => (
              <Link to={`/jobs/${job._id}`} key={job._id}>
                <div className="w-full md:w-[20rem] bg-white shadow-lg rounded-md px-3 py-5">
                  <p className="text-lg font-semibold truncate">
                    {job.title}
                  </p>
                  <span className="text-gray-500 text-sm">
                    {calculateDays(new Date(job.dateOfPosting))}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-4">
            {Array.from(
              { length: Math.ceil(allJob.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 border rounded ${
                    selectedPage === i + 1
                      ? "bg-yellow-200"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <Banner
        title="Looking for something else?"
        button="Explore the job board"
        link="/jobs"
      />
    </>
  );
}
