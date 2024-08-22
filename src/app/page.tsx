"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { getSession } from "@/lib/auth/action";
import { useEffect, useState } from "react";
import { SessionData } from "@/lib/auth/session";
import SignUp from "./(auth-routes)/signup/page";
import Sidebar from "@/components/layout/Sidebar/page";
import Card from "@/components/layout/Card/page";

export default function Home() {
  const [session, setSession] = useState<SessionData | undefined>(undefined); // Initialize session state

  useEffect(() => {
    const fetchSessionData = async () => {
      const sessionData = await getSession(); // Await the promise to resolve
      setSession(sessionData); // Update session state
      console.log(sessionData); // Log the session data after it's resolved
    };

    fetchSessionData(); // Call the async function inside useEffect
  }, []); // Empty dependency array to run only once on mount

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
    const password = "123456789";
    const email = "john@example.com";
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <main className={styles.main}>
      <Sidebar />
      <div>
        <p>Pages/Dashboard</p>
        <p>Dashboard</p>
        <div>
          <Card />
          <Card />
          <Card />
        </div>
        <h3>Table</h3>
        <h3>Table</h3>
        <h3>Table</h3>
        <h3>Table</h3>
        <h3>Table</h3>
        <h3>Table</h3>
        <h3>Table</h3>
      </div>
    </main>
  );
}
