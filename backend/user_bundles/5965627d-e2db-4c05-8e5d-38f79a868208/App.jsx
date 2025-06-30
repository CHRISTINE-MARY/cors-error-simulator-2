import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5283//data");
        setMsg(res.data.msg);
      } catch (err) {
        console.error("Error occurred:", err);
        setMsg("Error: " + err.message);
      }
    };

    fetchData();
  }, []);

  return <h1>{msg}</h1>;
}
