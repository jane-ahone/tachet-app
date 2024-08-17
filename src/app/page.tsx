"use client";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const handleInput = async () => {
    const username = "JohnDoe";
    const password = "123456789";
    const email = "john@example.com";

    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();
    console.log(data);
  };

  const handleLogin = async () => {
    const response = await fetch("");
  };

  return (
    <main className={styles.main}>
      <input type="text" name="" id="" onClick={handleInput} />
      <input type="text" onClick={handleLogin} />
    </main>
  );
}
