import React from "react";
import { MDXProvider } from "@mdx-js/react";

import "./src/styles/tailwind.css";

import CodeBlock from "./src/components/CodeBlock";
import RecentPosts from "./src/components/RecentPosts";

export const wrapPageElement = ({ element }) => {
  return (
    <MDXProvider components={{ RecentPosts, pre: CodeBlock }}>
      {element}
    </MDXProvider>
  );
};
