(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // user_bundles/041d7db8-fbff-43c6-935d-4b57340350d5/index.js
  var import_react2 = __toESM(__require("react"));
  var import_react_dom = __toESM(__require("react-dom"));

  // user_bundles/041d7db8-fbff-43c6-935d-4b57340350d5/App.jsx
  var import_react = __toESM(__require("react"));
  var import_axios = __toESM(__require("axios"));
  function App() {
    const [msg, setMsg] = (0, import_react.useState)("Loading...");
    (0, import_react.useEffect)(() => {
      console.log("Effect triggered");
      import_axios.default.get("http://localhost:5989//data").then((res) => {
        console.log("Data fetched:", res.data);
        setMsg(res.data.msg);
      }).catch((err) => {
        console.error("Fetch error:", err);
        setMsg("Error: " + err.message);
      });
    }, []);
    return /* @__PURE__ */ import_react.default.createElement("h1", null, msg);
  }

  // user_bundles/041d7db8-fbff-43c6-935d-4b57340350d5/index.js
  import_react_dom.default.render(/* @__PURE__ */ import_react2.default.createElement(App, null), document.getElementById("root"));
})();
