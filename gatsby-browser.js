import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXEmbedProvider } from "mdx-embed";

import "./src/styles/tailwind.css";

import CodeBlock from "./src/components/CodeBlock";
import RecentPosts from "./src/components/RecentPosts";

export const wrapPageElement = ({ element, pageContext }) => {
  return (
    <MDXProvider components={{ RecentPosts, pre: CodeBlock }}>
      <MDXEmbedProvider>{element}</MDXEmbedProvider>
    </MDXProvider>
  );
};
