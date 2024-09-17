"use client";

/* Handling API calls
I save and update new tappers locally and get data from database only on load
Improve the error handling for if the first api call fails
*/

import React, { useState, useEffect } from "react";
import styles from "./tapper.module.css";
import { UserPlus, Edit, Trash2, Search, LogOut, Hammer } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar/page";
import EditModal from "@/components/EditModal/editModal";
import { createHandleInputChange } from "@/lib/helpers/tableHelpers";
import { FieldConfig, Tapper, Order } from "@/lib/types/interface";

const TapperManagementPage: React.FC = () => {
  const [tappers, setTappers] = useState<Tapper[]>([]);
  const [newTapper, setNewTapper] = useState<Omit<Tapper, "tapper_id">>({
    tapper_name: "",
    phone_number: "",
    email: "",
    home_address: "",
    joiningDate: "",
  });
  const [formInitialData, setFormInitialData] = useState<Order>({
    id: 1,
    customerId: 2,
    customerName: "John Doe",
    orderQty: 1,
    orderDate: new Date().toISOString().split("T")[0],
    status: "Pending",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sideItems = [
    {
      route: "Production",
      link: "/production",
      icon: Hammer,
      id: "production",
    },
    {
      route: "Sign Out",
      link: "/logout",
      icon: LogOut,
      id: "logout",
    },
  ];

  const fields: FieldConfig[] = [
    { name: "orderDate", label: "Date", type: "date", required: true },
    // {
    //   // name: "customerId",
    //   // label: "Customer",
    //   // type: "select",
    //   // options: customers.map((c) => ({
    //   //   value: c.id.toString(),
    //   //   label: c.customerName,
    //   // })),
    //   required: true,
    // },
    {
      name: "orderQty",
      label: "Order Quantity",
      type: "number",
      required: true,
    },

    {
      name: "status",
      label: "Production Status",
      type: "select",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
      ],
      required: true,
    },
  ];

  useEffect(() => {
    // Fetch tappers data from API
    const fetchTappers = async () => {
      try {
        const response = await fetch("/api/tappers");
        if (!response.ok) {
          throw new Error("Failed to fetch tappers");
        }
        const data = await response.json();
        console.log(data.tappers);
        setTappers(data.tappers);
      } catch (error) {
        console.log(error);
        setTappers([
          {
            tapper_id: 1,
            tapper_name: "John Doe",
            phone_number: "1234567890",
            email: "there's been an error",
            home_address: "123 Palm St",
            joiningDate: "2023-01-15",
          },
        ]);
      }
    };
    fetchTappers();
  }, []);

  const handleInputChange = createHandleInputChange(setNewTapper);
  const handleUpdateTapper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("UpdateTapperted order data:");
    // Here you would typically send this data to your backend
    // After successful submission:
  };

  const handleAddTapper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tapper = { tapper_id: tappers.length + 1, ...newTapper };
    setTappers((prev) => [...prev, tapper]);

    //sending data to API
    const addTapperDB = async () => {
      try {
        const response = await fetch("/api/tapper", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTapper),
        });

        if (!response.ok) {
          throw new Error("Failed to add tapper");
        }

        const data = await response.json();
        console.log(`New tapper added: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    addTapperDB();

    //reset tappers
    setNewTapper({
      tapper_name: "",
      phone_number: "",
      home_address: "",
      email: "",
      joiningDate: "",
    });

    setIsAdding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDeleteTapper = (id: number) => {
    // request call
    const deleteTapperDB = async (id: number) => {
      try {
        const response = await fetch(`/api/tapper/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete tapper");
        }

        const data = await response.json();
        console.log(`Tapper succesfully deleted: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    deleteTapperDB(id);
    setTappers((prev) => prev.filter((tapper) => tapper.tapper_id !== id));
  };

  const filteredTappers = tappers.filter((tapper) =>
    tapper.tapper_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <Sidebar title="Tappers" alignment="top" sideNavitems={sideItems} />
      <div className={styles.contentContainer}>
        <div className={styles.actionBar}>
          <div className={styles.searchBar}>
            <input
              type="search"
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
          <form onSubmit={handleAddTapper} className={styles.addForm}>
            <input
              type="text"
              name="tapper_name"
              value={newTapper.tapper_name}
              onChange={handleInputChange}
              placeholder="Name"
              className={styles.input}
            />
            <input
              type="tel"
              name="phone_number"
              value={newTapper.phone_number}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className={styles.input}
            />
            <input
              type="text"
              name="home_address"
              value={newTapper.home_address}
              onChange={handleInputChange}
              placeholder="Address"
              className={styles.input}
            />
            <input
              type="email"
              name="email"
              value={newTapper.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={styles.input}
            />
            <input
              type="date"
              name="joiningDate"
              value={newTapper.joiningDate}
              onChange={handleInputChange}
              className={styles.input}
            />
            <button
              type="submit"
              className={styles.saveButton}
              // disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className={styles.cancelButton}
              // disabled={isSubmitting}
            >
              Cancel
            </button>
          </form>
        )}

        <div className={styles.list}>
          {filteredTappers.map((tapper) => (
            <div key={tapper.tapper_id} className={styles.card}>
              <div className={styles.info}>
                <h3>{tapper.tapper_name}</h3>
                <p>{tapper.phone_number}</p>
                <p>{tapper.email}</p>
                <p>{tapper.home_address}</p>
                <p>Joined: {tapper.joiningDate}</p>
              </div>
              <div className={styles.customerActions}>
                <button className={styles.editButton}>
                  <Edit
                    size={18}
                    onClick={() => {
                      setUpdateModal(true);
                    }}
                  />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    handleDeleteTapper(tapper.tapper_id);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {updateModal ? (
          <EditModal
            initialData={formInitialData}
            fields={fields}
            updateModal={updateModal}
            setUpdateModal={setUpdateModal}
            handleSubmit={handleUpdateTapper}
          />
        ) : null}
      </div>
    </div>
  );
};

export default TapperManagementPage;
