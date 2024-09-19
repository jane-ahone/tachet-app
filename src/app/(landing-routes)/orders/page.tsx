"use client";

import React, { useState, useEffect } from "react";
import styles from "./orders.module.css";
import Sidebar from "@/components/layout/Sidebar/page";
import {
  LogOut,
  Users,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Hammer,
  BadgeDollarSign,
} from "lucide-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import EditModal from "@/components/EditModal/editModal";
import { Customer, Order, OrderData, FieldConfig } from "@/lib/types/interface";
import CustomCard from "@/components/layout/Card/page";
import { createHandleInputChange } from "@/lib/helpers/tableHelpers";
import CustomButton from "@/components/Button/button";

const OrderPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  //Navbar icons and route links

  const navBarItems = [
    {
      route: "Sales",
      link: "/sales",
      icon: BadgeDollarSign,
      id: "sales",
    },
    {
      route: "Production",
      link: "/production",
      icon: Hammer,
      id: "production",
    },
    {
      route: "Customers",
      link: "/customers",
      icon: Users,
      id: "customers",
    },
    {
      route: "Sign Out",
      link: "/logout",
      icon: LogOut,
      id: "logout",
    },
  ];

  const statusOptions = ["pending", "inprogress", "completed"];

  /*OrderData stores field values when adding information to the table
  Orders stores all the order information
  formInitialData stores the initial information to be updated
  UpdateModal is used to toggle the visibility of the update modal
  */

  const [orderData, setOrderData] = useState<OrderData>({
    customerId: 1,
    customerName: "",
    orderQty: 1,
    orderDate: new Date().toISOString().split("T")[0],
    status: "pending",
  });
  const [formInitialData, setFormInitialData] = useState<Order>({
    id: 1,
    customerName: "",
    customerId: 1,
    orderQty: 1,
    orderDate: new Date().toISOString().split("T")[0],
    status: "pending",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  const fields: FieldConfig[] = [
    { name: "orderDate", label: "Date", type: "date", required: true },
    {
      name: "customerId",
      label: "Customer",
      type: "select",
      options: customers.map((c) => ({
        value: c.customer_id.toString(),
        label: c.customer_name,
      })),
      required: true,
    },
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
        { value: "pending", label: "pending" },
        { value: "inprogress", label: "inprogress" },
        { value: "completed", label: "completed" },
      ],
      required: true,
    },
  ];

  useEffect(() => {
    // Fetch customers and orders from API
    // For now, we'll use dummy data
    // I will use a join so this set Customers will go
    setCustomers([
      {
        customer_id: 1,
        customer_name: "John Doe",
        phone_number: "1234567890",
        email: "john@example.com",
        home_address: "123 Main St",
      },
    ]);

    (async () => {
      try {
        const response = await fetch("/api/orderss");
        if (!response.ok) {
          throw new Error("Failed to fetch ordersss");
        }
        const data = await response.json();
        console.log(data.ordersss);
        setOrders(data.ordersss);
      } catch (error) {
        console.log(error);
        setOrders([
          {
            id: 1,
            customerId: 1,
            customerName: "John Doe",
            orderQty: 100,
            orderDate: "2024-09-01",
            status: "pending",
          },
          {
            id: 2,
            customerId: 2,
            customerName: "John Doe",
            orderQty: 150,
            orderDate: "2024-09-02",
            status: "completed",
          },
          {
            id: 3,
            customerId: 1,
            customerName: "John Doe",
            orderQty: 200,
            orderDate: "2024-09-03",
            status: "inprogress",
          },
        ]);
      }
    })();
  }, []);

  const handleInputChange = createHandleInputChange(setOrderData);

  const handleOrderQtyChange = (value: string) => {
    setOrderData((prev) => ({ ...prev, orderQty: parseInt(value) }));
  };

  const handleUpdate = (id: any) => {
    console.log("Edit order", id);
    orders.map((order) => {
      if (order.id == id) {
        setFormInitialData(order);
      }
    });
    setUpdateModal(true);
  };
  const handleDelete = (id: any) => {
    console.log("Delete order", id);
    alert("Are you sure you want to delete this field?");

    const deleteOrderDB = async (id: number) => {
      try {
        const response = await fetch(`/api/orderss/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete orderss");
        }

        const data = await response.json();
        console.log(`Order succesfully deleted: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    deleteOrderDB(id);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted order data:", orderData);
    // Here you would typically send this data to your backend

    (async () => {
      try {
        const response = await fetch("/api/orderss", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error("Failed to add order");
        }

        const data = await response.json();
        console.log(`New order added: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    })();

    // After successful submission:
    const newOrder: Order = {
      id: orders.length + 1,
      customerId: orderData.customerId,
      customerName: "",
      orderQty: orderData.orderQty,
      orderDate: orderData.orderDate,
      status: "pending",
    };
    setOrders((prev) => [...prev, newOrder]);
    onClose();
    toast({
      title: "Order created.",
      description: "We've created your order for you.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSort = (key: keyof Order) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key as keyof Order] < b[sortConfig.key as keyof Order]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key as keyof Order] > b[sortConfig.key as keyof Order]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter((order) => {
    const customer = customers.find((c) => c.customer_id === order.customerId);
    const matchesSearch =
      order.orderDate.includes(searchTerm) ||
      order.orderQty.toString().includes(searchTerm) ||
      customer?.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" ||
      order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container-routes">
      <Sidebar title="Orders" sideNavitems={navBarItems} alignment="top" />

      <div className={styles.content}>
        <div className={styles.actions}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search orders..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">pending</option>
            <option value="inprogress">inprogress</option>
            <option value="completed">completed</option>
          </select>
        </div>

        {/* <div className="cardSummary">
          <CustomCard title="pending" data={`Orders: 1 Volume:200L`} />
          <CustomCard title="inprogress" data="Orders: 1 Volume:200L" />
          <CustomCard title="completed" data="Orders: 1 Volume:200L" />
        </div> */}

        <Table variant="simple" className="dataTable">
          <Thead>
            <Tr sx={{ backgroundColor: "#32593b" }}>
              <Th color="white" onClick={() => handleSort("orderDate")}>
                Date
                {sortConfig.key === "orderDate" &&
                  (sortConfig.direction === "ascending" ? (
                    <ArrowUp style={{ display: "inline-block" }} size={14} />
                  ) : (
                    <ArrowDown style={{ display: "inline-block" }} size={14} />
                  ))}
              </Th>
              <Th color="white">Customer</Th>
              <Th color="white" onClick={() => handleSort("orderQty")}>
                Quantity
                {sortConfig.key === "orderQty" &&
                  (sortConfig.direction === "ascending" ? (
                    <ArrowUp style={{ display: "inline-block" }} size={14} />
                  ) : (
                    <ArrowDown style={{ display: "inline-block" }} size={14} />
                  ))}
              </Th>
              <Th color="white" onClick={() => handleSort("status")}>
                Status
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "ascending" ? (
                    <ArrowUp style={{ display: "inline-block" }} size={14} />
                  ) : (
                    <ArrowDown style={{ display: "inline-block" }} size={14} />
                  ))}
              </Th>
              <Th color="white">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredOrders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.orderDate}</Td>
                <Td>
                  {
                    customers.find((c) => c.customer_id === order.customerId)
                      ?.customer_name
                  }
                </Td>
                <Td>{order.orderQty}</Td>

                <Td>
                  <span className={"status " + `${[order.status]}`}>
                    {order.status}
                  </span>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit order"
                    icon={<Edit size={18} />}
                    className="edit-btn"
                    size="sm"
                    mr={2}
                    onClick={() => {
                      handleUpdate(order.id);
                    }}
                  />

                  <IconButton
                    aria-label="Delete order"
                    icon={<Trash2 size={18} />}
                    className="delete-btn"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center" fontWeight={600}>
              New Order
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired mt={4}>
                  <FormLabel color="var(--Gray-Gray-700)">Order Date</FormLabel>
                  <Input
                    type="date"
                    name="orderDate"
                    value={orderData.orderDate}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel color="var(--Gray-Gray-700)">Customer</FormLabel>
                  <Select
                    name="customerId"
                    value={orderData.customerId}
                    onChange={handleInputChange}
                    placeholder="Select customer"
                  >
                    {customers.map((customer) => (
                      <option
                        key={customer.customer_id}
                        value={customer.customer_id}
                      >
                        {customer.customer_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel color="var(--Gray-Gray-700)">
                    Order Quantity
                  </FormLabel>
                  <NumberInput
                    min={1}
                    value={orderData.orderQty}
                    onChange={handleOrderQtyChange}
                  >
                    <NumberInputField name="orderQty" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel color="var(--Gray-Gray-700)">
                    Order Status
                  </FormLabel>
                  <Select
                    name="status"
                    value={orderData.status}
                    onChange={handleInputChange}
                    placeholder="Select Status"
                  >
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Change the button to the custom one I made */}

                <CustomButton type="submit" className={styles.createNewBtn}>
                  Create
                </CustomButton>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Can make this code reusable */}

        <div className="new-tb-entry-btn-div">
          <button className="new-tb-entry-btn" onClick={onOpen}>
            <PlusCircle size={20} />
            Record New Entry
          </button>
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
    </div>
  );
};

export default OrderPage;
