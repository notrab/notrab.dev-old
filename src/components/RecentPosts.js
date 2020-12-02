import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import PostList from "./PostList";

const QUERY = graphql`
  query allPosts {
    allFile(filter: { sourceInstanceName: { eq: "posts" } }) {
      nodes {
        childMdx {
          slug
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`;

function RecentPosts() {
  const {
    allFile: { nodes },
  } = useStaticQuery(QUERY);

  return (
    <PostList
      posts={nodes.map(({ childMdx: { slug, frontmatter } }) => ({
        slug,
        frontmatter,
      }))}
    />
  );
}

export default RecentPosts;
