---
title: Build your own custom React hook
date: 2019-11-18
---

React hooks are becoming ever so popular with developers looking for a scalable way to share logic across their application, without the bloat of HOCs or render props.

In this tutorial, we will create a React hook that is responsible for storing Net Promoter Score feedback. The hook won't be responsible for any UI, but the logic behind storing and sending the score to our provided function.

![useNPS](https://thepracticaldev.s3.amazonaws.com/i/tjff1mtj8au98tq9j0tz.gif)

First of all, let's start by defining how we'd like to use our hook. Our React hook needs to meet the following requirements;

- Tell me if I can submit a score or not
- Tell me if I have submitted a score or not
- Tell me the submitted score
- Allow me to submit a score
- Allow me to provide custom behaviour for `onSubmit`
- Allow me to provide custom behaviour for `onDismiss`
- Allow me to provide a default `dismissed` value

If we write some code to invoke our imaginary React hook, it should end up looking like this:

```js
const [{ scored, score, dismissed }, { submit, dismiss }] = useNPS({
  dismissed: true, // Default to false
  onSubmit: (score) => alert(`Thanks for your score ${score}`),
  onDismiss: ({ scored, score }) =>
    alert(scored ? `Thanks again!` : `Maybe next time?`),
});
```

In the above we tick each of our requirements, now let's begin to explore actually writing the code that handles the logic here.

## Creating the hook

We'll be using the new `useState` hook from React within our own hook, let's start by importing that and declaring our `useNPS` function.

```js
import { useState } from "react";

function useNPS() {
  // ...
}
```

Next let's invoke the `useState` hook to store our own state within `useNPS`.

```js
function useNPS() {
  const [dismissed, setDismissed] = useState(false);
  const [score, setScore] = useState(undefined);
}
```

Both `dismissed` and `score` are vital to our `useNPS` function. Afterall, we're building a hook to capture NPS scores, we need to save that state!

As with any React hook, we need to return some values. We have the choice to return an object or array, I'm going to follow the `[getter, setter]` pattern for our hook and return what we need in an array, the first array object will contain our getter methods, while the second will contain our setter methods.

```js
function useNPS() {
  const [dismissed, setDismissed] = useState(false);
  const [score, setScore] = useState(undefined);

  return [{ score, dismissed }, {}];
}
```

Right now we don't have any setter methods, and we're missing a get method for `scored` which is important so we know if we have submitted our form. We can easily do this by checking if there is a truthy `score` value.

```js
function useNPS() {
  const [dismissed, setDismissed] = useState(false);
  const [score, setScore] = useState(undefined);
  const scored = !!score;

  return [{ score, scored, dismissed }, {}];
}
```

We've now successfully completed and returned the three required getter methods; `score`, `scored` and `dismissed`.

Before we create our `submit` and `dismiss` methods, let's fix the initial value for `dismissed`. Back when we defined our `useNPS` function, we needed the ability to automatically set `dissmised` to `true`. This is useful if we don't want to show our form, our hook can control that behaviour.

Let's destructure `dissmised` from our `useNPS` params (and set it to `false` for a default value, and update the `useState` value.

```js
function useNPS({ dismissed: defaultDismissed = false }) {
  const [dismissed, setDismissed] = useState(defaultDismissed);

  // ...
}
```

Since we already have the const `dismised`, we'll use `defaultDismissed` as a throwaway variable.

Now we're ready to create our `submit` and `dismiss` methods. First up, we need a way to update the `score` variable AND call our provided `onSubmit` function.

Inside of our `useNPS` function, create a new arrow function for `submit`, which takes in one argument `score`, this should call `setScore` with that value and if there is a `onSubmit` function provided, call it.

```js
const submit = (score) => {
  setScore(score);
  onSubmit && onSubmit(score);
};
```

Running this will cause an error, `onSubmit` is undefined. Let's fix that by destructuring from our `useNPS` arg object.

```js
function useNPS({ dismissed: defaultDismissed = false, onSubmit }) {
  // ...
}
```

This now means we can provide an `onSubmit` function to our React hook. This is useful if we wish to pass on the score to an API, analytics platform or other aggregator (like our [GraphCMS](https://graphcms.com) project) to track.

Finally all that's left to do is return `submit` inside our hook.

```js
function useNPS({ dismissed: defaultDismissed = false, onSubmit }) {
  // ...

  return [{ score, scored, dismissed }, { submit }];
}
```

Now let's move onto the `dismiss` function. It's almost identical to the `submit` function, but instead of returning just the score to `onDismiss`, we'll also provide the `scored` boolean, and return these both inside an object.

```js
const dismiss = () => {
  setDismissed(true);
  onDismiss && onDismiss({ scored, score });
};
```

Like we did previous, we'll destructure `onDismiss` from the `useNPS` args and return `dismiss` inside our hook.

```js
function useNPS({ dismissed: defaultDismissed = false, onSubmit, onDismiss }) {
  // ...

  return [
    { score, scored, dismissed },
    { submit, dismiss },
  ];
}
```

**Hurray! Our React hook is complete!** Let's see the full code of our hook;

```js
import { useState } from "react";

function useNPS({ dismissed: defaultDismissed = false, onSubmit, onDismiss }) {
  const [dismissed, setDismissed] = useState(defaultDismissed);
  const [score, setScore] = useState(undefined);
  const scored = !!score;

  const submit = (score) => {
    setScore(score);
    onSubmit && onSubmit(score);
  };

  const dismiss = () => {
    setDismissed(true);
    onDismiss && onDismiss({ scored, score });
  };

  return [
    { score, scored, dismissed },
    { submit, dismiss },
  ];
}
```

## Using our React hook

<CodeSandbox codeSandboxId="8bii5" />

Next steps might be to bundle this and publish to NPM 😍
