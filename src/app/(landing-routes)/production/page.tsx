"use client";

import { useState, useEffect } from "react";
import styles from "./production.module.css";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar/page";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

interface Tapper {
  id: number;
  name: string;
}

interface ProductionEntry {
  id: number;
  dateReceived: string;
  tapperId: number;
  volumePurchased: number;
  purchasePrice: number;
  processingStatus: string;
}

interface FormData {
  dateReceived: string;
  tapperId: string;
  volumePurchased: string;
  purchasePrice: string;
  processingStatus: string;
}

const ProductionPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"input" | "view" | "tappers">(
    "input"
  );
  const [formData, setFormData] = useState<FormData>({
    dateReceived: "",
    tapperId: "",
    volumePurchased: "",
    purchasePrice: "",
    processingStatus: "",
  });
  const [tappers, setTappers] = useState<Tapper[]>([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]);
  const [newTapper, setNewTapper] = useState<{ name: string }>({ name: "" });
  const [previousEntries, setPreviousEntries] = useState<ProductionEntry[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Simulate fetching previous entries from an API
    setPreviousEntries([
      {
        id: 1,
        dateReceived: "2024-09-01",
        tapperId: 1,
        volumePurchased: 100,
        purchasePrice: 500,
        processingStatus: "completed",
      },
      {
        id: 2,
        dateReceived: "2024-09-02",
        tapperId: 2,
        volumePurchased: 150,
        purchasePrice: 750,
        processingStatus: "in progress",
      },
    ]);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    // Here you would typically send the data to your backend
    // For example:
    // try {
    //   const response = await fetch('/api/production', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   if (response.ok) {
    //     const newEntry = await response.json();
    //     setPreviousEntries(prev => [...prev, newEntry]);
    //     setIsSubmitted(true);
    //     setTimeout(() => setIsSubmitted(false), 3000);
    //   }
    // } catch (error) {
    //   console.error('Failed to submit production data:', error);
    // }
  };

  const handleNewTapperSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the new tapper data to your backend
    // For example:
    // try {
    //   const response = await fetch('/api/tappers', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(newTapper),
    //   });
    //   if (response.ok) {
    //     const newTapperData = await response.json();
    //     setTappers(prev => [...prev, newTapperData]);
    //     setNewTapper({ name: '' });
    //   }
    // } catch (error) {
    //   console.error('Failed to add new tapper:', error);
    // }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div>
        <Breadcrumb spacing="8px" separator="-">
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">About</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Contact</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "input" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("input")}
          >
            Input Data
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "view" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("view")}
          >
            View Data
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "tappers" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("tappers")}
          >
            Manage Tappers
          </button>
        </div>
        {activeTab === "input" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Input Production Data</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="dateReceived" className={styles.label}>
                  Date Received:
                </label>
                <input
                  type="date"
                  id="dateReceived"
                  name="dateReceived"
                  value={formData.dateReceived}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="tapperId" className={styles.label}>
                  Tapper:
                </label>
                <select
                  id="tapperId"
                  name="tapperId"
                  value={formData.tapperId}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select a tapper</option>
                  {tappers.map((tapper) => (
                    <option key={tapper.id} value={tapper.id.toString()}>
                      {tapper.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="volumePurchased" className={styles.label}>
                  Volume Purchased (L):
                </label>
                <input
                  type="number"
                  id="volumePurchased"
                  name="volumePurchased"
                  value={formData.volumePurchased}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="purchasePrice" className={styles.label}>
                  Purchase Price:
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="processingStatus" className={styles.label}>
                  Processing Status:
                </label>
                <select
                  id="processingStatus"
                  name="processingStatus"
                  value={formData.processingStatus}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select status</option>
                  <option value="not begun">Not Begun</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button type="submit" className={styles.button}>
                Submit Production Data
              </button>
            </form>
            {isSubmitted && (
              <div className={styles.alert}>
                <p>Production data submitted successfully!</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "view" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Previous Entries</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tapper</th>
                  <th>Volume (L)</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {previousEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.dateReceived}</td>
                    <td>
                      {tappers.find((t) => t.id === entry.tapperId)?.name}
                    </td>
                    <td>{entry.volumePurchased}</td>
                    <td>{entry.purchasePrice}</td>
                    <td>{entry.processingStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "tappers" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Manage Tappers</h2>
            <form onSubmit={handleNewTapperSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="newTapperName" className={styles.label}>
                  New Tapper Name:
                </label>
                <input
                  type="text"
                  id="newTapperName"
                  value={newTapper.name}
                  onChange={(e) => setNewTapper({ name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <button type="submit" className={styles.button}>
                Add New Tapper
              </button>
            </form>
            <h3 className={styles.subTitle}>Existing Tappers</h3>
            <ul className={styles.tapperList}>
              {tappers.map((tapper) => (
                <li key={tapper.id}>{tapper.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionPage;
