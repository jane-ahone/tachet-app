"use client";

import React, { useState, useEffect } from "react";
import styles from "./orders.module.css";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar/page";
import {
  LogOut,
  Users,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
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

interface Customer {
  id: number;
  customerName: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
}

interface Order {
  id: number;
  customerId: number;
  orderQty: number;
  orderDate: string;
  status: string;
}

interface OrderData {
  customerId: string;
  orderQty: number;
  orderDate: string;
}

const OrderPage: React.FC = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const sideItems = [
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

  const [orderData, setOrderData] = useState<OrderData>({
    customerId: "",
    orderQty: 1,
    orderDate: new Date().toISOString().split("T")[0],
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    // Fetch customers and orders from API
    // For now, we'll use dummy data
    setCustomers([
      {
        id: 1,
        customerName: "John Doe",
        phoneNumber: "1234567890",
        email: "john@example.com",
        homeAddress: "123 Main St",
      },
      {
        id: 2,
        customerName: "Jane Smith",
        phoneNumber: "0987654321",
        email: "jane@example.com",
        homeAddress: "456 Elm St",
      },
    ]);

    setOrders([
      {
        id: 1,
        customerId: 1,
        orderQty: 100,
        orderDate: "2024-09-01",
        status: "Pending",
      },
      {
        id: 2,
        customerId: 2,
        orderQty: 150,
        orderDate: "2024-09-02",
        status: "Completed",
      },
      {
        id: 3,
        customerId: 1,
        orderQty: 200,
        orderDate: "2024-09-03",
        status: "In Progress",
      },
    ]);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderQtyChange = (value: string) => {
    setOrderData((prev) => ({ ...prev, orderQty: parseInt(value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted order data:", orderData);
    // Here you would typically send this data to your backend
    // After successful submission:
    const newOrder: Order = {
      id: orders.length + 1,
      customerId: parseInt(orderData.customerId),
      orderQty: orderData.orderQty,
      orderDate: orderData.orderDate,
      status: "Pending",
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
    const customer = customers.find((c) => c.id === order.customerId);
    const matchesSearch =
      order.orderDate.includes(searchTerm) ||
      order.orderQty.toString().includes(searchTerm) ||
      customer?.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" ||
      order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.container}>
      <Sidebar title="Orders" sideNavitems={sideItems} alignment="top" />

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
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <Button
            leftIcon={<PlusCircle size={15} />}
            iconSpacing={2}
            className={styles.newOrderBtn}
            sx={{
              position: "absolute",
              bottom: "0",
              right: "0",
              margin: "2rem",
              padding: "1rem",
              backgroundColor: "#7f8c8d",
              color: "white",
            }}
            size="md"
            onClick={onOpen}
          >
            Create New Order
          </Button>
          {/* Edit this button styling */}
        </div>

        <Table variant="simple" className={styles.table}>
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
                    customers.find((c) => c.id === order.customerId)
                      ?.customerName
                  }
                </Td>
                <Td>{order.orderQty}</Td>
                <Td>{order.status}</Td>
                <Td>
                  <IconButton
                    aria-label="Edit order"
                    icon={<Edit size={18} />}
                    size="sm"
                    mr={2}
                    onClick={() => console.log("Edit order", order.id)}
                  />
                  <IconButton
                    aria-label="Delete order"
                    icon={<Trash2 size={18} />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => console.log("Delete order", order.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center" color="#593b32" fontWeight={700}>
              Create New Order
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    name="customerId"
                    value={orderData.customerId}
                    onChange={handleInputChange}
                    placeholder="Select customer"
                  >
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.customerName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Order Quantity</FormLabel>
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
                  <FormLabel>Order Date</FormLabel>
                  <Input
                    type="date"
                    name="orderDate"
                    value={orderData.orderDate}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button
                  mt={6}
                  color="white"
                  backgroundColor="#7f8c8d"
                  type="submit"
                >
                  Create Order
                </Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default OrderPage;
