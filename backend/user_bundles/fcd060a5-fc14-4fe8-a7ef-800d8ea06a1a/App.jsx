import React, { useEffect, useState } from "react";

const TestFrontend = () => {
  const [message, setMessage] = useState("Waiting for response...");

  useEffect(() => {
    fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5432%2F&requestId=ca3025b3-2971-468a-a33c-3edeb9855261")
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
