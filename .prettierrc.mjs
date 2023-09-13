/** @type {import("prettier").Config} */
const config = {
    trailingComma: 'es5',
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    arrowParens: 'always',
    bracketSpacing: true,
    endOfLine: 'lf',
    htmlWhitespaceSensitivity: 'css',
    insertPragma: false,
    singleAttributePerLine: false,
    bracketSameLine: false,
    jsxBracketSameLine: false,
    jsxSingleQuote: false,
    printWidth: 80,
    proseWrap: 'preserve',
    quoteProps: 'as-needed',
    requirePragma: false,
    embeddedLanguageFormatting: 'auto',
    vueIndentScriptAndStyle: false,
    parser: 'typescript',
};

export default config;
