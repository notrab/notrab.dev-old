import React from "react";
import { Link } from "gatsby";

function Post({ slug, frontmatter }) {
  const { date, title } = frontmatter;

  return (
    <li key={slug}>
      <Link to={`/posts/${slug}`}>{title}</Link>
      <span className="ml-1 text-gray-400">&mdash; {date}</span>
    </li>
  );
}

export default Post;
