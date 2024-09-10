"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { getSession } from "@/lib/auth/action";
import { useEffect, useState } from "react";
import { SessionData } from "@/lib/auth/session";
import Sidebar from "@/components/layout/Sidebar/page";
import CustomCard from "@/components/layout/Card/page";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Grape, Milk, Pickaxe, Truck, Warehouse } from "lucide-react";
import ReportsPage from "./(landing-routes)/reports/page";

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
        <div className={styles.heading}></div>
        <div>
          <div className={styles.cardSummary}>
            <CustomCard
              title="Total Production"
              data="15,000L"
              icon={<Milk color="white" />}
            />
            <CustomCard
              title="Total Sales"
              data="15,000L"
              icon={<Truck color="white" />}
            />
            <CustomCard
              title="Current Inventory"
              data="15,000L"
              icon={<Warehouse color="white" />}
            />
            <CustomCard
              title="Tappers"
              data="2,000"
              icon={<Pickaxe color="white" />}
            />
          </div>
          <div>
            <ReportsPage />
          </div>
        </div>
      </div>
    </main>
  );
}
