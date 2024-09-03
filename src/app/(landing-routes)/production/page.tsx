"use client";

import { useState, useEffect } from "react";
import styles from "./production.module.css";
import { useRouter } from "next/navigation";

import {
  Save,
  RotateCcw,
  Droplet,
  Thermometer,
  FlaskRound,
} from "lucide-react";

interface ProductionData {
  date: string;
  tapperId: string;
  volumeCollected: string;
  alcoholContent: string;
  temperature: string;
  ph: string;
  notes: string;
}
import Sidebar from "@/components/layout/Sidebar/page";
import {
  LogOut,
  Pickaxe,
  SquarePen,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  PlusCircle,
  Calendar,
} from "lucide-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
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
  const sideItems = [
    {
      route: "Tappers",
      link: "/production/tappers",
      icon: Pickaxe,
      id: "Tappers",
    },
    {
      route: "Sign Out",
      link: "/logout",
      icon: LogOut,
      id: "logout",
    },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleNewSubmit = (e: React.FormEvent) => {
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

  const [previousEntries, setPreviousEntries] = useState<ProductionEntry[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      {
        id: 3,
        dateReceived: "2024-09-03",
        tapperId: 1,
        volumePurchased: 120,
        purchasePrice: 600,
        processingStatus: "pending",
      },
      {
        id: 4,
        dateReceived: "2024-09-04",
        tapperId: 2,
        volumePurchased: 180,
        purchasePrice: 900,
        processingStatus: "completed",
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
    // Implement submission logic here
  };

  const handleSort = (key: keyof ProductionEntry) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = [...previousEntries].sort((a, b) => {
    if (
      a[sortConfig.key as keyof ProductionEntry] <
      b[sortConfig.key as keyof ProductionEntry]
    ) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (
      a[sortConfig.key as keyof ProductionEntry] >
      b[sortConfig.key as keyof ProductionEntry]
    ) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredEntries = sortedEntries.filter((entry) => {
    const matchesStatus = entry.processingStatus
      .toLowerCase()
      .includes(filterStatus.toLowerCase());
    const matchesSearch =
      entry.dateReceived.includes(searchTerm) ||
      tappers
        .find((t) => t.id === entry.tapperId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      entry.volumePurchased.toString().includes(searchTerm) ||
      entry.purchasePrice.toString().includes(searchTerm) ||
      entry.processingStatus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange =
      (!startDate || entry.dateReceived >= startDate) &&
      (!endDate || entry.dateReceived <= endDate);

    return matchesStatus && matchesSearch && matchesDateRange;
  });

  return (
    <div className={styles.container}>
      <Sidebar title="Production" sideNavitems={sideItems} alignment="top" />

      <div className={styles.content}>
        <div className={styles.actions}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search entries..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.dateFilterContainer}>
            <Calendar className={styles.calendarIcon} />
            <input
              type="date"
              className={styles.dateInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <span className={styles.dateRangeSeparator}>to</span>
            <input
              type="date"
              className={styles.dateInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
          <button className={styles.addButton} onClick={onOpen}>
            <PlusCircle size={20} />
            Add New Entry
          </button>
          {/* Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Production Data Input</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div className={styles.pageContainer}>
                  <div className={styles.contentContainer}>
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
                        <label
                          htmlFor="volumeCollected"
                          className={styles.label}
                        >
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
                        <label
                          htmlFor="alcoholContent"
                          className={styles.label}
                        >
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
                        <button
                          type="submit"
                          onClick={onClose}
                          className={styles.submitButton}
                        >
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
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort("dateReceived")}>
                  Date
                  {sortConfig.key === "dateReceived" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </th>
                <th>Tapper</th>
                <th onClick={() => handleSort("volumePurchased")}>
                  Volume (L)
                  {sortConfig.key === "volumePurchased" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </th>
                <th onClick={() => handleSort("purchasePrice")}>
                  Price
                  {sortConfig.key === "purchasePrice" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </th>
                <th onClick={() => handleSort("processingStatus")}>
                  Status
                  {sortConfig.key === "processingStatus" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.dateReceived}</td>
                  <td>{tappers.find((t) => t.id === entry.tapperId)?.name}</td>
                  <td>{entry.volumePurchased}</td>
                  <td>${entry.purchasePrice.toFixed(2)}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[entry.processingStatus.replace(" ", "")]
                      }`}
                    >
                      {entry.processingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;
