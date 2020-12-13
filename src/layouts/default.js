import React from "react";
import { Helmet } from "react-helmet";

import Layout from "../components/Layout";

function DefaultLayout({ pageContext, children }) {
  const { frontmatter } = pageContext;
  const { title, meta_title } = frontmatter;

  return (
    <Layout>
      <Helmet title={meta_title || title} />
      <div className="prose">
        <h1>{title}</h1>
        {children}
      </div>
    </Layout>
  );
}

export default DefaultLayout;
