import React from "react";
import news from "data/authors-table-data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function News() {
  console.log("data:", news);

  return (
    <>
      <h1 className="pt-4 px-20 w-full text-2xl font-semibold">News</h1>

      <div className="px-20 pt-10 pb-2">
        <div className="flex items-center gap-6 w-auto h-90">
          {Array.isArray(news) &&
            news.map((data) => (
              <div
                key={data.id}
                className="transform ease-in duration-100 
                  hover:shadow-lg w-full h-full
                  bg-slate-50 rounded-2xl text-left cursor-default
                  border"
              >
                {/* Image */}
                <Link to={`/blog/news/${data.id}`}>
                  <img
                    src={data.img}
                    alt={data.title || "News image"}
                    className="h-40 w-full object-cover rounded-t-2xl hover:opacity-70"
                  />
                </Link>

                {/* Title */}
                <h3 className="w-full h-20 p-4 font-semibold">
                  <Link
                    className="hover:text-red-400 transition duration-200"
                    to={`/blog/news/${data.id}`}
                  >
                    {data.title}
                  </Link>
                </h3>

                {/* Description */}
                <p className="p-4">
                  {data.description
                    ? data.description.slice(0, 80) + "..."
                    : ""}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap mt-3 gap-2 py-4 px-4">
                  {Array.isArray(data.tags) &&
                    data.tags.map((skill, index) => (
                      <div
                        key={index}
                        className="select-none whitespace-nowrap rounded-lg 
                          bg-gray-900/10 py-1.5 px-3 text-xs font-bold uppercase 
                          text-gray-900 hover:bg-gray-900 hover:text-white 
                          transition duration-300"
                      >
                        {skill}
                      </div>
                    ))}
                </div>

                {/* Read more */}
                <div className="flex justify-end m-4">
                  <Link
                    to={`/blog/news/${data.id}`}
                    className="flex items-center gap-2 font-medium 
                      hover:text-blue-500 transition duration-300"
                  >
                    Start reading
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* View all */}
      <span className="pb-10 px-20 w-full text-lg font-medium flex justify-end">
        <Link
          className="border-b-2 border-b-yellow-200 hover:text-yellow-600 
            hover:border-b-yellow-400 transition duration-100 text-yellow-400"
          to="/blog/news"
        >
          View all
        </Link>
      </span>
    </>
  );
}
