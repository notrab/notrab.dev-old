import React from "react";

import Layout from "../components/Layout";

function PostLayout({ pageContext, children }) {
  const { frontmatter } = pageContext;
  const { title } = frontmatter;

  return (
    <Layout>
      <div className="prose">
        <h1>{title}</h1>
        {children}
      </div>
    </Layout>
  );
}

export default PostLayout;
