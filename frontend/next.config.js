/** @type {import('next').NextConfig} */
const { withPlugins } = require("next-compose-plugins");
const nextConfig = {
  reactStrictMode: true,
};

const withTM = require("next-transpile-modules")(["react-tradingview-embed"]);
module.exports = withPlugins([withTM], nextConfig);
