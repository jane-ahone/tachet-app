"use client";

/*formData stores field values when adding information to the table
  Orders stores all the order information
  formInitialData stores the initial information to be updated
  UpdateModal is used to toggle the visibility of the update modal
   //Navbar icons and route links
  */

import React, { useState, useEffect } from "react";
import styles from "./orders.module.css";
import Sidebar from "@/components/layout/Sidebar/page";
import {
  Users,
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
} from "@chakra-ui/react";
import EditModal from "@/components/EditModal/editModal";
import { Customer, Order, FieldConfig } from "@/lib/types/interface";

import { createHandleInputChange } from "@/lib/helpers/tableHelpers";
import CustomButton from "@/components/Button/button";
import ScrollToTopButton from "@/components/ScrolltoTop/page";
import AddNewRecordBtn from "@/components/AddNewRecordBtn/page";
import AlertDialogExample from "@/components/DeleteAlert/delete";
import { useSharedContext } from "@/app/sharedContexts";
import {
  useErrorToast,
  useSuccessToast,
} from "@/components/layout/ResponseToast/page";

const OrderPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { sharedData, setSharedData } = useSharedContext();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

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
      link: "/orders/customers",
      icon: Users,
      id: "customers",
    },
  ];

  const statusOptions = ["pending", "inprogress", "completed", "cancelled"];

  const [formData, setFormData] = useState<Order>({
    order_id: 1,
    customer_id: 1,
    customer_name: "",
    order_qty: 1,
    order_date: new Date().toISOString().split("T")[0],
    status: "pending",
  });
  const [formInitialData, setFormInitialData] = useState<Order>({
    order_id: 1,
    customer_name: "",
    customer_id: 1,
    order_qty: 1,
    order_date: new Date().toISOString().split("T")[0],
    status: "pending",
  });
  const [updateFormData, setUpdateFormData] = useState<Order>({
    order_id: 1,
    customer_name: "",
    customer_id: 1,
    order_qty: 1,
    order_date: new Date().toISOString().split("T")[0],
    status: "pending",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  const fields: FieldConfig[] = [
    { name: "order_date", label: "Date", type: "date", required: true },
    {
      name: "customer_id",
      label: "Customer",
      type: "select",
      options: customers.map((c) => ({
        value: c.customer_id.toString(),
        label: c.customer_name,
      })),
      required: true,
    },
    {
      name: "order_qty",
      label: "Order Quantity",
      type: "number",
      required: true,
    },

    {
      name: "status",
      label: "Production Status",
      type: "select",
      options: statusOptions.map((option) => ({
        value: option,
        label: option,
      })),

      required: true,
    },
  ];

  useEffect(() => {
    if (sharedData?.customers?.length > 0) {
      console.log("Fetching from cache;customers");
      setCustomers(sharedData?.customers);
    } else {
      // Fetch customers if not in shared context
      (async () => {
        try {
          const response = await fetch("/api/customer");
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch customers");
          }
          setSharedData((prev) => ({ ...prev, customers: data.customers }));
          showSuccessToast("Success fetching customer data");
        } catch (error) {
          console.log(error);
          showErrorToast("Error fetching customer data");
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedData?.customers]);

  useEffect(() => {
    if (sharedData?.orders?.length > 0) {
      setOrders(sharedData?.orders);
    } else {
      (async () => {
        try {
          const response = await fetch("/api/orders");
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch orders");
          }
          setSharedData((prev) => ({ ...prev, orders: data.orders }));
          showSuccessToast("Success fetching order data");
        } catch (error) {
          console.log(error);
          showErrorToast("Error fetching order data");
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedData?.orders]);

  const handleInputChange = createHandleInputChange(setFormData);

  const handleOrderQtyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, order_qty: parseInt(value) }));
  };

  const handleEditField = (id: number) => {
    orders.map((order) => {
      if (order.order_id == id) {
        setFormInitialData(order);
        setUpdateModal(true);
      }
    });
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const { order_id } = formInitialData;

    try {
      const response = await fetch(`/api/orders/${order_id}`, {
        method: "PUT",
        body: JSON.stringify(updateFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occured");
      }

      const updatedOrders = orders.filter(
        (order) => order.order_id !== order_id
      );
      setSharedData({ ...sharedData, orders: updatedOrders });
      showSuccessToast("The order has been successfully updated.");
    } catch (error) {
      console.log(`Error: ${error}`);
      showErrorToast("Failed to update order.");
    } finally {
      setUpdateModal(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occured");
      }

      const updatedOrders = orders.filter((order) => order.order_id !== id);
      setSharedData({ ...sharedData, orders: updatedOrders });
      showSuccessToast("The order has been successfully deleted.");
    } catch (error) {
      console.log(`Error: ${error}`);
      showErrorToast("Failed to delete order.");
    }
  };

  const handleAddOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted order data:", formData);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      setSharedData((prevSharedData) => ({
        ...prevSharedData,
        orders: [...prevSharedData.orders, data.orders],
      }));

      onClose();
      showSuccessToast("We've created your order for you.");
    } catch (error) {
      console.log(`Error: ${error}`);
      onClose();
      showErrorToast("Failed to create order.");
    }
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
    const customer = customers.find((c) => c.customer_id === order.customer_id);
    const matchesSearch =
      (searchTerm
        ? order.order_date.includes(searchTerm) ||
          order.order_qty.toString().includes(searchTerm) ||
          customer?.customer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase())
        : true) &&
      (startDate ? order.order_date >= startDate : true) &&
      (endDate ? order.order_date <= endDate : true);
    const matchesStatus =
      filterStatus === "" ||
      order.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container-routes">
      <Sidebar title="Orders" sideNavitems={navBarItems} alignment="top" />

      <div className={styles.content}>
        <div className="actions">
          <div className="dateFilterContainer">
            <input
              type="date"
              name="select-date"
              className="dateInput"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <span className="dateRangeSeparator">to</span>
            <input
              type="date"
              name="select-date"
              className="dateInput"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search orders..."
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filterSelect"
            value={filterStatus}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map((option, index) => (
              <option key={index} value={option}>
                {" "}
                {option}{" "}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="cardSummary">
          <CustomCard title="pending" data={`Orders: 1 Volume:200L`} />
          <CustomCard title="inprogress" data="Orders: 1 Volume:200L" />
          <CustomCard title="completed" data="Orders: 1 Volume:200L" />
        </div> */}

        <AddNewRecordBtn onOpen={onOpen} />
        <Table variant="simple" className="dataTable">
          <Thead>
            <Tr sx={{ backgroundColor: "#32593b" }}>
              <Th color="white" onClick={() => handleSort("order_date")}>
                Date
                {sortConfig.key === "orderDate" &&
                  (sortConfig.direction === "ascending" ? (
                    <ArrowUp style={{ display: "inline-block" }} size={14} />
                  ) : (
                    <ArrowDown style={{ display: "inline-block" }} size={14} />
                  ))}
              </Th>
              <Th color="white">Customer</Th>
              <Th color="white" onClick={() => handleSort("order_qty")}>
                Quantity
                {sortConfig.key === "order_qty" &&
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
              <Tr key={order.order_id}>
                <Td>{order.order_date.split("T")[0]}</Td>
                <Td>
                  {
                    customers.find((c) => c.customer_id === order.customer_id)
                      ?.customer_name
                  }
                </Td>
                <Td>{order.order_qty}</Td>

                <Td>
                  <span className={"status " + `${[order.status]}`}>
                    {order.status}
                  </span>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit order"
                    icon={<Edit size={18} />}
                    color="#333333"
                    className="edit-btn"
                    size="sm"
                    mr={2}
                    onClick={() => {
                      handleEditField(order.order_id);
                    }}
                  />

                  <IconButton
                    aria-label="Delete order"
                    icon={<Trash2 size={18} />}
                    color="#333333"
                    className="delete-btn"
                    size="sm"
                    onClick={() => handleDelete(order.order_id)}
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
              <form onSubmit={handleAddOrder}>
                <FormControl isRequired mt={4}>
                  <FormLabel color="var(--Gray-Gray-700)">Order Date</FormLabel>
                  <Input
                    type="date"
                    name="order_date"
                    value={formData.order_date}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel color="var(--Gray-Gray-700)">Customer</FormLabel>
                  <Select
                    name="customer_id"
                    value={formData.customer_id}
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
                    value={formData.order_qty}
                    onChange={handleOrderQtyChange}
                  >
                    <NumberInputField name="order_qty" />
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
                    value={formData.status}
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

                <CustomButton type="submit" className={styles.createNewBtn}>
                  Create
                </CustomButton>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
        {/* Can make this code reusable */}

        <ScrollToTopButton />
        {updateModal ? (
          <EditModal
            initialData={formInitialData}
            fields={fields}
            setUpdateFormData={setUpdateFormData}
            UpdateFormData={updateFormData}
            updateModal={updateModal}
            setUpdateModal={setUpdateModal}
            handleSubmit={handleUpdateOrder}
          />
        ) : null}
      </div>
    </div>
  );
};

export default OrderPage;
