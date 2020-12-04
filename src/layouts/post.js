import React from "react";
import { Link } from "gatsby";

import Layout from "../components/Layout";

function PostLayout({ pageContext, children }) {
  const { frontmatter } = pageContext;
  const { title } = frontmatter;

  return (
    <Layout>
      <div className="py-3">
        <Link to="/" className="text-gray-500 hover:text-amber-500 transition">
          &larr; Posts
        </Link>
      </div>

      <div className="prose">
        <h1>{title}</h1>

        {children}
      </div>
    </Layout>
  );
}

export default PostLayout;
