---
title: A request wrapper for Chec (Commerce.js)
date: 2021-03-17
---

One of the things I noticed while working at Moltin was that people consume commerce APIs in all kinds of ways.

So it wasn't too long before I started to look at ways I could work with the [Commerce.js](https://commercejs.com) inside my lambdas, without bringing the full Commerce.js SDK along for the ride.

After all, fewer dependencies the better! 😅

If you're extending the API behind Commerce.js (Chec) with your own webhooks, it's quite common you'll need to write data to Commerce.js, or fetch to sync elsewhere.

Since Commerce.js doesn't support the create, update, or delete endpoints for most of its resources &mdash; and why would it? It's a frontend commerce SDK.

I took it upon myself to build a simple wrapper that handles authentication, and parsing JSON, using the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) polyfill.

You can get started by installing the [`chec-request`](http://npmjs.com/package/chec-request) dependency using Yarn or NPM:

```bash
npm install chec-request
```

Once installed, you can create a "client" you can pass around if you're making more than one request, or if it's just a one off, use the `request` function.

### With client

```js
const { Chec, request } = require("chec-request");

const commerce = new Chec("CHEC_API_TOKEN");

commerce.get("products").then((products) => console.log(products));
```

### With request

```js
request("products", { token: "CHEC_API_TOKEN" }).then((data) =>
  console.log(data)
);
```

## Examples

Some API endpoints require a **secret key**, you should check the [API documentation](https://commercejs.com/docs/api) and pass the applicable `TOKEN`.

### `GET`

```js
const { Chec, request } = require("chec-request");

const commerce = new Chec("CHEC_API_TOKEN");

commerce
  .get("products/prod_f89398fs489g")
  .then((products) => console.log(products));

// Or with a simple request

request("products", {
  token: "CHEC_API_TOKEN",
}).then((products) => console.log(products));
```

### `GET` with params

```js
const { Chec, request } = require("chec-request");

const commerce = new Chec("CHEC_API_TOKEN");

commerce
  .get("products", {
    limit: 5,
    category_slug: "accessories",
  })
  .then((products) => console.log(products))
  .catch((err) => console.log(err));

// Or with a simple request

request("products", {
  token: "CHEC_API_TOKEN",
  params: {
    limit: 5,
    category_slug: "accessories",
  },
})
  .then((products) => console.log(products))
  .catch((err) => console.log(err));
```

### `POST`

```js
const { Chec, request } = require("chec-request");

const data = {
  code: "RHKZKU71WG",
  type: "fixed",
  value: "49.95",
  limit_quantity: 1,
  quantity: 10,
  expires: 0,
};

const commerce = new Chec("CHEC_API_TOKEN");

commerce.post("discounts", data).then((discount) => console.log(discount));

// Or with a simple request

request("discounts", {
  token: "CHEC_API_TOKEN",
  method: "POST",
  data,
}).then((data) => console.log(data));
```

### `PUT`

```js
const { Chec, request } = require("chec-request");

const data = {
  customer: {
    firstname: "Jamie",
    lastname: "Barton",
  },
};

const commerce = new Chec("CHEC_API_TOKEN");

commerce.put("orders/orderId", data).then((discount) => console.log(discount));

// Or with a simple request

request("orders/orderId", {
  token: "CHEC_API_TOKEN",
  method: "PUT",
  data,
}).then((data) => console.log(data));
```

### `DELETE`

```js
const { Chec, request } = require("chec-request");

const commerce = new Chec("CHEC_API_TOKEN");

commerce.delete("discounts/RHKZKU71WG").then((res) => console.log(res));

// Or with a simple request

request("discounts/RHKZKU71WG", {
  token: "CHEC_API_TOKEN",
  method: "DELETE",
}).then((res) => console.log(res));
```

## Under the hood

As you can probably imagine, there isn't much going on in this dependency under the hood.

It accepts an endpoint, API public key, and forwards your request (with optional data), setting the correct `method` on its way.

The bulk of the work happens in the internal `request` function:

```js
async request({
    endpoint,
    params = {},
    method = undefined,
    data = undefined,
  }) {
    const { baseUrl, version } = this.options;
    const headers = this.headers;

    const url = new URL(`${baseUrl}/${version}/${endpoint}`);

    if (Object.keys(params)) url.search(new URLSearchParams(params));

    const response = await fetch(url, {
      headers,
      ...(method && { method }),
      ...(data && { body: JSON.stringify(data) }),
    });

    const json = await response.json();

    if (!response.ok) throw json;

    return json;
  }
```

That's it!
