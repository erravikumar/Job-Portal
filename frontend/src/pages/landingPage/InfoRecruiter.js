import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import apiList from "../../libs/apiList";
import { userType } from "libs/isAuth";
import { SetPopupContext } from "App";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faMapMarkerAlt,
  faAward,
  faHand,
  faUsers,
  faCalendarDays,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";

import { Rating } from "@material-tailwind/react";

export default function InfoRecruiter() {
  const { id } = useParams(); // recruiter id
  const navigate = useNavigate();
  const setPopup = useContext(SetPopupContext);

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [hasAcceptedJob, setHasAcceptedJob] = useState(false);
  const [sop, setSop] = useState("");

  const token = localStorage.getItem("token");

  // ================= COMPANY INFO =================
  useEffect(() => {
    axios
      .get(`${apiList.user}/${id}`)
      .then((res) => setCompany(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // ================= FETCH JOBS =================
  useEffect(() => {
    axios
      .get(apiList.jobs)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ================= CHECK ACCEPTED JOB (APPLICANT ONLY) =================
  useEffect(() => {
    if (userType() !== "applicant") return; // 🔥 MOST IMPORTANT
    if (!token) return;

    const checkAcceptedJob = async () => {
      try {
        const res = await axios.get(
          `${apiList.jobs}/check-accepted`,
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
  }, [token]);

  // ================= APPLY JOB =================
  const handleApply = async (jobId) => {
    if (hasAcceptedJob) {
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
        `${apiList.jobs}/${jobId}/applications`,
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

      navigate(`/jobs/${jobId}/refer`);
    } catch (err) {
      setPopup({
        open: true,
        icon: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const recruiterJobs = jobs.filter((job) => job.userId === id);

  return (
    <>
      {/* ================= COMPANY INFO ================= */}
      <div className="md:pt-32 pt-12 pb-20">
        <div className="lg:w-9/12 w-11/12 mx-auto">
          <div className="flex items-center gap-4">
            <img
              src={company?.profile}
              alt="company"
              className="w-20 h-20 rounded-md"
            />
            <h1 className="text-3xl font-bold">{company?.name}</h1>
          </div>

          <p className="mt-6 text-lg">{company?.bio}</p>
          <p className="mt-2 text-lg">
            Phone: {company?.contactNumber}
          </p>
        </div>
      </div>

      {/* ================= JOBS ================= */}
      <div className="bg-light py-20">
        <div className="md:w-10/12 w-11/12 mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">
            Jobs at {company?.name} ({recruiterJobs.length})
          </h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {recruiterJobs.length > 0 ? (
              recruiterJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl p-6 shadow hover:shadow-lg"
                >
                  <h2 className="text-2xl font-bold">{job.title}</h2>

                  <p className="mt-2">
                    <FontAwesomeIcon icon={faMoneyBillWave} />{" "}
                    {job.salary} $
                  </p>

                  <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                    {job.location}
                  </p>

                  <p>
                    <FontAwesomeIcon icon={faCalendarDays} />{" "}
                    {new Date(job.dateOfPosting).toLocaleDateString()}
                  </p>

                  <p>
                    <FontAwesomeIcon icon={faUsers} /> Applicants:{" "}
                    {job.maxApplicants}
                  </p>

                  <p>
                    <FontAwesomeIcon icon={faHand} /> Remaining Positions:{" "}
                    {job.maxPositions - job.acceptedCandidates}
                  </p>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    {job.skillsets?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-900 text-white text-xs px-3 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-6">
                    {userType() === "applicant" && (
                      <button
                        disabled={hasAcceptedJob}
                        onClick={() => handleApply(job._id)}
                        className={`px-6 py-2 rounded-xl font-semibold bg-primary ${
                          hasAcceptedJob
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {hasAcceptedJob ? "Job accepted!" : "Apply"}
                      </button>
                    )}

                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-6 py-2 rounded-xl bg-gray-200 font-semibold"
                    >
                      About Job
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3">
                No jobs found
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
