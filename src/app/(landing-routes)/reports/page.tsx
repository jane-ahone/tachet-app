"use client";

import React, { useState, useEffect } from "react";
import styles from "./reports.module.css";
import { LogOut, BarChart2, Calendar } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar/page";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ProductionData {
  date: string;
  production: number;
}

interface BottledUnbottledData {
  date: string;
  bottled: number;
  unbottled: number;
}

const ReportsPage: React.FC = () => {
  const [dailyProduction, setDailyProduction] = useState<ProductionData[]>([]);
  const [weeklyProduction, setWeeklyProduction] = useState<ProductionData[]>(
    []
  );
  const [monthlyProduction, setMonthlyProduction] = useState<ProductionData[]>(
    []
  );
  const [bottledUnbottled, setBottledUnbottled] = useState<
    BottledUnbottledData[]
  >([]);

  const [dailyDateRange, setDailyDateRange] = useState({ start: "", end: "" });
  const [weeklyDateRange, setWeeklyDateRange] = useState({
    start: "",
    end: "",
  });
  const [monthlyDateRange, setMonthlyDateRange] = useState({
    start: "",
    end: "",
  });
  const [bottledUnbottledDateRange, setBottledUnbottledDateRange] = useState({
    start: "",
    end: "",
  });

  const sideItems = [
    {
      route: "Dashboard",
      link: "/dashboard",
      icon: BarChart2,
      id: "dashboard",
    },
    {
      route: "Sign Out",
      link: "/logout",
      icon: LogOut,
      id: "logout",
    },
  ];

  useEffect(() => {
    // Fetch data for reports
    // In a real application, these would be API calls
    setDailyProduction([
      { date: "2023-07-01", production: 100 },
      { date: "2023-07-02", production: 120 },
      { date: "2023-07-03", production: 110 },
      { date: "2023-07-04", production: 130 },
      { date: "2023-07-05", production: 90 },
    ]);

    setWeeklyProduction([
      { date: "Week 26", production: 700 },
      { date: "Week 27", production: 750 },
      { date: "Week 28", production: 800 },
      { date: "Week 29", production: 720 },
    ]);

    setMonthlyProduction([
      { date: "Jan 2023", production: 3000 },
      { date: "Feb 2023", production: 2800 },
      { date: "Mar 2023", production: 3200 },
      { date: "Apr 2023", production: 3100 },
      { date: "May 2023", production: 3300 },
      { date: "Jun 2023", production: 3500 },
    ]);

    setBottledUnbottled([
      { date: "2023-07-01", bottled: 80, unbottled: 20 },
      { date: "2023-07-02", bottled: 100, unbottled: 20 },
      { date: "2023-07-03", bottled: 90, unbottled: 20 },
      { date: "2023-07-04", bottled: 110, unbottled: 20 },
      { date: "2023-07-05", bottled: 70, unbottled: 20 },
    ]);
  }, []);

  const handleDateRangeChange = (
    reportType: string,
    start: string,
    end: string
  ) => {
    switch (reportType) {
      case "daily":
        setDailyDateRange({ start, end });
        // Fetch new data based on date range
        break;
      case "weekly":
        setWeeklyDateRange({ start, end });
        // Fetch new data based on date range
        break;
      case "monthly":
        setMonthlyDateRange({ start, end });
        // Fetch new data based on date range
        break;
      case "bottledUnbottled":
        setBottledUnbottledDateRange({ start, end });
        // Fetch new data based on date range
        break;
    }
  };

  const DateRangePicker: React.FC<{
    reportType: string;
    dateRange: { start: string; end: string };
    onDateRangeChange: (reportType: string, start: string, end: string) => void;
  }> = ({ reportType, dateRange, onDateRangeChange }) => (
    <div className={styles.dateRangePicker}>
      <Calendar size={20} />
      <input
        type="date"
        value={dateRange.start}
        onChange={(e) =>
          onDateRangeChange(reportType, e.target.value, dateRange.end)
        }
      />
      <span>to</span>
      <input
        type="date"
        value={dateRange.end}
        onChange={(e) =>
          onDateRangeChange(reportType, dateRange.start, e.target.value)
        }
      />
    </div>
  );

  return (
    <div className="page-container-routes">
      {/* <Sidebar title="Reports" alignment="top" sideNavitems={sideItems} /> */}
      <div className={styles.contentContainer}>
        <div className={styles.reportSection}>
          <h2>Daily Production</h2>
          <DateRangePicker
            reportType="daily"
            dateRange={dailyDateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <div className={styles.chartTableContainer}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="production"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Production (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyProduction.map((day, index) => (
                    <tr key={index}>
                      <td>{day.date}</td>
                      <td>{day.production}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.reportSection}>
          <h2>Weekly Production</h2>
          <DateRangePicker
            reportType="weekly"
            dateRange={weeklyDateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <div className={styles.chartTableContainer}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="production" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Production (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyProduction.map((week, index) => (
                    <tr key={index}>
                      <td>{week.date}</td>
                      <td>{week.production}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.reportSection}>
          <h2>Monthly Production</h2>
          <DateRangePicker
            reportType="monthly"
            dateRange={monthlyDateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <div className={styles.chartTableContainer}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="production"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Production (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyProduction.map((month, index) => (
                    <tr key={index}>
                      <td>{month.date}</td>
                      <td>{month.production}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.reportSection}>
          <h2>Bottled vs Unbottled Palm Wine</h2>
          <DateRangePicker
            reportType="bottledUnbottled"
            dateRange={bottledUnbottledDateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <div className={styles.chartTableContainer}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bottledUnbottled}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bottled" fill="#8884d8" stackId="a" />
                  <Bar dataKey="unbottled" fill="#82ca9d" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Bottled (L)</th>
                    <th>Unbottled (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {bottledUnbottled.map((day, index) => (
                    <tr key={index}>
                      <td>{day.date}</td>
                      <td>{day.bottled}</td>
                      <td>{day.unbottled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
