import React from "react";

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    React.createElement("link", {
      key: "google-font-css",
      rel: "stylesheet",
      href:
        "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&family=Inter:wght@400;700&display=swap",
    }),
  ]);
};

export { wrapPageElement } from "./gatsby-browser";
