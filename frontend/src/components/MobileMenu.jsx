import { Popover, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { userType } from "libs/isAuth";

export default function MobileMenu() {
  const buttonRef = useRef();
  const type = userType() || null; // default null if empty/undefined

  return (
    <div className="px-4">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            {/* Toggle Button */}
            <Popover.Button
              ref={buttonRef}
              className="lg:hidden block text-black rounded-md text-lg font-semibold focus:outline-none"
            >
              <FontAwesomeIcon
                className="text-3xl"
                icon={open ? faTimes : faBars}
              />
            </Popover.Button>

            {/* Menu Panel */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="lg:hidden absolute left-1/2 z-10 w-60 mt-2 transform -translate-x-1/2">
                <div className="overflow-hidden rounded-lg shadow-2xl">
                  <div className="bg-white p-3">
                    {/* Common Links */}
                    <Link
                      onClick={() => close()}
                      to="/jobs"
                      className="flex items-center p-2 my-2 rounded-lg hover:bg-gray-100 text-lg font-semibold text-gray-900"
                    >
                      Job board
                    </Link>

                    <Link
                      onClick={() => close()}
                      to="/companies"
                      className="flex items-center p-2 my-2 rounded-lg hover:bg-gray-100 text-lg font-semibold text-gray-900"
                    >
                      Companies
                    </Link>

                    <Link
                      onClick={() => close()}
                      to="/leaderboard"
                      className="flex items-center p-2 my-2 rounded-lg hover:bg-gray-100 text-lg font-semibold text-gray-900"
                    >
                      Leaderboard
                    </Link>

                    {/* Conditional Auth Links */}
                    {type === null ? (
                      <>
                        <Link
                          onClick={() => close()}
                          to="/sign-in"
                          className="flex items-center p-2 my-2 rounded-lg hover:bg-gray-100 text-lg font-semibold text-gray-900"
                        >
                          Sign in
                        </Link>

                        <Link
                          onClick={() => close()}
                          to="/sign-up"
                          className="flex items-center p-2 my-2 rounded-lg hover:bg-gray-100 text-lg font-semibold text-gray-900"
                        >
                          Sign up
                        </Link>
                      </>
                    ) : type === "recruiter" ? (
                      <div className="mt-4">
                        <Link
                          onClick={() => close()}
                          to="/create-new-job"
                          className="flex items-center justify-center px-6 py-2 bg-black text-white font-semibold rounded-lg hover:opacity-80"
                        >
                          <FontAwesomeIcon icon={faPlus} className="mr-2" />
                          Create new job
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
