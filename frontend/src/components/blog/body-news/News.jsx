import React from "react";
import news from "data/authors-table-data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function News() {
  return (
    <>
      <h1 className="pt-4 px-20 w-full text-2xl font-semibold">News</h1>

      <div className="px-20 pt-10 pb-2">
        <div className="flex flex-wrap gap-6 w-full">
          {Array.isArray(news) &&
            news.map((item) => (
              <div
                key={item.id}
                className="transform transition duration-200
                hover:shadow-lg w-full md:w-[32%]
                bg-slate-50 rounded-2xl text-left
                border"
              >
                {/* Image */}
                <Link to={`/blog/news/${item.id}`}>
                  <img
                    src={item.img}
                    alt={item.title || "News"}
                    className="h-40 w-full object-cover rounded-t-2xl hover:opacity-80"
                  />
                </Link>

                {/* Title */}
                <h3 className="p-4 font-semibold h-20">
                  <Link
                    to={`/blog/news/${item.id}`}
                    className="hover:text-red-400 transition"
                  >
                    {item.title}
                  </Link>
                </h3>

                {/* Description */}
                <p className="px-4 text-sm text-gray-700">
                  {item.description?.slice(0, 80)}...
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 p-4">
                  {Array.isArray(item.tags) &&
                    item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-lg bg-gray-900/10
                        py-1.5 px-3 text-xs font-bold uppercase
                        text-gray-900 hover:bg-gray-900 hover:text-white
                        transition"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                {/* Read more */}
                <div className="flex justify-end px-4 pb-4">
                  <Link
                    to={`/blog/news/${item.id}`}
                    className="flex items-center gap-2 font-medium
                    hover:text-blue-500 transition"
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
      <div className="pb-10 px-20 flex justify-end">
        <Link
          to="/blog/news"
          className="border-b-2 border-yellow-300
          text-yellow-500 hover:text-yellow-700
          hover:border-yellow-500 transition"
        >
          View all
        </Link>
      </div>
    </>
  );
}
