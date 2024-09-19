"use client";
import styles from "./page.module.css";
import { getSession } from "@/lib/auth/action";
import { useEffect, useState } from "react";
import { SessionData } from "@/lib/auth/session";
import Sidebar from "@/components/layout/Sidebar/page";
import CustomCard from "@/components/layout/Card/page";
import { Milk, Pickaxe, Truck, Warehouse } from "lucide-react";
import ReportsPage from "./(landing-routes)/reports/page";
import Link from "next/link";
import { Card } from "@chakra-ui/react";

export default function Home() {
  const [session, setSession] = useState<SessionData | undefined>(undefined); // Initialize session state

  useEffect(() => {
    const fetchSessionData = async () => {
      const sessionData = await getSession(); // Await the promise to resolve
      setSession(sessionData); // Update session state
      // console.log(sessionData); // Log the session data after it's resolved
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
    // console.log(data);
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
    // console.log(data);
  };

  return (
    <main className={styles.main}>
      <Sidebar title="Tachet" alignment="top" />
      <div className={styles.mainDetails}>
        <Link href="/reports">
          <p>View all reports</p>
        </Link>
        <div className={styles.cardSummary}>
          <Link href="/production">
            <CustomCard
              title="Palm Wine Collected"
              data="15,000L"
              icon={<Milk size={12} color="var(--Gray-Gray-700)" />}
            />
          </Link>
          <Link href="/sales">
            <CustomCard
              title="Sales"
              data="19,071"
              icon={<Truck size={12} color="var(--Gray-Gray-700)" />}
            />
          </Link>
          <Link href="">
            <CustomCard
              title="Purchases"
              data="15,000"
              icon={<Warehouse size={12} color="var(--Gray-Gray-700)" />}
            />
          </Link>
          <Link href="/production/tapper">
            <CustomCard
              title="Registered Tappers"
              data="2,000"
              icon={<Pickaxe size={12} color="var(--Gray-Gray-700)" />}
            />
          </Link>
        </div>
        <div>
          <ReportsPage />
          <Card>Hello</Card>
        </div>
      </div>
    </main>
  );
}
