---
title: Manage Shopping Carts with GraphQL
date: 2020-08-27
---

[CartQL](https://cartql.com) is a GraphQL Shopping Cart API designed to work with your existing frontend or backend.

- **Built for the Jamstack** - No more writing custom business logic to handle cart and checkout. Works with Apollo Client, URQL, fetch, and more.

- **Flexible cart items** - Store any type of data on cart and cart items with the CartQL Mutations API

- **No replatforming** - CartQL was built to handle custom cart items for SKUs, promotions, shipping, and so much more.

- **Bring your own inventory** - Whether you're storing products in the filesystem, or in another API, such as CMS, it works with CartQL.

- **Bring your own frontend, or backend** - No more learning new client-side libraries for each framework to manage cart state. Work with what you already use, or stitch it with other GraphQL APIs.

## Manage cart items, checkout and pay for orders with a simple declarative GraphQL API.

The API is completely open, and free to use. See some of the common mutations users use when building their commerce experience.

To get stated, use this endpoint:

```
https://api.cartql.com
```

### Fetch a new or existing Cart

Run the following query, or modify it with your own `id`, or currency code such as `EUR`:

```graphql
query {
  cart(id: "ck5r8d5b500003f5o2aif0v2b", currency: { code: GBP }) {
    ...CartWithItems
  }
}

fragment CartWithItems on Cart {
  ...CartInfo
  items {
    ...ItemInfo
  }
}

fragment CartInfo on Cart {
  id
  email
  isEmpty
  abandoned
  totalItems
  totalUniqueItems
  currency {
    code
    symbol
  }
  subTotal {
    amount
    formatted
  }
  shippingTotal {
    amount
    formatted
  }
  taxTotal {
    amount
    formatted
  }
  grandTotal {
    amount
    formatted
  }
  metadata
  notes
  createdAt
  updatedAt
}

fragment ItemInfo on CartItem {
  id
  name
  description
  images
  quantity
  metadata
  unitTotal {
    amount
    formatted
  }
  lineTotal {
    amount
    formatted
  }
  createdAt
  updatedAt
}
```

[Open in GraphQL Playground](<https://api.cartql.com/?query=query%20%7B%0A%20%20cart(%0A%20%20%20%20id%3A%20%22ck5r8d5b500003f5o2aif0v2b%22%2C%0A%20%20%20%20currency%3A%20%7B%0A%20%20%20%20%20%20code%3A%20GBP%0A%20%20%20%20%7D%0A%20%20)%20%7B%0A%20%20%20%20...CartWithItems%0A%20%20%7D%0A%7D%0A%20%0Afragment%20CartWithItems%20on%20Cart%20%7B%0A%20%20...CartInfo%0A%20%20items%20%7B%0A%20%20%20%20...ItemInfo%0A%20%20%7D%0A%7D%0A%20%0Afragment%20CartInfo%20on%20Cart%20%7B%0A%20%20id%0A%20%20email%0A%20%20isEmpty%0A%20%20abandoned%0A%20%20totalItems%0A%20%20totalUniqueItems%0A%20%20currency%20%7B%0A%20%20%20%20code%0A%20%20%20%20symbol%0A%20%20%7D%0A%20%20subTotal%20%7B%0A%20%20%20%20amount%0A%20%20%20%20formatted%0A%20%20%7D%0A%20%20shippingTotal%20%7B%0A%20%20%20%20amount%0A%20%20%20%20formatted%0A%20%20%7D%0A%20%20taxTotal%20%7B%0A%20%20%20%20amount%0A%20%20%20%20formatted%0A%20%20%7D%0A%20%20grandTotal%20%7B%0A%20%20%20%20amount%0A%20%20%20%20formatted%0A%20%20%7D%0A%20%20attributes%20%7B%0A%20%20%20%20key%0A%20%20%20%20value%0A%20%20%7D%0A%20%20notes%0A%20%20createdAt%0A%20%20updatedAt%0A%7D%0A%20%0Afragment%20ItemInfo%20on%20CartItem%20%7B%0A%20%20id%0A%20%20name%0A%20%20description%0A%20%20images%0A%20%20quantity%0A%20%20attributes%20%7B%0A%20%20%20%20key%0A%20%20%20%20value%0A%20%20%7D%0A%20%20unitTotal%20%7B%0A%20%20%20%20amount%0A%20%20%20%20formatted%0A%20%20%7D%0A%20%20lineTotal%20%7B%0A%20%20%20%20amount%0A%20%20%20%20formatted%0A%20%20%7D%0A%20%20createdAt%0A%20%20updatedAt%0A%7D>)

### Add to Cart

Items by default are of type `SKU`, but you can add `SHIPPING`, and `TAX`, which modify the `subTotal`, `grandTotal` values.

```graphql
mutation {
  addItem(
    input: {
      cartId: "ck5r8d5b500003f5o2aif0v2b"
      id: "5e3293a3462051"
      name: "Full Logo Tee"
      description: "Purple Triblend / L"
      images: ["full-logo-tee.png"]
      price: 2000
    }
  ) {
    id
    isEmpty
    abandoned
    totalItems
    totalUniqueItems
    subTotal {
      formatted
    }
  }
}
```

[Open in GraphQL Playground](<https://api.cartql.com/?query=mutation%20%7B%0A%20%20addItem(%0A%20%20%20%20input%3A%20%7B%0A%20%20%20%20%20%20cartId%3A%20%22ck5r8d5b500003f5o2aif0v2b%22%2C%0A%20%20%20%20%20%20id%3A%20%225e3293a3462051%22%2C%0A%20%20%20%20%20%20name%3A%20%22Full%20Logo%20Tee%22%2C%0A%20%20%20%20%20%20description%3A%20%22Purple%20Triblend%20%2F%20L%22%2C%0A%20%20%20%20%20%20images%3A%20%5B%22full-logo-tee.png%22%5D%2C%0A%20%20%20%20%20%20price%3A%202000%0A%20%20%20%20%7D%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20isEmpty%0A%20%20%20%20abandoned%0A%20%20%20%20totalItems%0A%20%20%20%20totalUniqueItems%0A%20%20%20%20subTotal%20%7B%0A%20%20%20%20%20%20formatted%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D>)

### Update Cart Item

Update any of the item properties using the `updateItem` GraphQL mutation.

```graphql
mutation {
  updateItem(
    input: {
      cartId: "ck5r8d5b500003f5o2aif0v2b"
      id: "5e3293a3462051"
      price: 2500
      quantity: 2
    }
  ) {
    id
    isEmpty
    abandoned
    totalItems
    totalUniqueItems
    subTotal {
      formatted
    }
  }
}
```

[Open in GraphQL Playground](<https://api.cartql.com/?query=mutation%20%7B%0A%20%20updateItem(%0A%20%20%20%20input%3A%20%7B%0A%20%20%20%20%20%20cartId%3A%20%22ck5r8d5b500003f5o2aif0v2b%22%2C%0A%20%20%20%20%20%20id%3A%20%225e3293a3462051%22%2C%0A%20%20%20%20%20%20quantity%3A%202%0A%20%20%20%20%7D%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20isEmpty%0A%20%20%20%20abandoned%0A%20%20%20%20totalItems%0A%20%20%20%20totalUniqueItems%0A%20%20%20%20subTotal%20%7B%0A%20%20%20%20%20%20formatted%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D>)

### Remove Cart Item

No longer need a cart item? You can remove it easily.

```graphql
mutation {
  removeItem(
    input: { cartId: "ck5r8d5b500003f5o2aif0v2b", id: "5e3293a3462051" }
  ) {
    id
    isEmpty
    abandoned
    totalItems
    totalUniqueItems
    subTotal {
      formatted
    }
  }
}
```

[Open in GraphQL Playground](<https://api.cartql.com/?query=mutation%20%7B%0A%20%20removeItem(%0A%20%20%20%20input%3A%20%7B%0A%20%20%20%20%20%20cartId%3A%20%22ck5r8d5b500003f5o2aif0v2b%22%2C%0A%20%20%20%20%20%20id%3A%20%225e3293a3462051%22%0A%20%20%20%20%7D%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20isEmpty%0A%20%20%20%20abandoned%0A%20%20%20%20totalItems%0A%20%20%20%20totalUniqueItems%0A%20%20%20%20subTotal%20%7B%0A%20%20%20%20%20%20formatted%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D>)

### Custom `metadata`

Some items have more than just a `name`, `description`, and `price`, but attributes such as engraving, personalized notes, and more.

You can use the `metadata` object to store custom data about items, and the cart itself.

```graphql
mutation {
  updateItem(
    input: {
      cartId: "ck5r8d5b500003f5o2aif0v2b",
      id: "5e3293a3462051",
      metadata: {
        "engraving": "Jamie"
      }
    }
  ) {
    id
    metadata
  }
}
```

### Currency Formatting

No matter the location of your users, you can format the cart based on their currency.

The `updateCart` GraphQL mutation accepts properties for `currency`, which include things such as the `code`, `symbol`, `thousandsSeparator`, and more.

CartQL will automatically figure out the symbol, separator, and more, based on the `code` you give it.

Try swapping out `GBP` in the example below with `EUR`, `TRY`, or `USD`, and see all money meta in the cart change.

```graphql
mutation {
  updateCart(
    input: { id: "ck5r8d5b500003f5o2aif0v2b", currency: { code: GBP } }
  ) {
    id
    currency {
      code
      symbol
      thousandsSeparator
      decimalSeparator
      decimalDigits
    }
  }
}
```

[Open in GraphQL Playground](<https://api.cartql.com/?query=mutation%20%7B%0A%20%20updateCart(%0A%20%20%20%20input%3A%20%7B%0A%20%20%20%20%20%20id%3A%20%22ck5r8d5b500003f5o2aif0v2b%22%2C%0A%20%20%20%20%20%20currency%3A%20%7B%0A%20%20%20%20%20%20%20%20code%3A%20GBP%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20currency%20%7B%0A%20%20%20%20%20%20code%0A%20%20%20%20%20%20symbol%0A%20%20%20%20%20%20thousandsSeparator%0A%20%20%20%20%20%20decimalSeparator%0A%20%20%20%20%20%20decimalDigits%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D>)

### Checkout

Are you ready to checkout your cart?

CartQL provides a `checkout` mutation that you can use on the frontend to help capture customer addresses, emails, and notes.

Quite often you will want to control the checkout flow, and the `checkout` mutation lets you capture the shipping, and billing address of your customer, and returns an immutable cart as an "Order".

```graphql
mutation {
  checkout(
    input: {
      cartId: "ck5r8d5b500003f5o2aif0v2b"
      email: "jamie@cartql.com"
      shipping: {
        name: "Jamie Barton"
        line1: "123 Cart Lane"
        city: "Newcastle upon Tyne"
        postalCode: "NE14 CQL"
        country: "England"
      }
      billing: {
        # Optional
        name: "Jamie Barton"
        line1: "123 Cart Lane"
        city: "Newcastle upon Tyne"
        postalCode: "NE14 CQL"
        country: "England"
      }
    }
  ) {
    id
    grandTotal {
      formatted
    }
  }
}
```

[Open in GraphQL Playground](<https://api.cartql.com/?query=mutation%20%7B%0A%20%20checkout(%0A%20%20%20%20input%3A%20%7B%0A%20%20%20%20%20%20cartId%3A%20%22ck5r8d5b500003f5o2aif0v2b%22%2C%0A%20%20%20%20%20%20email%3A%20%22jamie%40cartql.com%22%2C%0A%20%20%20%20%20%20shipping%3A%20%7B%0A%20%20%20%20%20%20%20%20name%3A%20%22Jamie%20Barton%22%2C%0A%20%20%20%20%20%20%20%20line1%3A%20%22123%20Cart%20Lane%22%2C%0A%20%20%20%20%20%20%20%20city%3A%20%22Newcastle%20upon%20Tyne%22%2C%0A%20%20%20%20%20%20%20%20postalCode%3A%20%22NE14%20CQL%22%2C%0A%20%20%20%20%20%20%20%20country%3A%20%22England%22%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20billing%3A%20%7B%20%23%20Optional%0A%20%20%20%20%20%20%20%20name%3A%20%22Jamie%20Barton%22%2C%0A%20%20%20%20%20%20%20%20line1%3A%20%22123%20Cart%20Lane%22%2C%0A%20%20%20%20%20%20%20%20city%3A%20%22Newcastle%20upon%20Tyne%22%2C%0A%20%20%20%20%20%20%20%20postalCode%3A%20%22NE14%20CQL%22%2C%0A%20%20%20%20%20%20%20%20country%3A%20%22England%22%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20grandTotal%20%7B%0A%20%20%20%20%20%20formatted%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D>)

### Checkout with Stripe

Instead of building your own checkout, you can opt to use something like [Stripe Checkout]().

Together with serverless functions, you can fetch items from your cart, and create a Stripe checkout session.

```js
const Stripe = require("stripe");
const { request, gql } = require("graphql-request");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const query = gql`
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      isEmpty
      items {
        id
        name
        description
        unitTotal {
          amount
          currency {
            code
          }
        }
        quantity
      }
    }
  }
`;

exports.handler = async function (event) {
  const { cartId } = JSON.parse(event.body);

  const {
    cart: { isEmpty, items },
  } = await request(process.env.GATSBY_GRAPHQL_ENDPOINT, query, {
    cartId,
  });

  if (isEmpty) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "The cart is empty." }),
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.URL}/thankyou`,
      cancel_url: `${process.env.URL}/cart`,
      line_items: items.map(
        ({
          name,
          description,
          unitTotal: {
            amount: unit_amount,
            currency: { code: currency },
          },
          quantity,
        }) => ({
          ...(description && { description }),
          price_data: {
            currency,
            unit_amount,
            product_data: {
              name,
              ...(description && { description }),
            },
          },
          quantity,
        })
      ),
    });

    return {
      statusCode: 201,
      body: JSON.stringify(session),
    };
  } catch ({ message }) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message }),
    };
  }
};
```

### Lots more!

There's mutations to set all items in the cart with `setItems`, increment, or decrement just the quantity of items with `incrementItemQuantity`, and `decrementItemQuantity`. You can also empty the cart with `emptyCart`, or delete it with `deleteCart`.

The [gatsby-cartql-starter](https://github.com/CartQL/gatsby-cartql-starter) is a great place to get going! Built with Apollo Client 3, and a filesystem based inventory. 🚀
