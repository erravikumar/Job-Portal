import ProgressBar from "components/ProgressBar";
import ReferNavigation from "components/refer/ReferNavigation";
import Referrer from "components/refer/steps/Referrer";
import General from "components/refer/steps/General";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userType } from "libs/isAuth";

export default function Refer() {
  const navigate = useNavigate();
  const type = userType();

  // ✅ FIXED INITIAL STATES
  const [referrer, setReferrer] = useState({
    name: "",
    title: "",
    email: "",
    linkedin: "",
    source: "",
    accepted: false,
  });

  const [general, setGeneral] = useState({
    open: "I don't know.",
    status: "In progress",
    share: "No, I will get 100%.",
  });

  const stepsCount = 1; // Referrer + General
  const [index, setIndex] = useState(0);

  const progress = Math.floor((100 / (stepsCount - 1)) * index);

  // ✅ FIXED API CALL
  useEffect(() => {
    if (type === "applicant") {
      axios
        .get("/applicant")
        .then((res) => {
          const data = res.data; // ✅ FIX
          setReferrer((prev) => ({
            ...prev,
            name: data.name || "",
            title: data.title || "",
            email: data.email || "",
            linkedin: data.linkedin || "",
          }));
        })
        .catch((err) => console.log(err));
    }
  }, [type]);

  function changeIndex(value) {
    window.scrollTo(0, 0);
    setIndex(value);
  }

  // ✅ FIXED VALIDATION LOGIC
  function isComplete(stepIndex) {
    if (stepIndex === 0) {
      return (
        referrer.name.trim() !== "" &&
        referrer.title.trim() !== "" &&
        referrer.email.trim() !== "" &&
        referrer.linkedin.trim() !== "" &&
        referrer.source.trim() !== "" &&
        referrer.accepted === true
      );
    }

    if (stepIndex === 1) {
      return true;
    }

    return false;
  }

  // ✅ FIXED STEP RENDERING
  function generateStep(step) {
    switch (step) {
      case 0:
        return (
          <Referrer
            referrer={referrer}
            addReferrer={setReferrer}
          />
        );

      case 1:
        return (
          <General
            general={general}
            addGeneral={setGeneral}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="bg-[#f8e5d4] md:py-24 py-12">
      <div className="bg-white rounded-2xl pt-10 md:px-8 px-6 pb-8 text-left md:w-5/12 w-11/12 mx-auto">
        <ProgressBar value={progress} />
        {generateStep(index)}
        <ReferNavigation
          index={index}
          changeIndex={changeIndex}
          isComplete={isComplete}
        />
      </div>
    </div>
  );
}
