---
title: Get up and running with Tailwind CSS and Next.js
date: 2020-01-11
---

[Tailwind CSS](https://tailwindcss.com/docs/what-is-tailwind/) is winning at being a developer-friendly utility-first CSS framework and if you’re to looking upgrade or start out with a new project, you should give Tailwind a look for your CSS needs.

[View code on GitHub](https://github.com/notrab/nextjs-tailwindcss-starter)

If you follow me already you probably know I’m a huge fan of [Next.js](https://nextjs.org) and if you’ve not heard of Next.js, it’s a lightweight React framework. 😍

I recently tried to get both of the projects working together but it required way more confirmation than I liked. Thanks recent improvements, the [next-css](https://github.com/zeit/next-plugins/tree/master/packages/next-css) library “just works” out of the box with Tailwind CSS.

In this tutorial we’ll cover creating a new Next.js and configuring Tailwind with PostCSS.

## Create a Next.js project

You’ll need to create a new directory for this project. Go ahead and do it now.

### Initialize a new npm project

Open your Terminal, `cd` into your newly created directory and initialize a new NPM project. We’ll provide the `-y` flag to skip asking any questions.

```bash
npm init -y
```

### Install dependencies

Next, we’ll use npm to install Next and React.

```bash
npm install --save next react react-dom
```

### Install dev dependencies

We now need to install some dependencies which are used for compiling CSS, including Tailwind itself.

```bash
npm install --save-dev tailwindcss postcss-preset-env postcss
```

### Configure npm scripts

Installing the dependencies above created a file called `package.json`. This file contains a list of the project dependencies and we’ll now need to edit this file.

Inside package.json you can replace scripts with the following:

```js
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
},
```

### Create a page

Next.js by convention configures routes by filenames inside a `pages` directory.

Create a `pages/index.js` file and add the following:

```js
export default () => (
  <div className="p-4 shadow rounded bg-white">
    <h1 className="text-purple-500 leading-normal">Next.js</h1>
    <p className="text-gray-500">with Tailwind CSS</p>
  </div>
);
```

### Start the server

Now is a good time to check everything is in the right place and start the next server. Inside the terminal, you’ll want to run:

```bash
npm run dev
```

Next.js will tell you the application is running on `http://localhost:3000` by default.

![Next.js Terminal Output](https://thepracticaldev.s3.amazonaws.com/i/65uh1pokjz2l2n85yksq.png)

### Configure and integrate Tailwind

Now the fun begins! If you’ve used Tailwind CSS before then the next steps will be familiar.

```bash
npx tailwindcss init
```

By default this will create a file called `tailwind.config.js` in your project root that looks a little like:

```js
// tailwind.config.js
module.exports = {
  future: {},
  purge: [],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
```

This file alone doesn’t do anything. If you restart your application, you’ll see nothing has changed. We will next configure PostCSS and create our first stylesheet.

### Configure PostCSS

We can now follow convention to configure PostCSS. Next will look for the file `postcss.config.js` and load any defined plugins.

Inside your project root, create the file `postcss.config.js` and add the following:

```js
module.exports = {
  plugins: ["tailwindcss", "postcss-preset-env"],
};
```

We’re doing a few things in this file:

- Invoking the tailwind library with our custom `tailwind.config.js` file
- Invoking the [`postcss-preset-env`](https://www.npmjs.com/package/postcss-preset-env) module which is used to help browsers process our CSS, including autoprefixer.

**That’s it!** 🎉

## Using Tailwind

We’re now ready to `@import` the tailwind css inside our stylesheet.

### Import Tailwind into your CSS

Create a CSS file inside your project. I’ve created the directory and file `styles/index.css` and added the following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-blue-500 p-12;
}
```

We’re using the @apply helper here to compose our own classes using Tailwind. This is magic. 🎩

**Note**: If you wish to use Tailwind inside other css files and import those into your styles/index.css then you will need to update your CSS file to begin with:

```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

_You can read more about importing Tailwind over on their [docs](https://tailwindcss.com/docs/installation#3-use-tailwind-in-your-css)._

### Import your CSS with Next.js

Create a file at `pages/_app.js`, or if you have one already, this is where you should import the stylesheet we created.

```js
import "../styles/index.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

### Start the Next.js app

We can now run `npm run dev` to see our working Next.js + TailwindCSS example running at [`http://localhost:3000`](http://localhost:3000/).

## Links

- [Code for this tutorial](https://github.com/notrab/nextjs-tailwindcss-starter)
- [Video of this setup (uses autoprefixer](https://youtu.be/Q5Z2U6a8T0g)
- [Next.js](https://github.com/zeit/next.js)
- [Tailwind CSS](https://tailwindcss.com/)
- [Me on Twitter](https://twitter.com/notrab)

I hope this helps ❤️

Video (out of date):

<YouTube youTubeId="Q5Z2U6a8T0g" />
