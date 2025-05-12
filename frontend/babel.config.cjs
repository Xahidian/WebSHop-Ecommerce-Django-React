const plugins = [];

if (process.env.NODE_ENV === 'development') {
  console.log("Instrumenting code for coverage...");
  plugins.push("istanbul");
}

module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false }],
    ["@babel/preset-react", { runtime: "automatic" }] // ✅ Add runtime: automatic
  ],
  plugins: ["istanbul"]
};

