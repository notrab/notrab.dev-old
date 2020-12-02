import React from "react";

import Post from "./Post";

function PostList({ posts = [] }) {
  if (!posts || posts.length === 0) return null;

  return <ul>{posts.map(Post)}</ul>;
}

export default PostList;
