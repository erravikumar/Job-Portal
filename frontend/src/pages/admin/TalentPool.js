import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import apiList from "libs/apiList";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import news from "data/authors-table-data";

export default function TalentPool() {
  const [users, setUsers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /* 🔹 Fetch all users */
  useEffect(() => {
    axios.get(apiList.users).then((res) => {
      setUsers(res.data?.allUser || []);
    });
  }, []);

  /* 🔹 Fetch applicants */
  useEffect(() => {
    axios.get(apiList.allApplicants).then((res) => {
      const filtered = (res.data?.allUser || []).filter(
        (u) => u.skills?.length >= 2 && u.education?.length >= 1
      );
      setApplicants(filtered);
    });
  }, []);

  /* 🔹 Open modal */
  const openModal = (applicant) => {
    const foundUser = users.find(
      (u) => u._id?.toString() === applicant.userId?.toString()
    );

    if (foundUser) {
      setSelectedUser({ ...foundUser, ...applicant });
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="md:w-10/12 w-full mx-auto md:py-28 py-10">
      <h2 className="text-4xl font-semibold text-center mb-8">
        Talent Pool
      </h2>

      {/* 🔹 Applicants */}
      <section className="bg-light shadow-xl rounded-2xl p-8">
        <h2 className="text-indigo-500 text-2xl font-medium">
          Top Players
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {applicants.map((user) => (
            <div
              key={user._id}
              onClick={() => openModal(user)}
              className="flex items-center gap-4 cursor-pointer hover:bg-slate-100 p-3 rounded-xl"
            >
              <img
                src={user.profile}
                alt=""
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-10" />

        {/* 🔹 Blogs */}
        <h2 className="text-indigo-500 text-2xl font-medium">
          Top reference blog
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {news.map((data) => (
            <Link key={data.id} to={`/blog/news/${data.id}`}>
              <div className="flex gap-4 hover:bg-slate-200 rounded-lg p-3">
                <img
                  src={data.img}
                  alt=""
                  className="h-32 w-48 rounded-md object-cover"
                />
                <div>
                  <h3 className="text-xl font-medium">
                    {data.title.slice(0, 30)}...
                  </h3>
                  <p className="text-gray-500 mt-4">
                    By{" "}
                    <span className="text-indigo-600">
                      {data.useUpload}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🔹 Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

            <span className="inline-block h-screen align-middle">&#8203;</span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg p-6 my-8 bg-white rounded-2xl text-left shadow-xl">
                {selectedUser && (
                  <>
                    <h1 className="text-3xl font-semibold">
                      {selectedUser.name}
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                      {selectedUser.email}
                    </p>

                    <div className="space-y-4">
                      <p>
                        <b>Education:</b>{" "}
                        {selectedUser.education
                          ?.map(
                            (e) =>
                              `${e.institutionName} (${e.startYear}-${
                                e.endYear || "Ongoing"
                              })`
                          )
                          .join(", ")}
                      </p>

                      <p>
                        <b>Birthday:</b>{" "}
                        {selectedUser.dateOfBirth
                          ? new Date(
                              selectedUser.dateOfBirth
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {selectedUser.skills?.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-gray-900 text-white text-xs px-3 py-1 rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={closeModal}
                        className="bg-gray-900 text-white"
                      >
                        Close
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
