// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions;

//   const {
//     data: {
//       allMdx: { nodes },
//     },
//     errors,
//   } = await graphql(
//     `
//       {
//         allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
//           nodes {
//             slug
//           }
//         }
//       }
//     `
//   );

//   if (errors) throw errors;

//   nodes.forEach(({ slug }, index) => {
//     const previous = index === nodes.length - 1 ? null : nodes[index + 1];
//     const next = index === 0 ? null : nodes[index - 1];

//     createPage({
//       path: slug,
//       component: require.resolve(`./src/templates/post.js`),
//       context: {
//         slug,
//         previous,
//         next,
//       },
//     });
//   });
// };
