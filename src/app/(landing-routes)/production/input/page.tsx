"use client";

import React, { useState } from "react";
import styles from "./input.module.css";
import {
  Save,
  RotateCcw,
  Droplet,
  Thermometer,
  FlaskRound,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar/page";

interface ProductionData {
  date: string;
  tapperId: string;
  volumeCollected: string;
  alcoholContent: string;
  temperature: string;
  ph: string;
  notes: string;
}

const ProductionDataInputPage: React.FC = () => {
  const [productionData, setProductionData] = useState<ProductionData>({
    date: "",
    tapperId: "",
    volumeCollected: "",
    alcoholContent: "",
    temperature: "",
    ph: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProductionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted production data:", productionData);
    // Here you would typically send this data to your API
    // After successful submission, you might want to clear the form or show a success message
  };

  const handleReset = () => {
    setProductionData({
      date: "",
      tapperId: "",
      volumeCollected: "",
      alcoholContent: "",
      temperature: "",
      ph: "",
      notes: "",
    });
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar title="TACHET" alignment="left" />
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Production Data Input</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={productionData.date}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tapperId" className={styles.label}>
              Tapper:
            </label>
            <select
              id="tapperId"
              name="tapperId"
              value={productionData.tapperId}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="">Select Tapper</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
              {/* Add more options based on your tapper data */}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="volumeCollected" className={styles.label}>
              <Droplet size={18} className={styles.icon} />
              Volume Collected (L):
            </label>
            <input
              type="number"
              id="volumeCollected"
              name="volumeCollected"
              value={productionData.volumeCollected}
              onChange={handleInputChange}
              className={styles.input}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="alcoholContent" className={styles.label}>
              <FlaskRound size={18} className={styles.icon} />
              Alcohol Content (%):
            </label>
            <input
              type="number"
              id="alcoholContent"
              name="alcoholContent"
              value={productionData.alcoholContent}
              onChange={handleInputChange}
              className={styles.input}
              required
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="temperature" className={styles.label}>
              <Thermometer size={18} className={styles.icon} />
              Temperature (°C):
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={productionData.temperature}
              onChange={handleInputChange}
              className={styles.input}
              required
              step="0.1"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ph" className={styles.label}>
              pH Level:
            </label>
            <input
              type="number"
              id="ph"
              name="ph"
              value={productionData.ph}
              onChange={handleInputChange}
              className={styles.input}
              required
              min="0"
              max="14"
              step="0.1"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes" className={styles.label}>
              Additional Notes:
            </label>
            <textarea
              id="notes"
              name="notes"
              value={productionData.notes}
              onChange={handleInputChange}
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              <Save size={18} />
              Save Production Data
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
            >
              <RotateCcw size={18} />
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductionDataInputPage;
