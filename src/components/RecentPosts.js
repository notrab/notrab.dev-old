import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import PostList from "./PostList";

const QUERY = graphql`
  query allPosts {
    allFile(
      filter: { sourceInstanceName: { eq: "posts" } }
      sort: { order: DESC, fields: childMarkdownRemark___frontmatter___date }
    ) {
      nodes {
        childMdx {
          slug
          frontmatter {
            title
            date(formatString: "MMM, D")
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
