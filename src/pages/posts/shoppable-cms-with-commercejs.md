---
title: Shoppable CMS with Commerce.js
date: 2021-03-18
---

Most of the time the Headless CMS is thought of as a place you fetch data from, or if your CMS supports it, a API to mutate data too. But, what if your CMS isn't the only source of truth for your data? What do we do if we want to connect content entries from one system to another?

Thankfully, APIs like [GraphCMS](https://graphcms.com) allow you to embed datasources from other APIs into its own GraphQL Content API — [Read more](https://graphcms.com/blog/introducing-content-federation).

One of the most commonly created content types inside any CMS is going to be a Page, right?. These page entries typically contain titles, repeatable content blocks, related pages, SEO data, and much more.

It's also common to query data from multiple sources on a page at runtime, or during build. We could very easily query content from a CMS, and a [commerce API](https://commercejs.com) separately.

With GraphCMS, you can fetch this data in a single GraphQL query. GraphCMS will take care of authenticating, and returning the data from any other content source you configure.

You can fetch all of the data for your content page, as well as the associated product(s), price, and images from [Commerce.js](https://commercejs.com).

![GraphCMS query](/graphcms-query.png)

No matter your frontend, whether it be [React](https://commercejs.com/frameworks/react-ecommerce/), [Vue](https://commercejs.com/frameworks/vue-ecommerce/), Angular, [Svelte](https://commercejs.com/frameworks/svelte-ecommerce/), or traditional server rendered pages, anywhere you can make a fetch request, you can now get all the data you need in one trip.

![GraphCMS data request pipeline](/graphcms-data-request.png)

The request to fetch products from the Commerce.js API also benefits from being strongly typed, self documenting, and works with GraphiQL autocomplete out of the box.

![GraphiQL with Chec product responses](/graphiql-chec-product.png)

## How?

You'll need to use the [GraphCMS Management SDK](https://github.com/GraphCMS/management-sdk) to generate the GraphQL types for Commerce.js, and create the remote field.

Here we'll create the type definitions:

```js
const { newMigration, FieldType } = require("@graphcms/management");

const migration = newMigration({
  authToken: "...",
  endpoint: "..",
});

migration.createRemoteTypeDefinition({
  definition:
    "type ChecProductPrice { raw: Int!, formatted: String!, formatted_with_symbol: String!, formatted_with_code: String! }",
  displayName: "Chec Product Price",
  description: "Fields belonging to the Chec Product Price",
});

migration.createRemoteTypeDefinition({
  definition: "type ChecProductMedia { type: String, source: String }",
  displayName: "Chec Product Media",
  description: "Fields belonging to the Chec Product Media",
});

migration.createRemoteTypeDefinition({
  definition:
    "type ChecProduct { id: ID! name: String!, permalink: String!, price: ChecProductPrice!, media: ChecProductMedia }",
  displayName: "Chec Product",
  description: "Fields belonging to the Chec Product",
});
```

We can also use the Management SDK to programmatically create our Page model, and fields.

```js
const pageModel = migration.createModel({
  apiId: "Page",
  apiIdPlural: "Pages",
  displayName: "Page",
});

pageModel.addSimpleField({
  apiId: "title",
  displayName: "Title",
  description: "Give your page a title",
  type: FieldType.String,
  isRequired: true,
});

pageModel.addSimpleField({
  apiId: "content",
  displayName: "Content",
  type: FieldType.Richtext,
});

pageModel.addSimpleField({
  apiId: "checProductId",
  displayName: "Chec Product ID",
  description: "The ID of the Chec product this page relates to",
  type: FieldType.String,
});
```

The field `checProductId` is what content editors will see when editing pages inside GraphCMS.

![GraphCMS content editor](/graphcms-edit-chec-product-id.jpg)

All that's left to with our Page model is add the remote field configuration, and run the migration.

Below we'll tell GraphCMS how to fetch data for the field `checProduct`, passing it the URL to the Commerce.js API, as well as our public key.

```js
pageModel.addRemoteField({
  apiId: "checProduct",
  displayName: "Chec Product",
  remoteConfig: {
    url: "https://api.chec.io/v1/products/{checProductId}",
    headers: {
      "X-Authorization": "YOUR CHEC PUBLIC KEY HERE",
    },
    method: "GET",
    returnType: "ChecProduct",
  },
});

migration.run();
```

Try it yourself with the following query in your project:

```graphql
{
  pages {
    title
    checProduct {
      id
      name
      permalink
      media {
        type
        source
      }
      price {
        raw
        formatted
        formatted_with_code
      }
    }
  }
}
```

That's it!
