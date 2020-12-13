---
title: Create a Commerce.js store with Svelte and Sapper
date: 2020-10-16
---

In the following videos we'll create a [Commerce.js](https://commercejs.com/) powered store with [Svelte](https://svelte.dev/), and [Sapper](https://sapper.svelte.dev/).

We will fetch products, and their categories, along with creating pages for each, and an index page to show everything.

- 📺 [See full playlist](https://www.youtube.com/playlist?list=PLs2PzMqLzi7XkF-_672sFOVduEORZJTOQ)
- 🛠 [Browse code on GitHub](https://github.com/notrab/sapper-commercejs-example)

## Part 1

Let's get setup with the initial Sapper + Svelte boilerplate, and customize it to our needs.

<YouTube youTubeId="mE6f1rlQX1o" />

## Part 2

In this video we'll install and setup Commerce.js &mdash; You'll need an account to continue, or you can continue with the demo public API key: `pk_184625ed86f36703d7d233bcf6d519a4f9398f20048ec`.

<YouTube youTubeId="n_T5escg_Pg" />

## Part 3

In this video we'll use the async `preload` function to fetch our merchant information, categories, and products for `index.svelte`.

<YouTube youTubeId="BZYCg4Rmlx8" />

## Part 4

In this video we'll go ahead and create the products index page at `routes/products/index.svelte`.

<YouTube youTubeId="ixlXkQH2xZU" />

## Part 5

In this video we'll create the index page for our categories at `routes/categories/index.svelte`.

<YouTube youTubeId="Fqwfpp1xHWA" />

## Part 6

In this video we'll handle creating pages for all our categories using the `[slug]`.

<YouTube youTubeId="TOvinnD7uGc" />

## Part 7

Just like we did for the category pages, let's handle creating pages for each of our products using the `[permalink]`.

<YouTube youTubeId="n9AWs0rnnl8" />
