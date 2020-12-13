---
title: Working with Stripe Payment Intents and Next.js
date: 2020-03-18
---

On September 14, 2019, Stripe introduced a API for handling payments to comply with new European legislation. If you are already using Stripe, you've probably already heard of or even implemented **Payment Intents**.

Companies who don't follow the new changes may see transactions being declined by the bank, leaving customers in the dark and reduce sales. 📉

<YouTube youTubeId="szRNm8mDrNY" />

If your business is based in the European Economic Area or process payments for anybody who is, serve customers in the EEA and accept credit or debit cards, you will need to comply with the [Strong Customer Authentication](https://stripe.com/docs/strong-customer-authentication).

Due to the change in processing payments, it's not longer possible to just create payments on the frontend like you were used to previously. There now has to be a server element to creating payments with Stripe.

In this guide, we'll explore how you can start using the new Stripe Payment Intents API with Next.js and follow best practices as set out by Stripe and the industry.

TLDR; [Get the code](https://github.com/notrab/nextjs-stripe-intents)

## Prerequisites

- A [Stripe](https://dashboard.stripe.com) account
- Stripe `Secret key` and `Publishable key`
- Some knowledge of React & Next.js

## Get started

Let's use the Next.js CLI to create a new project and boilerplate.

```bash
npm init next-app # or yarn create next-app
```

Give your project a name and once the dependencies are installed, `cd` into your project folder.

Now, create the file: `pages/checkout.js` and add the following;

```js
const CheckoutPage = (props) => <pre>{JSON.stringify(props, null, 2)}</pre>;

export default CheckoutPage;
```

If you now run `npm run dev` (or `yarn dev`) you'll see we have an empty `props` object rendered on the page.

⚠️ _Stripe recommends we create a Payment Intent as soon as the amount is known and the customer begins the checkout flow. Payment Intents can also be retrieved if a user is returning to your site at a later date to complete a checkout for the same cart or order they were previously._

Now let's move on... and do just that! 👯‍♀️

## Server side

[Next.js](https://nextjs.org) 9.3.0 [introduced](https://nextjs.org/blog/next-9-3#getserversideprops) a the new `getServerSideProps` lifecycle method we can use to perform server side only behaviour.

This means we no longer need to create an API route to handle creating an intent and handle it directly inside our checkout page.

Let's start by installing the Stripe.js dependency;

```bash
npm install stripe # or yarn add stripe
```

Then inside our `pages/checkout.js` page, import the Stripe package at the top of our file;

```js
import Stripe from "stripe";
```

Now to hook into the `getServerSideProps` method, we must export it as a `const`.

Inside that method is where we will create our Payment Intent. For the purposes of this tutorial, we'll fix the `amount` and `currency` values but inside this method is where I'd recommend making a `fetch` request to lookup your cart total. Unless your use case permits users to provide their own `amount` and `currency` 😀.

⚠️ **Make sure you head to your [Developer API Keys Dashboard](https://dashboard.stripe.com/test/apikeys) and copy your _Secret key_ for the next bit** .

### Create a Payment Intent

```js
export const getServerSideProps = async () => {
  const stripe = new Stripe("STRIPE_SECRET_KEY_HERE");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "gbp",
  });

  return {
    props: {
      paymentIntent,
    },
  };
};
```

👀 If you know more about the customer, for example they are currently logged in, and know their `email` or `shipping` address, you can pass this onto the `create` function too. You can see a [full list of arguments](https://stripe.com/docs/api/payment_intents/create) over on the Stripe docs.

Next, start the Next development server with `npm run dev` (or `yarn dev`) and head to [`http://localhost:3000/checkout`](http://localhost:3000/checkout).

🎉 Yay! You should see a Payment Intent object!

---

⚠️ **While this is great, every time you visit this page it will create a new Payment Intent, and as we touched on earlier, this isn't recommended.**

### Retrieve existing Payment Intent

`getServerSideProps` would be a place to store some kind of cookie that can be checked, and if an existing ID exists, make a call to Stripe to retrieve the Payment Intent.

Install `nookies` to parse and set our cookies with Next.js context;

```bash
npm install nookies # yarn add nookies
```

Then update `pages/checkout.js` to import the `nookies` dependency;

```js
import { parseCookies, setCookie } from "nookies";
```

Now update `getServerSideProps` to;

```js
export const getServerSideProps = async (ctx) => {
  const stripe = new Stripe("STRIPE_SECRET_KEY_HERE");

  let paymentIntent;

  const { paymentIntentId } = await parseCookies(ctx);

  if (paymentIntentId) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      props: {
        paymentIntent,
      },
    };
  }

  paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "gbp",
  });

  setCookie(ctx, "paymentIntentId", paymentIntent.id);

  return {
    props: {
      paymentIntent,
    },
  };
};
```

PS. Make sure not to override the Stripe Secret with `STRIPE_SECRET_KEY_HERE` 🤪 if you're copy/pasting!

Obviously the implementation may differ for your setup, but the idea of this tutorial is to teach the flow and best practices.

Now if you head back to [http://localhost:3000/checkout](http://localhost:3000/checkout) and refresh, you should see the same Payment Intent! 🎉

---

You can also see Payments created inside the [Stripe Dashboard]. Depending on how many times you loaded the `/checkout` page, you should see 2 or more Payments. The most recent should be the one being reused and stored in a cookie.

![Payments List](https://dev-to-uploads.s3.amazonaws.com/i/jylhoa1q8mo2fj2n8sxx.png)

Stripe also shows all activity around payments, which includes the request parameters we sent to `paymentIntents.create()`

![Payment Activity](https://dev-to-uploads.s3.amazonaws.com/i/l555tj88aca4jdqd59eo.png)

## Client side

Now it's time to capture the users card and process the payment. The Stripe Payment Intents API requires a `paymentMethod` in order to process the transaction.

We can use the client side Stripe libraries to create a secure `paymentMethod` which contains our card information which is then passed onto Stripe.

Install dependencies for the frontend:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js # or yarn add @stripe/stripe-js @stripe/react-stripe-js
```

### Configure Stripe on the frontend

Now with these installed, add the following import lines to the top of your `pages/checkout.js` file:

```js
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
```

We next need to create a Stripe `Promise` to pass the `Elements` provider. You'll need your _Publishable key_ from your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) and above your `CheckoutPage` function, add the following;

```js
const stripePromise = loadStripe("STRIPE_PUBLISHABLE_KEY");
```

Let's finally update our `CheckoutPage` function to wrap our page with `Elements` and our newly created `stripePromise` Promise.

```js
const CheckoutPage = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Elements>
  );
};
```

### Creating a Checkout Form

Go ahead and create the folder/file `components/CheckoutForm.js` in the root of your project and add the following;

```js
import React from "react";

const CheckoutForm = ({ paymentIntent }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return <form onSubmit={handleSubmit}>{/* TODO */}</form>;
};

export default CheckoutForm;
```

That's pretty much the basics configured for the `CheckoutForm` which we next need to import and invoke on our `pages/checkout.js` page.

```js
// pages/checkout.js

import CheckoutForm from "../components/CheckoutForm";
```

Also update the `CheckoutPage` function to pass `paymentIntent` from `props` to `CheckoutForm`.

```js
// pages/checkout.js
const CheckoutPage = ({ paymentIntent }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm paymentIntent={paymentIntent} />
  </Elements>
);
```

⚠️ For whatever reason `paymentIntent` does not exist, you might want to display a message to the user.

### Working with the Stripe React hooks

`@stripe/react-stripe-js` is a new library by Stripe that exposes a few handy hooks and components for us to use. We'll be using;

- `CardElement`
- `useStripe`
- `useElements`

Inside the `CheckoutForm` function, we'll invoke both of the Stripe hooks so we have a reference to `stripe` and `elements` for use inside our `handleSubmit` function next.

```js
const CheckoutForm = ({ paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();

  // ... rest of file
};
```

### Confirm Stripe Intent with React hooks

A method on `stripe` that we will need to use is [`confirmCardPayment`](https://stripe.com/docs/js/payment_intents/confirm_card_payment), which accepts 3 arguments; `client_secret`, and (_optional: `data` and `options`_).

We already have the `client_secret` passed down inside `paymentIntent` through `pages/index.js` `getServerSideProps`, and then onto `CheckoutForm` via a prop.

Let's update the `handleSubmit` function to send a request to Stripe to confirm the Payment Intent.

```js
const handleSubmit = async (e) => {
  e.preventDefault(); // Stops the page from reloading!

  try {
    const {
      error,
      paymentIntent: { status },
    } = await stripe.confirmCardPayment(paymentIntent.client_secret);

    if (error) throw new Error(error.message);

    if (status === "succeeded") {
      alert("Payment made!");
    }
  } catch (err) {
    alert(err.message);
  }
};
```

Since our Payment Intent was created on the server before the page loaded, and in this example we have no user context or stored payment method, we need to create one on the client and send it in the second argument to `confirmCardPayment`.

This is where the `CardElement` component comes in. Stripe provides a fully secure and baked credit card input with expiry, CVV and zip/post code.

Let's first add a `<CardElement />` and `<button />` component to submit the form. Let's also disable the `button` if the `stripe` Promise has not resolved yet.

```js
return (
  <form onSubmit={handleSubmit}>
    <CardElement />

    <button type="submit" disabled={!stripe}>
      Pay now
    </button>
  </form>
);
```

Now if you refresh your checkout page at [http://localhost:3000/checkout](http://localhost:3000/checkout) you should see something a little like this:

![Checkout Form with Card input](https://dev-to-uploads.s3.amazonaws.com/i/0tjbn6ye956p93i0njh3.png)

Now when we click `Pay now` nothing will happen on the Stripe side because we haven't attached any payment method data to our Payment Intent.

Now let's update `handleSubmit` to do just that!

We can use `elements.getElement` and pass in our `CardElement` import to reference the card input on our page.

```js
const {
  error,
  paymentIntent: { status },
} = await stripe.confirmCardPayment(paymentIntent.client_secret, {
  payment_method: {
    card: elements.getElement(CardElement),
  },
});
```

**Congratulations**! We now have a fully functional payment form! 🎉🎉🎉

Go give it a try with a test Stripe card. `4242 4242 4242 4242` will get you through with no SCA challenge.

![Stripe successful payment](https://dev-to-uploads.s3.amazonaws.com/i/wg24cjzpusdzrmgj03ob.gif)

---

Now we're not done just yet... You'll notice if you refresh the page and try to make a payment it will fail. **This is because we reusing the same `paymentIntentId` we stored in cookies which is now confirmed.**

## Tidying it up

We've a few things to do;

- Destroy the `paymentIntentId` cookie on successful payments
- Display a success message instead of a payment form
- Display an error is present

### Destroying the `paymentIntentId` cookie on on successful payments

Inside `components/CheckoutForm.js`, import `destroyCookie` from `nookes`.

```js
// ...
import { destroyCookie } from "nookies";
```

Now inside our `handleSubmit` function we check if the `status` is `succeeded`. It would be here we would need to call `destroyCookie`.

```js
// ..
if (status === "succeeded") {
  destroyCookie(null, "paymentIntentId");
}
```

### Implement success/error messages

Now let's import `useState` from `react` and invoke the hook for 2 different types of state;

- `checkoutError`
- `checkoutSuccess`

```js
const CheckoutForm = ({ paymentIntent }) => {
// ...

const [checkoutError, setCheckoutError] = useState();
const [checkoutSuccess, setCheckoutSuccess] = useState();
```

Now inside `handleSubmit`, add `setCheckoutSuccess` while passing `true` on a successful payment and `setCheckoutError(err.message)` inside the `catch` block.

```js
try {
  // ...

  if (status === "succeeded") {
    setCheckoutSuccess(true);
    destroyCookie(null, "paymentIntentId");
  }
} catch (err) {
  alert(err.message);
  setCheckoutError(err.message);
}
```

Then before we render the form inside `return`, return a successful paragraph if `checkoutSuccess` is truthy.

```js
if (checkoutSuccess) return <p>Payment successful!</p>;
```

Finally, somewhere inside the `<form>` add the following;

```js
{
  checkoutError && <span style={{ color: "red" }}>{checkoutError}</span>;
}
```

---

You did it!

![Successful payment](https://dev-to-uploads.s3.amazonaws.com/i/e9eakcjv7iyat4flgcrv.gif)

If you check the Stripe Dashboard you will also see the successful Payment Intent!

![Stripe payment success](https://dev-to-uploads.s3.amazonaws.com/i/uv9vqwudz4fpvx0qs428.png)

![Stripe payment success logs](https://dev-to-uploads.s3.amazonaws.com/i/yvju80uq28o0hzng2aq5.png)

---

## Final `pages/checkout.js`

```js
import React from "react";
import Stripe from "stripe";
import { parseCookies, setCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe("STRIPE_PUBLISHABLE_KEY");

export const getServerSideProps = async (ctx) => {
  const stripe = new Stripe("STRIPE_SECRET_KEY");

  let paymentIntent;

  const { paymentIntentId } = await parseCookies(ctx);

  if (paymentIntentId) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      props: {
        paymentIntent,
      },
    };
  }

  paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "gbp",
  });

  setCookie(ctx, "paymentIntentId", paymentIntent.id);

  return {
    props: {
      paymentIntent,
    },
  };
};

const CheckoutPage = ({ paymentIntent }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm paymentIntent={paymentIntent} />
  </Elements>
);

export default CheckoutPage;
```

## Final `CheckoutForm.js`

```js
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { destroyCookie } from "nookies";

const CheckoutForm = ({ paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutError, setCheckoutError] = useState();
  const [checkoutSuccess, setCheckoutSuccess] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        error,
        paymentIntent: { status },
      } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) throw new Error(error.message);

      if (status === "succeeded") {
        setCheckoutSuccess(true);
        destroyCookie(null, "paymentIntentId");
      }
    } catch (err) {
      alert(err.message);
      setCheckoutError(err.message);
    }
  };

  if (checkoutSuccess) return <p>Payment successful!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />

      <button type="submit" disabled={!stripe}>
        Pay now
      </button>

      {checkoutError && <span style={{ color: "red" }}>{checkoutError}</span>}
    </form>
  );
};

export default CheckoutForm;
```

- [Get the code](https://github.com/notrab/nextjs-stripe-intents)
