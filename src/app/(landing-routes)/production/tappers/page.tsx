"use client";

import React, { useState, useEffect } from "react";
import styles from "./tapper.module.css";
import { UserPlus, Edit, Trash2, Search } from "lucide-react";
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
  contactNumber: string;
  address: string;
  joiningDate: string;
}

const TapperManagementPage: React.FC = () => {
  const [tappers, setTappers] = useState<Tapper[]>([]);
  const [newTapper, setNewTapper] = useState<Omit<Tapper, "id">>({
    name: "",
    contactNumber: "",
    address: "",
    joiningDate: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch tappers data from API
    // For now, we'll use dummy data
    setTappers([
      {
        id: 1,
        name: "John Doe",
        contactNumber: "1234567890",
        address: "123 Palm St",
        joiningDate: "2023-01-15",
      },
      {
        id: 2,
        name: "Jane Smith",
        contactNumber: "0987654321",
        address: "456 Coconut Ave",
        joiningDate: "2023-03-22",
      },
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTapper((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTapper = () => {
    // In a real application, you would send this data to your API
    const tapper = { id: tappers.length + 1, ...newTapper };
    setTappers((prev) => [...prev, tapper]);
    setNewTapper({ name: "", contactNumber: "", address: "", joiningDate: "" });
    setIsAdding(false);
  };

  const handleDeleteTapper = (id: number) => {
    // In a real application, you would send a delete request to your API
    setTappers((prev) => prev.filter((tapper) => tapper.id !== id));
  };

  const filteredTappers = tappers.filter((tapper) =>
    tapper.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <Sidebar title="Tappers" alignment="left" />
      <div className={styles.contentContainer}>
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

        <div className={styles.actionBar}>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search tappers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            className={styles.addButton}
            onClick={() => setIsAdding(true)}
          >
            <UserPlus size={20} />
            Add New Tapper
          </button>
        </div>

        {isAdding && (
          <div className={styles.addForm}>
            <input
              type="text"
              name="name"
              value={newTapper.name}
              onChange={handleInputChange}
              placeholder="Name"
              className={styles.input}
            />
            <input
              type="text"
              name="contactNumber"
              value={newTapper.contactNumber}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className={styles.input}
            />
            <input
              type="text"
              name="address"
              value={newTapper.address}
              onChange={handleInputChange}
              placeholder="Address"
              className={styles.input}
            />
            <input
              type="date"
              name="joiningDate"
              value={newTapper.joiningDate}
              onChange={handleInputChange}
              className={styles.input}
            />
            <button onClick={handleAddTapper} className={styles.saveButton}>
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        )}

        <div className={styles.tapperList}>
          {filteredTappers.map((tapper) => (
            <div key={tapper.id} className={styles.tapperCard}>
              <div className={styles.tapperInfo}>
                <h3>{tapper.name}</h3>
                <p>{tapper.contactNumber}</p>
                <p>{tapper.address}</p>
                <p>Joined: {tapper.joiningDate}</p>
              </div>
              <div className={styles.tapperActions}>
                <button className={styles.editButton}>
                  <Edit size={18} />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteTapper(tapper.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TapperManagementPage;
