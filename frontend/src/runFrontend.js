import * as Babel from "@babel/standalone";

export function runCode(userCode) {
  const transformed = Babel.transform(userCode, {
    presets: ["react", "env"],
  }).code;

  const html = `
    <html>
    <head>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    </head>
    <body>
       <div id="root"></div> 
      <script>
      try {
        ${transformed}
      } catch(err) {
        document.body.innerHTML = '<pre style="color:red">' + err.toString() + '</pre>';
      }
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  document.getElementById("preview").src = url;
}
