import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    console.log("Effect triggered");
    axios.get("http://localhost:5926//data")
      .then(res => {
        console.log("Data fetched:", res.data);
        setMsg(res.data.msg);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setMsg("Error: " + err.message);
      });
  }, []);

  return <h1>{msg}</h1>;
}
