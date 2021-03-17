const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,md,mdx}"],
  theme: {
    extend: {
      colors: { rose: colors.rose },
      fontFamily: {
        sans: ["Inter"],
        serif: ["'EB Garamond'"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.rose.500"),
              fontWeight: theme("fontWeight.normal"),
              textDecoration: theme("textDecoration.no-underline"),
              "&:hover": {
                textDecoration: theme("textDecoration.underline"),
              },
            },
            h1: {
              color: theme("colors.rose.500"),
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
              backgroundColor: theme("colors.rose.50"),
              borderRadius: theme("borderRadius.DEFAULT"),
              color: theme("colors.rose.600"),
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
