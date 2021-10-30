import React from "react";
import { Link } from "gatsby";

function Layout({ children }) {
  return (
    <>
      <div className="p-6 flex justify-between items-center mx-auto max-w-5xl mt-6">
        <Link to="/" activeClassName="text-rose-600">
          <img
            src="/jamie-barton.jpg"
            alt="Jamie Barton"
            className="w-12 h-12"
          />
        </Link>
        <ul className="flex space-x-3 md:space-x-12 text-sm px-6">
          <Link
            to="/"
            className="hover:text-rose-600"
            activeClassName="text-rose-600"
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
          <Link
            to="/now"
            className="hover:text-rose-600"
            activeClassName="text-rose-600"
          >
            Now
          </Link>
          <Link
            to="/uses"
            className="hover:text-rose-600"
            activeClassName="text-rose-600"
          >
            Uses
          </Link>
          <Link
            to="/talks"
            className="hover:text-rose-600"
            activeClassName="text-rose-600"
          >
            Talks
          </Link>
          <Link
            to="/hire"
            className="hover:text-rose-600"
            activeClassName="text-rose-600"
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
