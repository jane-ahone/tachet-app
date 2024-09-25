"use client";

import React, { useState, useEffect } from "react";
import styles from "./customer.module.css";
import { UserPlus, Edit, Trash2, ShoppingBag, Save } from "lucide-react";
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
import { useSharedContext } from "@/app/SharedContext";
import AddNewRecordBtn from "@/components/AddNewRecordBtn/page";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
  const { sharedData, setSharedData } = useSharedContext();

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/customers");
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        setCustomers(data.customers);
        setSharedData({ ...sharedData, customers: data.customers });
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching customer data.");
        setCustomers([
          {
            customer_id: 1,
            customer_name: "John Doe",
            phone_number: "1234567890",
            email: "error@example.com",
            home_address: "123 Palm St",
            registrationDate: "2023-01-15",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (sharedData?.customers.length > 0) {
      setCustomers(sharedData?.customers);
    } else {
      fetchCustomers();
    }
  }, [sharedData]);

  const handleInputChange = createHandleInputChange(setNewCustomer);

  const handleAddCustomer = (e: React.FormEvent) => {
    // In a real application, you would send this data to your API
    e.preventDefault();

    (async () => {
      try {
        const response = await fetch("/api/customerss", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer),
        });

        const data = await response.json();

        // setSharedData((prevData) => ({
        //   ...prevData,
        //   customers: [...prevData.customers, data],
        // }));
        console.log(`New customer added: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
      //Move to try block when finished
      const customer = { customer_id: customers.length + 1, ...newCustomer };
      setSharedData((prevData) => ({
        ...prevData,
        customers: [...prevData.customers, customer],
      })); //setting it in the useContext
      //
    })();

    //Resetting customer
    setNewCustomer({
      customer_name: "",
      phone_number: "",
      email: "",
      home_address: "",
      registrationDate: "",
    });
  };

  const handleDeleteCustomer = (id: number) => {
    // In a real application, you would send a delete request to your API

    // request call
    (async (id: number) => {
      try {
        const response = await fetch(`/api/customerss/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete customer");
        }

        const data = await response.json();
        // setSharedData((prevData) => ({
        //   ...prevData,
        //   customers: prevData.customers
        //     ? prevData.customers.filter(
        //         (customer: Customer) => customer.customer_id !== id
        //       )
        //     : [],
        // }));
        console.log(`Customer succesfully deleted: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    })(id);
    //Move to try block
    setSharedData((prevData) => ({
      ...prevData,
      customers: prevData.customers
        ? prevData.customers.filter(
            (customer: Customer) => customer.customer_id !== id
          )
        : [],
    }));
  };

  const handleEditField = (id: number) => {
    customers.map((customer) => {
      if (customer.customer_id == id) {
        setFormInitialData(customer);
      }
    });
    setUpdateModal(true);
  };
  const handleUpdateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted order data:");
    // Here you would typically send this data to your backend
    // After successful submission:
  };

  console.log(formInitialData);

  console.log("My customers", customers);

  const filteredCustomers = customers.filter((customer) =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container-routes">
      <Sidebar title="Customers" alignment="top" sideNavitems={sideItems} />
      <div className={styles.contentContainer}>
        <div className={styles.actionBar}>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="searchInput"
            />
          </div>
          <AddNewRecordBtn onOpen={onOpen} />
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
                      name="customer_name"
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
                      handleEditField(customer.customer_id);
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
          handleSubmit={handleUpdateCustomer}
        />
      ) : null}
    </div>
  );
};

export default CustomerManagementPage;
