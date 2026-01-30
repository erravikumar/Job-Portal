import axios from "axios";
import apiList from "../../libs/apiList";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const statuses = ["Open", "Hidden"];

export default function JobStatus({ job, id }) {
  const [selected, setSelected] = useState(job?.status || "Open");
  const ref = apiList.jobs;

  // ✅ jab bhi status change ho, DB update ho
  useEffect(() => {
    if (!id) return;
    updateStatus();
  }, [selected]);

  const updateStatus = async () => {
    try {
      await axios.put(`${ref}/${id}`, {
        status: selected,
      });
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  function generateBtn(status) {
    return status === "Open"
      ? "bg-green-100 text-green-800 border-green-100"
      : "bg-yellow-100 text-yellow-800 border-yellow-100";
  }

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="absolute w-32 -mt-4">
        <Listbox.Button
          className={`${generateBtn(selected)}
            relative w-full py-1 px-3 inline-flex text-xs leading-5 font-semibold rounded-full border-2`}
        >
          <span>{selected}</span>
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faChevronDown} />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="z-50 relative w-full py-1 mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
            {statuses.map((status) => (
              <Listbox.Option
                key={status}
                value={status}
                className="cursor-pointer select-none py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100"
              >
                {status}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
