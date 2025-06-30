import React, { useState } from 'react';

export default function App() {
  const [msg, setMsg] = useState("Click to fetch");

  const getData = async () => {
    try {
      const res = await fetch("http://localhost:5283//data");
      const data = await res.json();
      setMsg(data.msg);
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div>
      <button onClick={getData}>Fetch Message</button>
      <h1>{msg}</h1>
    </div>
  );
}
