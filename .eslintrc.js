module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },

  env: {
    browser: true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    // 'eslint:recommended',


    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/essential', // Priority A: Essential (Error Prevention)
    // 'plugin:vue/strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    'standard'

  ],

  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',

  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // add your custom rules here
  rules: {
    "no-restricted-globals": "off",
    "consistent-return": "off",
    "max-classes-per-file": "off",
    "new-cap": "off",
    "no-use-before-define": "off",
    "global-require": "off",
    "no-continue": "off",
    "no-restricted-syntax": "off",
    "no-undef": "off",
    "prefer-destructuring": "off",
    "no-underscore-dangle": "off",
    eqeqeq: ["error", "smart"],
    "import/newline-after-import": "off",
    "no-plusplus": "off",
    "no-alert": "off",
    "no-console": "off",
    radix: "off",
    "Missing semicolon": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "spaced-comment": "off",
    "no-param-reassign": "off",
    "vue/no-use-v-if-with-v-for": "off",
    "no-param-reassign": "off",
    "max-len": "off", // 최대 라인길이 off
    "no-unused-vars": 0, // 0 이면 경고/알림 사라짐, 1 이면 경고만뜸, 2 빨간줄생성
    "space-before-function-paren": "off", // function 앞에 스페이스 경고없음
    quotes: ["off", "single"], // 문자열 single, double 모두 허용
    "comma-dangle": "off", // JSON 마지막 key/value 다음에 콤마 없어도 허용
    camelcase: "off", // camelcase 강제하지 않음
    //indent: ["error", 4], // Indent with 4 space
    indent: "off", // Indent check off
    // allow async-await
    "generator-star-spacing": "off",
    // allow paren-less arrow functions
    "arrow-parens": "off",
    "one-var": "off",

    "import/first": "off",
    "import/named": "error",
    "import/namespace": "error",
    "import/default": "error",
    "import/export": "error",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
    "prefer-promise-reject-errors": "off",
    // TypeScript
    //quotes: ['warn', 'single', { avoidEscape: true }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // allow debugger during development only
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
}
}
