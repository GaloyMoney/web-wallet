module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  ignorePatterns: ["/*.js", "lib", "coverage", "src/types/graphql.d.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: [
    "eslint-plugin-import",
    "@typescript-eslint",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
  ],
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    // Customized rules
    "@typescript-eslint/no-extra-semi": "off", // Prettier work
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "after-used",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/unified-signatures": "error",

    "import/no-deprecated": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-unresolved": "off",

    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",

    "accessor-pairs": "error",
    "array-callback-return": "error",
    "block-scoped-var": "error",
    "camelcase": "error",
    "capitalized-comments": "warn",
    "complexity": "error",
    "consistent-return": "error",
    "consistent-this": "error",
    "curly": "error",
    "default-case-last": "error",
    "default-param-last": "error",
    "dot-notation": "error",
    "eol-last": "error",
    "eqeqeq": "error",
    "func-name-matching": "error",
    "func-names": "error",
    "func-style": "error",
    "grouped-accessor-pairs": "error",
    "guard-for-in": "error",
    "id-length": ["error", { min: 2 }],
    "init-declarations": "error",
    "jsx-quotes": "error",
    "linebreak-style": ["error", "unix"],
    "max-depth": ["error", { max: 3 }],
    "max-lines-per-function": ["error", { max: 150 }],
    "max-lines": ["error", { max: 300 }],
    "max-nested-callbacks": ["error", { max: 2 }],
    "max-params": ["error", { max: 2 }],
    "max-statements-per-line": ["error", { max: 1 }],
    "max-statements": ["error", { max: 21 }],
    "new-parens": "error",
    "newline-per-chained-call": "error",
    "no-alert": "error",
    "no-array-constructor": "error",
    "no-await-in-loop": "error",
    "no-bitwise": "error",
    "no-caller": "error",
    "no-confusing-arrow": "error",
    "no-console": ["warn", { allow: ["error", "info"] }],
    "no-constructor-return": "error",
    "no-continue": "error",
    "no-div-regex": "error",
    "no-duplicate-imports": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-eq-null": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-floating-decimal": "error",
    "no-implicit-coercion": "error",
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-lonely-if": "error",
    "no-loop-func": "error",
    "no-loss-of-precision": "error",
    "no-mixed-operators": "error",
    "no-multi-assign": "error",
    "no-negated-condition": "error",
    "no-nested-ternary": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-wrappers": "error",
    "no-new": "error",
    "no-nonoctal-decimal-escape": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    "no-plusplus": "error",
    "no-promise-executor-return": "error",
    "no-proto": "error",
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "error",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": "error",
    "no-unreachable-loop": "error",
    "no-unsafe-optional-chaining": "error",
    "no-unused-expressions": "error",
    "no-use-before-define": "error",
    "no-useless-call": "error",
    "no-useless-computed-key": "error",
    "no-useless-concat": "error",
    "no-useless-constructor": "error",
    "no-useless-rename": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "no-void": "error",
    "no-warning-comments": "error",
    "object-shorthand": "error",
    "prefer-const": "error",
    "prefer-exponentiation-operator": "error",
    "prefer-numeric-literals": "error",
    "prefer-object-spread": "error",
    "prefer-promise-reject-errors": "error",
    "prefer-regex-literals": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "quote-props": ["error", "consistent-as-needed"],
    "radix": "error",
    "require-atomic-updates": "error",
    "require-unicode-regexp": "error",
    "spaced-comment": "error",
    "symbol-description": "error",
    "yoda": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["."],
      },
    },
    "react": {
      version: "detect",
    },
  },
}
