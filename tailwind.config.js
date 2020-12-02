const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,md,mdx}"],
  theme: {
    extend: {
      colors: { amber: colors.amber },
      fontFamily: {
        sans: ["Inter"],
        serif: ["'EB Garamond'"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.amber.500"),
              fontWeight: theme("fontWeight.normal"),
              textDecoration: theme("textDecoration.no-underline"),
              "&:hover": {
                textDecoration: theme("textDecoration.underline"),
              },
            },
            h1: {
              color: theme("colors.amber.500"),
              fontFamily: theme("fontFamily.serif"),
              fontWeight: theme("fontWeight.bold"),
            },
            h2: {
              fontFamily: theme("fontFamily.serif"),
              fontWeight: theme("fontWeight.semibold"),
            },
            h3: {
              fontFamily: theme("fontFamily.serif"),
              fontWeight: theme("fontWeight.semibold"),
            },
            h4: {
              fontFamily: theme("fontFamily.serif"),
              fontWeight: theme("fontWeight.semibold"),
            },
            code: {
              backgroundColor: theme("colors.amber.50"),
              borderRadius: theme("borderRadius.DEFAULT"),
              color: theme("colors.amber.600"),
              fontWeight: theme("fontWeight.normal"),
              padding: theme("padding.1"),
            },
            "code::before": {
              content: "",
            },
            "code::after": {
              content: "",
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
