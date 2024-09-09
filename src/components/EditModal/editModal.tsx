import React, { useState, useEffect, FormEvent } from "react";
import styles from "./editModal.module.css";
import Button from "@/components/Button/button";
import { X } from "lucide-react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

type HandleSubmit = (event: FormEvent<HTMLFormElement>) => void;

interface EditModalProps {
  handleSubmit: HandleSubmit;
  updateModal: boolean;
  setUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
}
interface OrderData {
  customerId: string;
  orderQty: number;
  orderDate: string;
}
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

const EditModal: React.FC<EditModalProps> = ({
  handleSubmit,
  updateModal,
  setUpdateModal,
}) => {
  const [orderData, setOrderData] = useState<OrderData>({
    customerId: "",
    orderQty: 1,
    orderDate: new Date().toISOString().split("T")[0],
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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
  return (
    <div>
      <section className={styles.updateModal}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <X
            onClick={() => {
              setUpdateModal(false);
            }}
            className={styles.CloseButton}
          ></X>
          <section className={styles.formFields}>
            <FormControl isRequired>
              <FormLabel>Customer</FormLabel>
              <Select
                name="customerId"
                value={1}
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

            <FormControl isRequired>
              <FormLabel>Payment Status</FormLabel>
              <Select
                name="customerId"
                value={orderData.customerId}
                onChange={handleInputChange}
                placeholder="Select Status"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Select>
            </FormControl>
          </section>

          <Button className={styles.submitButton}>Submit</Button>
        </form>
      </section>
    </div>
  );
};

export default EditModal;
