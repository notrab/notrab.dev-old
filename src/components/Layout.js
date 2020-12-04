import React from "react";

function Layout({ children }) {
  return (
    <div className="mx-auto py-6 lg:py-12 px-6 lg:px-0 max-w-2xl">
      {children}
    </div>
  );
}

export default Layout;
