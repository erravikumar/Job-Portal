import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { userType } from "libs/isAuth";

export default function Banner({ title, link, button }) {
  const type = userType();

  // Show banner only if user is applicant or not logged in
  if (type !== "applicant" && type !== "") {
    return null;
  }

  return (
    <div className="bg-primary md:py-32 py-16">
      <div className="w-10/12 mx-auto text-center">
        <h1 className="pb-12 text-black md:text-5xl text-4xl font-bold">
          {title}
        </h1>

        <Link
          to={link}
          className="inline-flex items-center justify-center w-60 px-8 py-3 
            text-base font-medium rounded-md 
            text-primary bg-black 
            border border-transparent
            md:py-4 md:text-lg md:px-10
            transform transition ease-in duration-200 
            hover:-translate-y-2 hover:shadow-lg"
        >
          {button}
          <FontAwesomeIcon className="ml-3 text-sm" icon={faArrowRight} />
        </Link>
      </div>
    </div>
  );
}
