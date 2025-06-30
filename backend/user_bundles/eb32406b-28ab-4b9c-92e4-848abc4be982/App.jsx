import React, { useEffect, useState } from "react";

const TestFrontend = () => {
  const [message, setMessage] = useState("Waiting for response...");

  useEffect(() => {
    fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5432%2F&requestId=71794a8b-9f60-40dc-af6d-c6db8fa4e7d7")
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
