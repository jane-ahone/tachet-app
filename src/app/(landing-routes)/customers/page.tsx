"use client";

import React, { useState, useEffect } from "react";
import styles from "./customer.module.css";
import {
  UserPlus,
  Edit,
  Trash2,
  Search,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar/page";

interface Customer {
  id: number;
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  registrationDate: string;
}

const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({
    name: "",
    contactNumber: "",
    email: "",
    address: "",
    registrationDate: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const sideItems = [
    {
      route: "Orders",
      link: "/orders",
      icon: ShoppingBag,
      id: "orders",
    },
    {
      route: "Sign Out",
      link: "/logout",
      icon: LogOut,
      id: "logout",
    },
  ];

  useEffect(() => {
    // Fetch customers data from API
    // For now, we'll use dummy data
    setCustomers([
      {
        id: 1,
        name: "Alice Johnson",
        contactNumber: "1234567890",
        email: "alice@example.com",
        address: "123 Main St",
        registrationDate: "2023-01-15",
      },
      {
        id: 2,
        name: "Bob Williams",
        contactNumber: "0987654321",
        email: "bob@example.com",
        address: "456 Elm Ave",
        registrationDate: "2023-03-22",
      },
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = () => {
    // In a real application, you would send this data to your API
    const customer = { id: customers.length + 1, ...newCustomer };
    setCustomers((prev) => [...prev, customer]);
    setNewCustomer({
      name: "",
      contactNumber: "",
      email: "",
      address: "",
      registrationDate: "",
    });
    setIsAdding(false);
  };

  const handleDeleteCustomer = (id: number) => {
    // In a real application, you would send a delete request to your API
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <Sidebar title="Customers" alignment="top" sideNavitems={sideItems} />
      <div className={styles.contentContainer}>
        <div className={styles.actionBar}>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search customers..."
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
            Add New Customer
          </button>
        </div>

        {isAdding && (
          <div className={styles.addForm}>
            <input
              type="text"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              placeholder="Name"
              className={styles.input}
            />
            <input
              type="text"
              name="contactNumber"
              value={newCustomer.contactNumber}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className={styles.input}
            />
            <input
              type="email"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={styles.input}
            />
            <input
              type="text"
              name="address"
              value={newCustomer.address}
              onChange={handleInputChange}
              placeholder="Address"
              className={styles.input}
            />
            <input
              type="date"
              name="registrationDate"
              value={newCustomer.registrationDate}
              onChange={handleInputChange}
              className={styles.input}
            />
            <button onClick={handleAddCustomer} className={styles.saveButton}>
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

        <div className={styles.customerList}>
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className={styles.customerCard}>
              <div className={styles.customerInfo}>
                <h3>{customer.name}</h3>
                <p>{customer.contactNumber}</p>
                <p>{customer.email}</p>
                <p>{customer.address}</p>
                <p>Registered: {customer.registrationDate}</p>
              </div>
              <div className={styles.customerActions}>
                <button className={styles.editButton}>
                  <Edit size={18} />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteCustomer(customer.id)}
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

export default CustomerManagementPage;
