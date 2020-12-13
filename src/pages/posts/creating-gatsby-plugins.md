---
title: Creating Gatsby Plugins
date: 2020-01-12
---

The Gatsby plugin ecosystem is there when it's time to stop rewriting the same boilerplate and abstract it into a module to share with others, and stop yourself in the future from rewriting and maintaining the same code across projects.

The "plug and play" approach to Gatsby plugins has always fascinated me. I'm a long time user of GraphQL, and it's really nice to be able to drop in a plugin, define a query and have Gatsby call out to an external API, such as a [headless API](https://graphcms.com).

In this short guide we will explore how I created a Gatsby plugin for the popular [StaticKit](https://statickit.com) API.

> StaticKit is the serverless backend for static sites.

I recommend signing up if you ever need to deal with forms on a static site. I use StaticKit for a few of my side projects and constantly amazed by the developer experience.

If you're working with React, StaticKit expects you to install a [`<StaticKitProvider`](https://statickit.com/docs/react#context) around your app, and pass in your `Site ID`. When using Gatsby you'll most likely want to use the `wrapRootElement` API inside `gatsby-{ssr,browser}.js` so all pages inside your Gatsby application have access to the StaticKit context.

If you don't already have a `gatsby-{ssr,browser}.js` file, then this creating one to add a provider around your application just might feel like unnecessary boilerplate, especially if you have to repeat this on multiple Gatsby sites. **We can avoid this by creating a Gatsby plugin that handles this for us.**

The same could be said about creating a `gatsby-config.js` file but it's probably close to certain that you will be adding more plugins to simplify setup.

## How should the plugin work?

Well, we've not yet created anything but let's explore how simple it should be to install the StaticKit provider...

```bash
yarn add gatsby-plugin-statickit # npm install gatsby-plugin-statickit
```

```js
// In your gatsby-config.js

plugins: [
  {
    resolve: `gatsby-plugin-statickit`,
    options: {
      siteId: "...",
    },
  },
];
```

As you see above all we need to do is pass `siteId` to the `gatsby-plugin-statickit` plugin and it will take care of the rest.

Really, that's all we need. 😍

## Create a plugin

Gatsby has fantastic documentation on [creating your own plugin](https://www.gatsbyjs.org/docs/creating-plugins/), so I'd recommend you follow that if you're creating anything more sophisticated than what we are about to in this post.

I started by creating a [local plugin](https://www.gatsbyjs.org/docs/creating-a-local-plugin/) folder named `plugins/gatsby-plugin-statickit`.

Inside here I created the following files:

- `gatsby-ssr.js`
- `gatsby-browser.js`
- `gatsby-node.js`
- `index.js`
- `package.json`

Inside `package.json`, give your package a name, description and version.

```json
{
  "name": "gatsby-plugin-your-plugin-name",
  "description": "Give your plugin a description.",
  "version": "1.0.0",
  "main": "index.js",
  "keywords": ["gatsby", "gatsby-plugin", "your-plugin-name"]
}
```

Since I was going to build a plugin to automatically wrap my application with the `StaticKitProvider`, it was important that I declared StaticKit and Gatsby both peer dependencies.

```bash
cd plugins/gatsby-plugin-statickit
yarn add -P @statickit/react gatsby
```

_Note: `-P` declares `@statickit/react` a peer dependency._

We use peer dependencies here since we don't want to bundle our own version of `@statickit/react` but instead rely on the end user to install it within their application. This means any time the dependency updates, we won't have to update the plugin code, unless there's a breaking change!

## Improve developer experience

Since we're declaring peer dependencies with our plugin, it wouldn't be a great experience for someone installing our plugin to try to use it without the peer dependencies. They'd run into errors and that's not what we want!

Inside `gatsby-node.js` we'll `try` to resolve the `@statickit/react` dependency, otherwise we'll `catch` any errors and throw them to the user.

```js
// gatsby-node.js

try {
  require.resolve("@statickit/react");
} catch (err) {
  throw new Error(`
  '@statickit/react' is not installed. You must install this to use 'gatsby-plugin-statickit'`);
}
```

Now if we try to add our plugin to `gatsby-plugins.js` and run our application, we'll be warned if we haven't met the peer dependency `@statickit/react`.

I'm not too concerned about checking for `gatsby` as that would be thrown by your application itself, as there would be no `gatsby` dependency found to run it!

## Plugin code

Gatsby exports a `wrapRootElement` from it's Node APIs to both `gatsby-browser.js` and `gatsby-ssr.js`.

Let's first add the following to `gatsby-browser.js`:

```js
export { wrapRootElement } from "./gatsby-ssr";
```

Here we're basically writing clean code, ([_sorry Dan_](https://twitter.com/dan_abramov/status/1130951861123657730?lang=en)) so we only have to declare `wrapRootElement` once.

Now inside `gatsby-ssr.js` we'll perform the magic!

Since we're using JSX we need to import React. We'll also import the `StaticKitProvider` from `@statickit/react` and use that to wrap the root `element`.

```js
import React from "react";
import { StaticKitProvider } from "@statickit/react";

export const wrapRootElement = ({ element }, { siteId }) => {
  if (!siteId)
    throw new Error(
      `'siteId' must be provided when using  'gatsby-plugin-statickit' `
    );

  return <StaticKitProvider site={siteId}>{element}</StaticKitProvider>;
};
```

A few things are going on here... The first argument of `wrapRootElement` is the "Root" React Element built by Gatsby, and, the second argument is our `pluginOptions` object containing options defined in `gatsby-config.js`.

We need the `siteId` from the `pluginOptions` to first check it exists and if it does, add it as a prop to `StaticKitProvider`.

Then all we need to do inside our `wrapRootElement` function is return the provider the `{element}` as the children.

That's it! Now we have a fully functioning plugin that does what we want.

The final code can be found on [GitHub](https://github.com/notrab/gatsby-plugin-statickit) and [NPM](https://www.npmjs.com/package/gatsby-plugin-statickit).

Huge thanks to [Derrick](https://www.derrickreimer.com/) for creating an awesome API!
