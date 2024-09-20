"use client";

import React, { useState, useEffect } from "react";
import styles from "./customer.module.css";
import {
  UserPlus,
  Edit,
  Trash2,
  LogOut,
  ShoppingBag,
  Save,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar/page";
import EditModal from "@/components/EditModal/editModal";
import { createHandleInputChange } from "@/lib/helpers/tableHelpers";
import { Order, FieldConfig, Customer } from "@/lib/types/interface";
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

const CustomerManagementPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formInitialData, setFormInitialData] = useState<Customer>({
    customer_id: 1,
    customer_name: "John Doe",
    email: "default@gmail.com",
    phone_number: "123456",
    home_address: "Malibu Street",
  });
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "customer_id">>(
    {
      customer_name: "",
      phone_number: "",
      email: "",
      home_address: "",
      registrationDate: "",
    }
  );
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  const sideItems = [
    {
      route: "Orders",
      link: "/orders",
      icon: ShoppingBag,
      id: "orders",
    },
  ];

  const fields: FieldConfig[] = [
    {
      name: "customer_name",
      label: "Customer Name",
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
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customerss");
        if (!response.ok) {
          throw new Error("Failed to fetch tappers");
        }
        const data = await response.json();
        console.log(data.tappers);
        setCustomers(data.tappers);
      } catch (error) {
        console.log(error);
        setCustomers([
          {
            customer_id: 1,
            customer_name: "John Doe",
            phone_number: "1234567890",
            email: "there's been an error",
            home_address: "123 Palm St",
            registrationDate: "2023-01-15",
          },
        ]);
      }
    };
    fetchCustomers();
  }, []);

  const handleInputChange = createHandleInputChange(setNewCustomer);

  const handleAddCustomer = () => {
    // In a real application, you would send this data to your API
    const customer = { customer_id: customers.length + 1, ...newCustomer };
    setCustomers((prev) => [...prev, customer]);
    //
    (async () => {
      try {
        const response = await fetch("/api/customerss", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer),
        });

        if (!response.ok) {
          throw new Error("Failed to add customerss");
        }

        const data = await response.json();
        console.log(`New customerss added: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    })();

    //Resetting customer
    setNewCustomer({
      customer_name: "",
      phone_number: "",
      email: "",
      home_address: "",
      registrationDate: "",
    });
    setIsAdding(false);
  };

  const handleDeleteCustomer = (id: number) => {
    // In a real application, you would send a delete request to your API
    setCustomers((prev) =>
      prev.filter((customer) => customer.customer_id !== id)
    );

    // request call
    const deleteCustomerDB = async (id: number) => {
      try {
        const response = await fetch(`/api/customerss/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete customerss");
        }

        const data = await response.json();
        console.log(`Customer succesfully deleted: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    deleteCustomerDB(id);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted order data:");
    // Here you would typically send this data to your backend
    // After successful submission:
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container-routes">
      <Sidebar title="Customers" alignment="top" sideNavitems={sideItems} />
      <div className={styles.contentContainer}>
        <div className={styles.actionBar}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button className={styles.addButton} onClick={onOpen}>
            <UserPlus size={20} />
            Add New Tapper
          </button>
        </div>

        {
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader textAlign="center">New Customer</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleAddCustomer}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="tapper_name"
                      value={newCustomer.customer_name}
                      onChange={handleInputChange}
                      placeholder="Name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      type="tel"
                      name="phone_number"
                      value={newCustomer.phone_number}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Home Address</FormLabel>
                    <Input
                      type="text"
                      name="home_address"
                      value={newCustomer.home_address}
                      onChange={handleInputChange}
                      placeholder="Address"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={newCustomer.email}
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

        <div className={styles.customerList}>
          {filteredCustomers.map((customer) => (
            <div key={customer.customer_id} className={styles.customerCard}>
              <div className={styles.customerInfo}>
                <h3>{customer.customer_name}</h3>
                <p>{customer.phone_number}</p>
                <p>{customer.email}</p>
                <p>{customer.home_address}</p>
                <p>Registered: {customer.registrationDate}</p>
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
                  onClick={() => handleDeleteCustomer(customer.customer_id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {updateModal ? (
        <EditModal
          initialData={formInitialData}
          fields={fields}
          updateModal={updateModal}
          setUpdateModal={setUpdateModal}
          handleSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
};

export default CustomerManagementPage;
