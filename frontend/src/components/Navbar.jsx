import { Disclosure } from "@headlessui/react";
import logo from "assets/images/logo.png";
import HowIt from "./HowIt";
import { Link, useLocation } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlog, faPlus } from "@fortawesome/free-solid-svg-icons";
import ProfileMenu from "./ProfileMenu";
import { userType } from "libs/isAuth";
import isAuth from "libs/isAuth";
import Blog from "./blog/Blog";

export default function Navbar() {
  const linkUrl = useLocation();
  const auth = isAuth();
  const type = userType() || null; // recruiter / jobseeker / null

  const isBlog = linkUrl.pathname.startsWith("/blog");

  return (
    <Disclosure as="nav" className="bg-[#FFF5EC] w-full">
      <div className="flex justify-between h-24 py-6 md:w-10/12 w-11/12 mx-auto">
        
        {/* Left Side Logo + Links */}
        <div className="flex">
          <Link className="flex pt-1" to={isBlog ? "/blog" : "/"}>
            <img
              className="md:pl-5 pl-2"
              src={logo}
              alt="JobPortal logo"
            />
            <h1 className="md:pl-2 pl-2 text-2xl sm:text-2xl md:text-3xl text-[#F2994A] font-medium hover:opacity-60">
              JobPortal
            </h1>
            {isBlog && <FontAwesomeIcon icon={faBlog} className="ml-2 text-gray-600" />}
          </Link>

          <div className="flex pt-0.5 pl-8">
            {isBlog ? (
              <>
                <Link
                  className="lg:block hidden text-[#333333] text-lg font-semibold px-3 py-2 hover:opacity-60"
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className="lg:block hidden text-[#333333] text-lg font-semibold px-3 py-2 hover:opacity-60"
                  to="/blog/news"
                >
                  News
                </Link>
                <Link
                  className="lg:block hidden text-[#333333] text-lg font-semibold px-3 py-2 hover:opacity-60"
                  to="/blog/programming-language"
                >
                  Programming Language
                </Link>
              </>
            ) : (
              <>
                <HowIt />
                <Link
                  className="lg:block hidden text-[#333333] text-lg font-semibold px-3 py-2 hover:opacity-60"
                  to="/jobs"
                >
                  Jobs
                </Link>
                <Link
                  className="lg:block hidden text-[#333333] text-lg font-semibold px-3 py-2 hover:opacity-60"
                  to="/companies"
                >
                  Companies
                </Link>
                <Link
                  className="lg:block hidden text-[#333333] text-lg font-semibold px-3 py-2 hover:opacity-60"
                  to="/leaderboard"
                >
                  Leaderboard
                </Link>
                <Blog />
              </>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center">
          {!isBlog && (
            <>
              <MobileMenu />

              {auth ? (
                <>
                  {type === "recruiter" && (
                    <Link
                      to="/create-new-job"
                      className="hidden sm:flex items-center font-semibold text-sm justify-center px-6 py-2 bg-black rounded-lg mr-6 text-white hover:opacity-80"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Create new job
                    </Link>
                  )}
                  <ProfileMenu type={type} />
                </>
              ) : (
                <>
                  <Link
                    className="lg:block hidden text-black text-lg font-semibold pr-6 py-2 hover:opacity-60"
                    to="/sign-in"
                  >
                    Sign in
                  </Link>
                  <Link
                    className="lg:block hidden text-center transform ease-in duration-100 hover:-translate-y-1 hover:shadow-lg px-6 py-2 bg-[#F2994A] text-white rounded-full text-lg font-semibold"
                    to="/sign-up"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Disclosure>
  );
}
