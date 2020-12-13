---
title: Learn GraphQL middleware in 6 minutes
date: 2020-01-10
---

GraphQL middleware can be an easy way to abstract schema modifications from your resolvers and allow data to flow around them in the format they should be.

In this example we'll quickly explore how to setup and configure GraphQL middleware with Apollo Server.

<YouTube youTubeId="5ydCPvrWRmg" />

It's as easy as importing `applyMiddleware` from the `graphql-middleware` package and applying it to your schema.

```js
const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server");
const { applyMiddleware } = require("graphql-middleware");

const uppercaseCategory = async (resolve, parent, args, context, info) => {
  const result = await resolve(parent, args, context, info);

  return result.toUpperCase();
};

const postsMiddleware = async (resolve, parent, args, context, info) => {
  const result = await resolve(parent, args, context, info);

  const formattedPosts = result.reduce(
    (formatted, post) => [
      ...formatted,
      {
        ...post,
        title: `${post.category}: ${post.title}`,
      },
    ],
    []
  );

  return formattedPosts;
};

const postMiddleware = {
  Post: {
    category: uppercaseCategory,
  },
  Query: {
    posts: postsMiddleware,
  },
};

const middleware = [postMiddleware];

const schemaWithMiddleware = applyMiddleware(schema, ...middleware);

const server = new ApolloServer({ schema: schemaWithMiddleware });
```

## Links

- [Code for tutorial](https://github.com/notrab/video-graphql-middleware)
- [`graphql-middleware`](https://github.com/prisma-labs/graphql-middleware)
