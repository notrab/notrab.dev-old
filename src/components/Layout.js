import React from "react";
import { Link } from "gatsby";

function Layout({ children }) {
  return (
    <>
      <div className="flex justify-between p-6 mx-auto max-w-5xl">
        <Link
          to="/"
          className=" hover:text-rose-600"
          activeClassName="text-gray-400"
        >
          <svg
            className="w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19z" />
          </svg>
        </Link>
        <ul className="flex space-x-3 md:space-x-12 text-sm">
          <Link
            to="/now"
            className=" hover:text-rose-600"
            activeClassName="text-gray-400"
          >
            Now
          </Link>
          <Link
            to="/uses"
            className=" hover:text-rose-600"
            activeClassName="text-gray-400"
          >
            Uses
          </Link>
          <Link
            to="/hire"
            className=" hover:text-rose-600"
            activeClassName="text-gray-400"
          >
            Hire
          </Link>
        </ul>
      </div>
      <div className="mx-auto py-6 lg:py-12 px-6 lg:px-0 max-w-2xl">
        {children}
      </div>
    </>
  );
}

export default Layout;
