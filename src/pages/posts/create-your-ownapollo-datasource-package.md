---
title: Create your own Apollo Datasource package
date: 2020-06-08
---

Apollo [data sources](https://www.apollographql.com/docs/apollo-server/data/data-sources) are a great way to interface with your data(base) in Apollo Server.

The Apollo docs will teach you a lot more about using Apollo data sources, and all their configuration. **The purpose of this tutorial is to encourage you to think of ways you can use data sources to improve your workflow**.

I have recently started to explore the [Give Food API](https://www.givefood.org.uk/api). It's a REST API that aims to index all of the UK food banks, covering networked and independent organisations.

I started working on a few projects using the REST API, but I wanted a way to interface with Give Food using GraphQL.

Since Give Food don't have a native GraphQL API, I decided to explore creating an Apollo Server that masked requests to Give Food using the [`apollo-datasource-rest`](https://www.npmjs.com/package/apollo-datasource-rest) module.

However, there is a 2nd GraphQL API which needs access to Give Food API. Instead of creating the `GiveFoodDataSource` class again in that repo, I decided to package this up into an [NPM module](https://www.npmjs.com/package/apollo-datasource-givefood) that can be imported and used directly with Apollo Server.

```bash
npm i apollo-datasource-givefood
```

[Apollo Server](https://www.apollographql.com/docs/apollo-server) accepts a `dataSources` function that expects your data sources.

```js
import { GiveFoodDataSource } from "apollo-datasource-givefood";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    givefood: new GiveFoodDataSource(),
  }),
});
```

These data sources are then accessible inside your GraphQL resolver `context`.

```js
Query: {
  foodbank: async (_source, { slug }, { dataSources }) => {
    return dataSources.givefood.getBySlug(slug);
  },
}
```

## What's involved?

The `GiveFoodDataSource` class extends the `RESTDataSource` and has defined the methods for retrieving data from the Give Food REST API.

Give Food exposes an API for all organisations, food bank by slug, and search params for lat/lng or address.

It made sense to split all of this out into 4 methods:

- `getAll()`
- `getBySlug(slug)`
- `getByLatLng(lat, lng)`
- `getByAddress(address)`

For each of these methods, we can use the class methods to `get` data from our `baseURL`. `baseURL` is required by `RESTDataSource` and all requests to `get`/`post`, etc. are relative to this.

In the end, the code ended up being:

```js
const { RESTDataSource } = require("apollo-datasource-rest");

class GiveFoodDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://www.givefood.org.uk/api/1/";
  }

  async getAll() {
    return this.get("foodbanks");
  }

  async getBySlug(slug) {
    return this.get(`foodbank/${slug}`);
  }

  async getByLatLng(lat, lng) {
    return this.get(`foodbanks/search`, {
      lattlong: `${lat},${lng}`,
    });
  }

  async getByAddress(address) {
    return this.get(`foodbanks/search`, {
      address,
    });
  }
}
```

You can even go further by subclassing the `GiveFoodDataSource` if Give Food updated their API `baseURL`, or you wanted to add a method.

```js
import { GiveFoodDataSource } from "apollo-datasource-givefood";

class FoodBanks extends GiveFoodDataSource {
  constructor() {
    super();
    this.baseURL = "...";
  }

  getFoodBankBySlug(slug) {
    return this.getBySlug(slug);
  }
}
```

I hope this is some help and inspiration to start building your own data sources. As you can see, this package isn't doing much but providing a clear and declarative way to call the Give Food API.

This is now available inside my GraphQL context. 🚀

## Links

- [GitHub](https://github.com/notrab/apollo-datasource-givefood)
- [NPM](https://www.npmjs.com/package/apollo-datasource-givefood)
- [Apollo Data sources](https://www.apollographql.com/docs/apollo-server/data/data-sources/)
