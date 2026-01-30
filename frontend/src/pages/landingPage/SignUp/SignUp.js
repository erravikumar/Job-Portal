import React, { useState, useContext } from "react";
import InputField from "components/InputField";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SetPopupContext } from "App";
import axios from "axios";
import isAuth from "libs/isAuth";
import apiList from "../../../libs/apiList";
import { MuiChipsInput } from "mui-chips-input";
import { apiUploadImages } from "libs/uploadImage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
  const history = useNavigate();
  const setPopup = useContext(SetPopupContext);
  const [loggedin, setLoggedin] = useState(isAuth());
  const [phone, setPhone] = useState("");

  const [chips, setChips] = useState([]);

  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChip = (newChips) => {
    setChips(newChips);
  };

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    dateOfBirth: new Date(),
    resume: "",
    profile: "",
    news: false,
    bio: "",
    contactNumber: "",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const handleChange = (event) => {
    console.log(event.target.value);
    setSignupDetails((prevDetails) => ({
      ...prevDetails,
      type: event.target.value,
    }));
  };

 const [inputErrorHandler, setInputErrorHandler] = useState({
  email: {
    untouched: true,
    required: true,
    error: false,
    message: "",
  },
  password: {
    untouched: true,
    required: true,
    error: false,
    message: "",
  },
  name: {
    untouched: true,
    required: true,
    error: false,
    message: "",
  },
  education: {
    untouched: true,
    required: true, // applicant
    error: false,
    message: "",
  },
  skills: {
    untouched: true,
    required: true, // applicant
    error: false,
    message: "",
  },
  bio: {
    untouched: true,
    required: false, // recruiter only
    error: false,
    message: "",
  },
  contactNumber: {
    untouched: true,
    required: false, // recruiter only
    error: false,
    message: "",
  },
});


//  console.log("inputErrorHandler: ", inputErrorHandler);

const isValidPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  return phoneNumber.replace(/\D/g, "").length >= 10;
};


let allFieldsCheckedApplicant = false;
let allFieldsCheckedRecruiter = false;

if (signupDetails.type === "applicant") {
  allFieldsCheckedApplicant =
    signupDetails.name.trim() !== "" &&
    signupDetails.email.trim() !== "" &&
    signupDetails.password.trim() !== "" &&
    signupDetails.profile.trim() !== "";
}

 else {
  allFieldsCheckedRecruiter =
    signupDetails.name.trim().length > 0 &&
    signupDetails.email.trim().length > 0 &&
    signupDetails.password.trim().length > 0 &&
    signupDetails.bio.trim().length > 0 &&
    (signupDetails.contactNumber.trim().length === 0 ||
      isValidPhoneNumber(signupDetails.contactNumber)) &&
    signupDetails.profile.trim().length > 0 &&
    typeof signupDetails.news === "boolean";
}

  const handleInput = (key, value) => {
    setSignupDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
    // console.log(`Input ${key} value:`, value);
  };

const handleLogin = () => {
    try {
      const tmpErrorHandler = {};
      const activeFields = ["email", "password", "name", "education", "skills"];

     Object.keys(inputErrorHandler).forEach((obj) => {
      if (
  activeFields.includes(obj) &&
  inputErrorHandler[obj].required &&
  inputErrorHandler[obj].untouched
) {

          tmpErrorHandler[obj] = {
            required: true,
            untouched: false,
            error: true,
            message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
          };
        } else {
          tmpErrorHandler[obj] = inputErrorHandler[obj];
        }
      });

      let updatedDetails = {
        ...signupDetails,
        skills: chips.filter((item) => item.trim() !== ""),
        education: education
          .filter((edu) => edu.institutionName.trim() !== "")
          .map((edu) => ({
            institutionName: edu.institutionName,
            startYear: edu.startYear,
            endYear: edu.endYear,
          })),
      };
      setSignupDetails(updatedDetails);

      // FIX: use computed field-checks instead of inverted untouched-logic
      // const verified = allFieldsCheckedApplicant;
 const verified =
  signupDetails.type === "applicant"
    ? allFieldsCheckedApplicant
    : allFieldsCheckedRecruiter;


      if (verified) {
        axios
          .post(apiList.signup, updatedDetails)
          .then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("type", response.data.type);
            localStorage.setItem("id", response.data._id);
            setLoggedin(isAuth());
            setPopup({
              open: true,
              icon: "success",
              message: "Logged in successfully",
            });
            history("/referrals");
            console.log("export" + response);
            console.log(response?.data.type);
          })
          .catch((err) => {
            setPopup({
              open: true,
              icon: "warn",
              message: err.response?.data?.message || "Signup failed",
            });
            console.log(err.response?.data?.message);
          });
      } else {
        setInputErrorHandler(tmpErrorHandler);
        setPopup({
          open: true,
          icon: "error",
          message: "Incorrect Input",
        });
      }
    } catch (error) {
      // FIX: correct error path
      setPopup({
        open: true,
        icon: "error",
        message: error?.response?.data?.message || "Signup failed",
      });
    }
  };

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    const activeFields = ["email", "password", "name", "bio", "contactNumber"];

    Object.keys(inputErrorHandler).forEach((obj) => {
      if (
  activeFields.includes(obj) &&
  inputErrorHandler[obj].required &&
  inputErrorHandler[obj].untouched
) {

        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    // FIX: build updatedDetails once, from existing state + phone
    let updatedDetails = {
      ...signupDetails,
      contactNumber: phone ? `+${phone}` : "",
    };

    setSignupDetails(updatedDetails);

    // FIX: use the computed checks (same pattern as applicant)
    const verified = allFieldsCheckedRecruiter;

    console.log(updatedDetails);

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          localStorage.setItem("id", response.data._id);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            icon: "success",
            message: "Logged in successfully",
          });
          console.log(response);
          history("/admin");
        })
        .catch((err) => {
          setPopup({
            open: true,
            icon: "error",
            message: err.response?.data?.message || "Signup failed",
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        icon: "error",
        message: "Incorrect Input",
      });
    }
  };

  const uploadFile = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    let images = "";
    let files = e.target.files;

    if (files && files.length > 0) {
      let formData = new FormData();
      for (let i of files) {
        formData.append("file", i);
        formData.append("upload_preset", "jobportal");
        formData.append("folder", "jobportal");
        let response = await toast.promise(apiUploadImages(formData), {
          pending: "Uploading images...",
          success: "Images uploaded successfully 👌",
          error: "Error uploading images 🤯",
        });
        if (response.status === 200) images = response.data?.secure_url;
        console.log(images);
        // clear formData for next file
        formData = new FormData();
      }

      setIsLoading(false);
      setImagesPreview(images);
      setSignupDetails((prevDetails) => ({
        ...prevDetails,
        profile: images,
      }));
    }
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8e5d4] md:py-24">
      <div className="bg-white rounded-2xl pt-10 md:px-8 px-6 pb-8 text-left md:w-4/12 w-11/12 mx-auto">
        <h2 className="text-4xl font-semibold text-gray-900 leading-none">
          Welcome to Job Portal
        </h2>
        <p className="text-md text-gray-600 pb-8">
          The information you add below is used to make your referrals more
          credible and it can be edited later.
        </p>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 bg-white">
            Select a type
          </label>
          <select
            className="block border border-grey-light w-full p-3 rounded mb-4"
            value={signupDetails.type}
            onChange={handleChange}
          >
            <option value="applicant" className="rounded mb-4 text-gray-950">
              Applicant
            </option>
            <option value="recruiter" className="rounded mb-4 text-gray-950">
              Recruiter
            </option>
          </select>
        </div>

        <InputField
          type="text"
          label="Name"
          value={signupDetails.name}
          error={inputErrorHandler.name.message}
          onChange={(e) => handleInput("name", e.target.value)}
          placeholder="Firstname Lastname"
          onBlur={(e) => {
            if (e.target.value === "") {
              handleInputError("name", true, "Name is required!");
            } else {
              handleInputError("name", false, "");
            }
          }}
          className="mb-4"
        />
        <InputField
          type="email"
          label="Email"
          value={signupDetails.email}
          error={inputErrorHandler.email.message}
          onChange={(e) => handleInput("email", e.target.value)}
          placeholder="email@example.com"
          onBlur={(e) => {
            if (e.target.value === "") {
              handleInputError("email", true, "Email is required!");
            } else {
              handleInputError("email", false, "");
            }
          }}
          className="mb-4"
        />
        <InputField
          type="password"
          label="Password"
          value={signupDetails.password}
          error={inputErrorHandler.password.message}
          onChange={(e) => handleInput("password", e.target.value)}
          placeholder="Your password"
          onBlur={(e) => {
            if (e.target.value === "") {
              handleInputError("password", true, "Password is required!");
            } else {
              handleInputError("password", false, "");
            }
          }}
          className="mb-4"
        />
        {signupDetails.type === "applicant" ? (
          <>
            {education.map((edu, index) => (
              <div
                className="mb-2"
                onBlur={(e) => {
                  if (e.target.value === "") {
                    handleInputError(
                      "education",
                      true,
                      "Education is required!"
                    );
                  } else {
                    handleInputError("education", false, "");
                  }
                }}
                key={index}
              >
                <div className="flex justify-between">
                  <InputField
                    type="text"
                    label={`Institution Name ${index + 1}`}
                    value={edu.institutionName}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].institutionName = e.target.value;
                      setEducation(newEducation);
                    }}
                    placeholder="Institution name"
                    className="mb-1"
                  />
                  <InputField
                    type="number"
                    label={`Start Year ${index + 1}`}
                    value={edu.startYear}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].startYear = e.target.value;
                      setEducation(newEducation);
                    }}
                    placeholder="Start year"
                    className="mb-1"
                  />
                  <InputField
                    type="number"
                    label={`End Year ${index + 1}`}
                    value={edu.endYear}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].endYear = e.target.value;
                      setEducation(newEducation);
                    }}
                    placeholder="End year"
                    className="mb-1"
                  />
                </div>
                <span className="text-[#ff3131] text-sm font-semibold">
                  {inputErrorHandler.education.message}
                </span>
              </div>
            ))}
            <div>
              <button
                className="block w-full border p-3 rounded mb-4 bg-yellow-300"
                onClick={() =>
                  setEducation([
                    ...education,
                    {
                      institutionName: "",
                      startYear: "",
                      endYear: "",
                    },
                  ])
                }
              >
                Add another institution details
              </button>
            </div>

            <>
              <MuiChipsInput
                label="Skill *"
                helperText="Please enter to add skill"
                value={chips}
                onChange={handleChip}
                className="block border border-grey-light w-full p-3 rounded mb-4 focus:ring-primary focus:border-primary"
              />
            </>
          </>
        ) : (
          <>
            <InputField
              label="bio (upto 250 words)"
              style={{ width: "100%" }}
              value={signupDetails.bio}
              onChange={(e) => {
                if (
                  e.target.value.split(" ").filter(function (n) {
                    return n !== "";
                  }).length <= 250
                ) {
                  handleInput("bio", e.target.value);
                }
              }}
              error={inputErrorHandler.bio.message}
              onBlur={(e) => {
                if (e.target.value === "") {
                  handleInputError("bio", true, "Bio is required!");
                } else {
                  handleInputError("bio", false, "");
                }
              }}
              className="mb-4"
            />
            <div
              onBlur={(e) => {
                if (e.target.value === "") {
                  handleInputError(
                    "contactNumber",
                    true,
                    "Contact Number is required!"
                  );
                } else {
                  handleInputError("contactNumber", false, "");
                }
              }}
            >
              <div>
                <PhoneInput
                  country={"vn"}
                  value={phone}
                  // onChange={(phone) => setPhone(phone)}
                  onChange={(phone) => {
                  setPhone(phone);
                  handleInput("contactNumber", `+${phone}`);
                }}

                />
              </div>
              <span className="text-[#ff3131] text-sm font-semibold">
                {inputErrorHandler.contactNumber.message}
              </span>
            </div>
          </>
        )}
        <div className="w-full mb-6">
          <h2 className="font-semibold text-xl py-4">
            Avatar <span className="text-red-500">*</span>
          </h2>
          <div className="w-full">
            <label
              className="w-full border-2 h-[200px] my-4 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md"
              htmlFor="file"
            >
              <div className="flex flex-col items-center justify-center">
                Upload image
              </div>
            </label>
            <input
              onChange={uploadFile}
              hidden
              type="file"
              id="file"
              multiple
            />
            <div className="w-full">
              <h3 className="font-medium py-4">Select image</h3>
              <div className="flex gap-4 items-center">
                {signupDetails.profile ? (
                  <div className="relative w-1/3 h-1/3">
                    <img
                      src={
                        Array.isArray(signupDetails.profile)
                          ? signupDetails.profile[0]
                          : signupDetails.profile
                      }
                      alt="preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <p>No images selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <label className="block text-black text-sm font-medium mt-8 focus:outline-none outline-none">
          <input
            className="mr-2 leading-tight text-primary"
            type="checkbox"
            checked={signupDetails.news}
            onChange={() =>
              setSignupDetails((prevDetails) => ({
                ...prevDetails,
                news: !prevDetails.news,
              }))
            }
          />
          <span className="text-sm">
            Keep me up-to-date on exclusive Greet updates and new job posts! You
            can opt-out at any time.
          </span>
        </label>

       <button
  className="mt-2 w-full font-semibold px-4 py-3 rounded-lg text-sm bg-primary hover:bg-[#F2994A] cursor-pointer"
  onClick={() => {
    signupDetails.type === "applicant"
      ? handleLogin()
      : handleLoginRecruiter();
  }}
>
  Create your account
</button>


        <p className="text-xs text-center mt-6">
          By creating an account you agree to Greet's Terms and Conditions.
        </p>
      </div>
    </div>
  );
}



// import React, { useState, useContext } from "react";
// import InputField from "components/InputField";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { SetPopupContext } from "App";
// import axios from "axios";
// import apiList from "../../../libs/apiList";
// import { MuiChipsInput } from "mui-chips-input";
// import { useNavigate } from "react-router-dom";

// export default function SignUp() {
//   const history = useNavigate();
//   const setPopup = useContext(SetPopupContext);

//   const [type, setType] = useState("applicant");
//   const [chips, setChips] = useState([]);
//   const [phone, setPhone] = useState("");

//   const [education, setEducation] = useState([
//     { institutionName: "", startYear: "", endYear: "" },
//   ]);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     bio: "",
//     contactNumber: "",
//   });

//   /* ================= HELPERS ================= */

//   const handleChange = (key, value) => {
//     setForm((p) => ({ ...p, [key]: value }));
//   };

//   const isApplicantValid = () =>
//     form.name && form.email && form.password;

//   const isRecruiterValid = () =>
//     form.name &&
//     form.email &&
//     form.password &&
//     form.bio &&
//     form.contactNumber.replace(/\D/g, "").length >= 10;

//   /* ================= SUBMIT ================= */

//  const handleSubmit = async () => {
//   console.log("SUBMIT CLICKED");

//   const valid =
//     type === "applicant"
//       ? isApplicantValid()
//       : isRecruiterValid();

//   if (!valid) {
//     setPopup({
//       open: true,
//       icon: "error",
//       message: "Please fill all required fields",
//     });
//     return;
//   }

//   try {
//     const cleanEducation =
//       type === "applicant"
//         ? education.filter(
//             (e) =>
//               e.institutionName &&
//               e.startYear &&
//               e.endYear
//           )
//         : [];

//   const payload = {
//   type,
//   name: form.name,
//   email: form.email,
//   password: form.password,

//   // 🔥 REQUIRED DEFAULTS (VERY IMPORTANT)
//   profile: "",            // avatar
//   resume: "",             // resume
//   dateOfBirth: new Date(),// backend safe
//   news: false,            // checkbox default

//   bio: type === "recruiter" ? form.bio : "",
//   contactNumber:
//     type === "recruiter" ? form.contactNumber : "",

//   skills:
//     type === "applicant" && chips.length > 0
//       ? chips
//       : ["Not specified"],

//   education:
//     type === "applicant" && cleanEducation.length > 0
//       ? cleanEducation
//       : [],
// };


//     console.log("PAYLOAD:", payload);

//     await axios.post(apiList.signup, payload);

//     setPopup({
//       open: true,
//       icon: "success",
//       message: "Account created successfully",
//     });

//     history(type === "applicant" ? "/referrals" : "/admin");
//  } catch (err) {
//   console.log("BACKEND ERROR:", err.response?.data);

//   setPopup({
//     open: true,
//     icon: "error",
//     message: err.response?.data?.message || "Signup failed",
//   });
// }

// };

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-[#f8e5d4] py-20">
//       <div className="bg-white p-8 rounded-xl w-11/12 md:w-4/12 mx-auto">

//         <h2 className="text-2xl font-bold mb-6">Create Account</h2>

//         <select
//           className="w-full border p-3 rounded mb-4"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//         >
//           <option value="applicant">Applicant</option>
//           <option value="recruiter">Recruiter</option>
//         </select>

//         <InputField
//           label="Name"
//           value={form.name}
//           onChange={(e) => handleChange("name", e.target.value)}
//         />

//         <InputField
//           label="Email"
//           type="email"
//           value={form.email}
//           onChange={(e) => handleChange("email", e.target.value)}
//         />

//         <InputField
//           label="Password"
//           type="password"
//           value={form.password}
//           onChange={(e) => handleChange("password", e.target.value)}
//         />

//         {/* APPLICANT */}
//         {type === "applicant" && (
//           <>
//             {education.map((edu, i) => (
//               <div key={i} className="flex gap-2 mb-2">
//                 <input
//                   className="border p-2 w-1/3"
//                   placeholder="Institute"
//                   value={edu.institutionName}
//                   onChange={(e) => {
//                     const arr = [...education];
//                     arr[i].institutionName = e.target.value;
//                     setEducation(arr);
//                   }}
//                 />
//                 <input
//                   className="border p-2 w-1/3"
//                   placeholder="Start Year"
//                   value={edu.startYear}
//                   onChange={(e) => {
//                     const arr = [...education];
//                     arr[i].startYear = e.target.value;
//                     setEducation(arr);
//                   }}
//                 />
//                 <input
//                   className="border p-2 w-1/3"
//                   placeholder="End Year"
//                   value={edu.endYear}
//                   onChange={(e) => {
//                     const arr = [...education];
//                     arr[i].endYear = e.target.value;
//                     setEducation(arr);
//                   }}
//                 />
//               </div>
//             ))}

//             <MuiChipsInput
//               label="Skills (press Enter)"
//               value={chips}
//               onChange={setChips}
//             />
//           </>
//         )}

//         {/* RECRUITER */}
//         {type === "recruiter" && (
//           <>
//             <textarea
//               className="border p-3 w-full rounded mb-4"
//               placeholder="Bio"
//               value={form.bio}
//               onChange={(e) => handleChange("bio", e.target.value)}
//             />

//             <PhoneInput
//               country="in"
//               value={phone}
//               onChange={(p) => {
//                 setPhone(p);
//                 handleChange("contactNumber", `+${p}`);
//               }}
//             />
//           </>
//         )}

//         <button
//           className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded font-semibold"
//           onClick={handleSubmit}
//         >
//           Create Account
//         </button>
//       </div>
//     </div>
//   );
// }
