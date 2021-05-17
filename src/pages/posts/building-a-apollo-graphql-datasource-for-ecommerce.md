---
title: Building a Apollo GraphQL Datasource for eCommerce
date: 2021-05-17
---

The last few years have seen a huge rise in GraphQL adoption, and over the last year we've seen eCommerce become the the lifeline for some businesses due to the global pandemic. As businesses have had to adapt to new ways of working, developers across the globe are still faced with the ever growing number of frameworks, platforms, APIs, and SDKs to use for their projects.

One of the options added to that growing list of tools is [GraphQL](https://graphql.org/). The specification released by Facebook engineers in 2015 for fetching, and mutating data.

In this article I want to explore the idea of using the [Commerce.js API](https://commercejs.com/product/commerce-apis/) (formally known as "Chec") with GraphQL. The Commerce.js API doesn't boast a native GraphQL API, however the REST API follows its own convention, and adheres to the REST standards we've grown love over the decades.

Together we will cover the foundations of a GraphQL "gateway" that sits in front of Commerce.js and proxies requests to the underlying API, and returns them back to your GraphQL client of choice.

Like all technical decisions, building and maintaining a server can be extra load for any team, but I would encourage frontend teams already working with GraphQL on the client, to own and build the GraphQL "layer" for the APIs they use.

![GraphQL Layer](/graphql-layer.png)

Building a "GraphQL layer" yields great benefits, not only can you transform a REST API into GraphQL, but you can use it to truly be "one endpoint for all", and stack the different REST APIs you use into one self documenting GraphQL API.

Before we get started, let's take a look at some of the tools we have available to do this. By far the most popular choice is [Apollo Server](https://www.apollographql.com/docs/apollo-server/), and more traditionally there is [`express-graphql`](https://github.com/graphql/express-graphql), backed by [`graphql-js`](https://github.com/graphql/graphql-js), the initial reference from the GraphQL founders.

⚡️ The Guild also manage a huge range of “[graphql tools](https://www.graphql-tools.com/)" that are used with GraphQL on the server side. Some of these projects include merging subschemas into one, known as “schema stitching”, mocking, type-safe code generation, and so much more.

Another thing to note when building GraphQL servers is whether you go code-first, or schema-first.

- Schema-first, or "SDL-first" (Schema Definition Language) indicates that we write the schema first, and create the resolvers by matching the functions to the written schema.
- Code-first, or "resolver-first" starts by us defining the resolvers, and based on attributes we provide to the resolver functions, we can codegen the schema automatically.

The original `graphql-js` can be thought of as code-first, and more recently [Nexus](https://nexusjs.org/). Nexus is type-safe by default, and bonds well with the developer community for increased productivity, and safety that working with TypeScript brings.

Schema-first is by far the most common, mainly due to the lower barrier, and reduced setup overhead. Because of this, we will explore schema-first for our Commerce.js GraphQL API.

Let's begin!

Inside of a new directory, initialize a new NPM package, and install the dependencies:

```bash
npm init -y
npm install apollo-server graphql
```

Next, create the file `server.js` in the root, and add the following:

```js
const { gql, ApolloServer } = require("apollo-server");

const typeDefs = gql`
  type Query {
    products(input: ProductsInput): [Product]
    product(input: ProductInput): Product
  }
  input ProductInput {
    id: ID!
  }
  input ProductsInput {
    limit: Int
    page: Int
    category_slug: String
  }
  type Product {
    id: ID!
    name: String!
    permalink: String!
  }
`;

const resolvers = {
  Query: {
    products: () => [],
    product: () => null,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

So that we can correctly source data from the Commerce.js API (Chec), we could install Commerce.js, [`chec-request`](/posts/a-request-wrapper-for-commercejs), or a fetch library. Thankfully Apollo has a package for this that is a "datasource".

Let's install it:

```bash
npm install apollo-datasource-rest
```

Then using the new package, inside `server.js` we'll import `RESTDataSource` and create 2 new classes.

The first class `ChecAPI` will be our base class that defines our `baseURL` and `X-Authorization` headers.

You'll want to replace `...` with your Chec Public API key below.

```js
const { RESTDataSource } = require("apollo-datasource-rest");

class ChecAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.chec.io/v1/";
  }

  willSendRequest(request) {
    if (!request.headers) {
      request.headers = {};
    }

    request.headers = {
      "X-Authorization": "...",
    };
  }
}
```

Now let's extend the `ChecAPI` class and add a new `ProductAPI` class where we can define the methods for fetching products.

```js
class ProductsAPI extends ChecAPI {
  async getProducts(params) {
    const { data } = await this.get("products", params);

    return data;
  }

  async getProduct(id) {
    return this.get(`products/${id}`);
  }
}
```

Next we'll need to add to the `dataSources` property on `ApolloServer` the newly created `ProductsAPI` class.

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ ProductsAPI: new ProductsAPI() }),
});
```

The contents of `dataSources` is automatically available via the 3rd argument, the "context". We can then use the `ProductsAPI` data source to handle the fetching of our product(s) within our `resolvers`.

Inside `server.js` update the `resolvers` object to look like the following:

```js
const resolvers = {
  Query: {
    products: (_, { input }, { dataSources: { ProductsAPI } }) =>
      ProductsAPI.getProducts(input),
    product: (_, { input: { id } }, { dataSources: { ProductsAPI } }) =>
      ProductsAPI.getProduct(id),
  },
};
```

You'll notice here that our resolvers can stay simple, and contain no logic thanks to the abstraction with `apollo-datasource-rest`.

Now if you start your server, and head to [https://localhost:4000](https://localhost:4000) you will see the GraphQL Playground.

```bash
node index.js
```

Within the GraphQL Playground, you can run perform GraphQL queries, mutations, subscriptions, use HTTP headers, variables, and browse documentation for our schema.

Run the following query to fetch all products:

```graphql
{
  products {
    id
    name
    permalink
  }
}
```

From one of those products copy the `id`, and use it to run another query, this time passing the `id` within the input argument.

```graphql
{
  product(input: { id: "..." }) {
    name
  }
}
```

You'll notice now we get a single product, this is done thanks to the work we did previously inside the ProductsAPI datasource:

```graphql
async getProduct(id) {
  return this.get(`products/${id}`);
}
```

Next let's explore performing two queries at once, one to get a single product, and one to get all.

```graphql
{
  product(input: { id: "..." }) {
    name
  }

  products {
    id
    name
    permalink
  }
}
```

We also mapped the Chec API filters to an input type:

```graphql
input ProductsInput {
  limit: Int
  page: Int
  category_slug: String
}
```

We can use these as part of our products query `input` argument. The following query will fetch all products, limited by 2.

```graphql
{
  products(input: { limit: 2 }) {
    name
  }
}
```

You might be wondering how this is working, and if we take a closer look at the datasource we created earlier, the `params` object is automatically sent as a query string to the API endpoint:

```js
async getProducts(params) {
  const { data } = await this.get("products", params);

  return data;
}
```

Try the same using a `page`, and `category_slug` - if you know it to see the magic happen!
You also also use GraphQL aliases to make the same query, and alias it to something else in the response.

```graphql
{
  singleProduct: product(input: { id: "prod_L1vOoZqkMwRa8Z" }) {
    name
  }

  twoProducts: products(input: { page: 1, limit: 1 }) {
    name
  }

  allProducts: products {
    id
    name
    permalink
  }
}
```

The query above would return the data below, with the aliases as the keys.

```json
{
  "data": {
    "singleProduct": {
      "name": "Ceramic Dutch Oven"
    },
    "twoProducts": [
      {
        "name": "Walnut Cook's Tools"
      },
      {
        "name": "Private Cooking Class"
      }
    ],
    "allProducts": [
      {
        "id": "prod_7ZAMo1eDvoNJ4x",
        "name": "Walnut Cook's Tools",
        "permalink": "walnut-cooks-tools-chopchop-shop"
      },
      {
        "id": "prod_r2LM5Q8baoZV1g",
        "name": "Private Cooking Class",
        "permalink": "private-cooking-class-chopchop-shop"
      },
      {
        "id": "prod_NXELwj0Nm53A4p",
        "name": "Essential Knife Set",
        "permalink": "essential-knife-set-chopchop-shop"
      },
      {
        "id": "prod_L1vOoZqkMwRa8Z",
        "name": "Ceramic Dutch Oven",
        "permalink": "ceramic-dutch-oven-chopchop-shop"
      },
      {
        "id": "prod_0YnEoqLJNwe7P6",
        "name": "Kitchen Sink Journal",
        "permalink": "kitchen-sink-journal-chopchop-shop"
      },
      {
        "id": "prod_QG375vxAxwrMOg",
        "name": "Tote bag",
        "permalink": "tote-chochop-shop"
      }
    ]
  }
}
```

That's it!
