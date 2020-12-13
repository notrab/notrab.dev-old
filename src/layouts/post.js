import React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";

import Layout from "../components/Layout";

function PostLayout({ pageContext, children }) {
  const { frontmatter } = pageContext;
  const { title } = frontmatter;

  return (
    <Layout>
      <Helmet title={title} />
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
