"use client";

/* Handling API calls
I save and update new tappers locally and get data from database only on load
Improve the error handling for if the first api call fails
*/

import React, { useState, useEffect } from "react";
import styles from "./tapper.module.css";
import { UserPlus, Edit, Trash2, LogOut, Hammer, Save } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar/page";
import EditModal from "@/components/EditModal/editModal";
import { createHandleInputChange } from "@/lib/helpers/tableHelpers";
import { FieldConfig, Tapper, Order } from "@/lib/types/interface";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import ScrollToTopButton from "@/components/ScrolltoTop/page";
import AddNewRecordBtn from "@/components/AddNewRecordBtn/page";

const TapperManagementPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const [searchTerm, setSearchTerm] = useState("");
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  const sideItems = [
    {
      route: "Production",
      link: "/production",
      icon: Hammer,
      id: "production",
    },
  ];

  const fields: FieldConfig[] = [
    {
      name: "tapper_name",
      label: "Tapper Name",
      type: "text",
      required: true,
    },
    {
      name: "phone_number",
      label: "Phone Number",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "text",
      required: true,
    },
    {
      name: "home_address",
      label: "Home Address",
      type: "text",
      required: true,
    },
  ];

  useEffect(() => {
    // Fetch tappers data from API
    (async () => {
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
    })();
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
    <div className="page-container-routes">
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

          <AddNewRecordBtn onOpen={onOpen} />
        </div>

        {
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader textAlign="center">New Tapper</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleAddTapper}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="tapper_name"
                      value={newTapper.tapper_name}
                      onChange={handleInputChange}
                      placeholder="Name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      type="tel"
                      name="phone_number"
                      value={newTapper.phone_number}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Home Address</FormLabel>
                    <Input
                      type="text"
                      name="home_address"
                      value={newTapper.home_address}
                      onChange={handleInputChange}
                      placeholder="Address"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={newTapper.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                    />
                  </FormControl>

                  <Button mt={6} colorScheme="green" type="submit">
                    <Save size={18} style={{ marginRight: "0.5rem" }} />
                    Save
                  </Button>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        }

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
