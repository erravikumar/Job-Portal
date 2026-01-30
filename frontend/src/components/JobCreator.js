import InputField from "components/InputField";
import JobAd from "components/JobAd";
import ReactQuill from "react-quill";
import { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { MuiChipsInput } from "mui-chips-input";
import { SetPopupContext } from "App";
import apiList from "../libs/apiList";
import axios from "axios";
import isAuth from "libs/isAuth";

function WaitingBtn() {
  return (
    <div className="cursor-not-allowed flex ml-2 mr-2 items-center font-semibold justify-center px-8 py-3 bg-gray-300 rounded-xl">
      Waiting for responses
    </div>
  );
}

export default function JobCreator({ jobToEdit }) {
  const setPopup = useContext(SetPopupContext);

  /* ✅ TAGS STATE (MUST BE ARRAY) */
  const [tags, setTags] = useState([]);

  /* ✅ JOB STATE */
  const [job, setJob] = useState(
    jobToEdit || {
      name: isAuth(),
      title: "",
      maxApplicants: 0,
      maxPositions: 0,
      salary: 0,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      skillsets: [],
      duration: 0,
      jobType: "Full Time",
      location: "",
      status: "Open",
      description: "",
    }
  );

  /* ✅ SYNC TAGS → JOB */
  useEffect(() => {
    setJob((prev) => ({ ...prev, skillsets: tags }));
  }, [tags]);

  /* ✅ CLEAN DESCRIPTION (QUILL EMPTY BUG FIX) */
  const cleanDescription = useMemo(() => {
    return (
      job.description
        ?.replace(/<(.|\n)*?>/g, "")
        .replace(/&nbsp;/g, "")
        .trim() || ""
    );
  }, [job.description]);

  /* ✅ FINAL VALIDATION */
  const isComplete =
    job.title.trim().length > 2 &&
    job.salary > 0 &&
    job.maxApplicants > 0 &&
    job.maxPositions > 0 &&
    job.duration > 0 &&
    job.location.trim().length > 2 &&
    Array.isArray(tags) &&
    tags.length > 0 &&
    cleanDescription.length > 10;

  /* ✅ QUILL TOOLBAR */
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  /* ✅ SAVE JOB */
  const handleUpdate = async () => {
    try {
      await axios.post(apiList.jobs, job, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPopup({
        open: true,
        icon: "success",
        message: "Job posted successfully",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      {/* LEFT */}
      <div className="col-span-4 bg-light px-12 py-4 overflow-y-scroll">
        <InputField
          label="Job Title"
          value={job.title}
          onChange={(e) =>
            setJob((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <InputField
          type="number"
          label="Salary"
          value={job.salary}
          onChange={(e) =>
            setJob((prev) => ({
              ...prev,
              salary: Number(e.target.value) || 0,
            }))
          }
        />

        <InputField
          label="Job Type"
          value={job.jobType}
          onChange={(e) =>
            setJob((prev) => ({ ...prev, jobType: e.target.value }))
          }
        />

        <InputField
          type="number"
          label="Duration (months)"
          value={job.duration}
          onChange={(e) =>
            setJob((prev) => ({
              ...prev,
              duration: Number(e.target.value) || 0,
            }))
          }
        />

        <InputField
          type="datetime-local"
          label="Deadline"
          value={job.deadline}
          onChange={(e) =>
            setJob((prev) => ({ ...prev, deadline: e.target.value }))
          }
        />

        <InputField
          type="number"
          label="Max Applicants"
          value={job.maxApplicants}
          onChange={(e) =>
            setJob((prev) => ({
              ...prev,
              maxApplicants: Number(e.target.value) || 0,
            }))
          }
        />

        <InputField
          label="Location"
          value={job.location}
          onChange={(e) =>
            setJob((prev) => ({ ...prev, location: e.target.value }))
          }
        />

        <InputField
          type="number"
          label="Positions Available"
          value={job.maxPositions}
          onChange={(e) =>
            setJob((prev) => ({
              ...prev,
              maxPositions: Number(e.target.value) || 0,
            }))
          }
        />

        {/* ✅ SKILLS (FINAL FIXED) */}
        <label className="block text-sm font-semibold mt-6 mb-2">Skills</label>
        <MuiChipsInput
          value={tags}
          onChange={(newTags) => setTags(newTags)}
          addOnBlur
          addOnWhichKey={["Enter", ","]}
        />

        {/* ✅ DESCRIPTION */}
        <label className="block text-sm font-semibold mt-6 mb-2">
          Job Description
        </label>
        <ReactQuill
          theme="snow"
          modules={modules}
          value={job.description}
          onChange={(value) =>
            setJob((prev) => ({ ...prev, description: value }))
          }
        />

        {/* 🔎 DEBUG (REMOVE AFTER CONFIRM) */}
        <pre className="text-xs bg-white p-2 mt-4 overflow-auto">
          {JSON.stringify(
            {
              title: job.title,
              salary: job.salary,
              maxApplicants: job.maxApplicants,
              maxPositions: job.maxPositions,
              duration: job.duration,
              location: job.location,
              tags,
              tagsLength: tags.length,
              cleanDescriptionLength: cleanDescription.length,
              isComplete,
            },
            null,
            2
          )}
        </pre>

        {/* BUTTONS */}
        <div className="flex items-center pt-6">
          {isComplete ? (
            <button
              onClick={handleUpdate}
              className="font-bold px-8 py-3 bg-primary rounded-xl"
            >
              Save
            </button>
          ) : (
            <WaitingBtn />
          )}

          <Link to="/admin" className="ml-2 font-semibold px-8 py-3 rounded-xl">
            Cancel
          </Link>
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-8 overflow-y-scroll">
        <JobAd job={job} tags={tags} />
      </div>
    </div>
  );
}
