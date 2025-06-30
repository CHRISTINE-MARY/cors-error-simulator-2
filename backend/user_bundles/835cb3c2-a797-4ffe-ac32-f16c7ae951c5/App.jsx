import React, { useEffect, useState } from "react";

const TestFrontend = () => {
  const [message, setMessage] = useState("Waiting for response...");

  useEffect(() => {
    fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5259%2F&requestId=70de7e4d-bd2c-40eb-ac87-7cf2085428c1")
      .then((res) => res.json())
      .then((data) => {
        setMessage(`✅ Success: ${data.msg}`);
      })
      .catch((err) => {
        setMessage(`❌ Error: ${err}`);
      });
  }, []);

  return (
    <div style={{ fontFamily: "monospace", padding: "20px" }}>
      <h2>CORS Test Frontend</h2>
      <pre>{message}</pre>
    </div>
  );
};

export default TestFrontend;
