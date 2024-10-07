"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar/page";
import CustomCard from "@/components/layout/Card/page";
import { Milk, Pickaxe, Truck, Warehouse } from "lucide-react";
import ReportsPage from "./(landing-routes)/reports/page";
import Link from "next/link";
import { Card } from "@chakra-ui/react";
import { fetchSessionData } from "@/lib/helpers/authHelpers";
import { SessionData } from "@/lib/types/interface";
import { useSharedContext } from "./sharedContexts";
import ScrollToTopButton from "@/components/ScrolltoTop/page";

export default function Home() {
  const [session, setSession] = useState<SessionData | undefined>(undefined); // Initialize session state

  useEffect(() => {
    const userLoggedIn = async () => {
      const userAuth = await fetchSessionData(); // Call the async function inside useEffect
      console.log(userAuth);
    };
    userLoggedIn();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    //Fetch production summary
  }, []);

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
        </div>
        <ScrollToTopButton />
      </div>
    </main>
  );
}
