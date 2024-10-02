"use client";

import React, { useState, useEffect } from "react";
import styles from "./purchases.module.css";
import {
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Save,
} from "lucide-react";
import EditModal from "@/components/EditModal/editModal";
import { Order, Purchase, FieldConfig, Tapper } from "@/lib/types/interface";
import Sidebar from "@/components/layout/Sidebar/page";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import AddNewRecordBtn from "@/components/AddNewRecordBtn/page";
import { useSharedContext } from "@/app/sharedContext";

const PurchaseRecordPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { sharedData, setSharedData } = useSharedContext();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newPurchase, setNewPurchase] = useState<Omit<Purchase, "purchase_id">>(
    {
      purchase_date: "",
      item_type: "",
      quantity: 0,
      rejected_quantity: 0,
      amount: 0,
      custom_item_type: "",
      order_id: undefined,
    }
  );
  const [formInitialData, setFormInitialData] = useState<Purchase>({
    purchase_id: 1,
    purchase_date: "",
    item_type: "",
    quantity: 0,
    rejected_quantity: 0,
    amount: 0,
    custom_item_type: "",
    order_id: undefined,
  });
  const [updateFormData, setUpdateFormData] = useState<Purchase>({
    purchase_id: 1,
    purchase_date: "",
    item_type: "",
    quantity: 0,
    rejected_quantity: 0,
    amount: 0,
    custom_item_type: "",
    order_id: undefined,
  });

  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Purchase;
    direction: "ascending" | "descending";
  } | null>(null);

  const sideItems = [
    {
      route: "Production",
      link: "/production",
      icon: ShoppingBag,
      id: "production",
    },
  ];

  const fields: FieldConfig[] = [
    { name: "purchaseDate", label: "Date", type: "date", required: true },
    {
      name: "item_type",
      label: "Item Type",
      type: "text",
      required: true,
    },
    {
      name: "purchaseQty",
      label: "Purchase Quantity",
      type: "number",
      required: true,
    },
    {
      name: "Unit Price",
      label: "Unit Price",
      type: "text",
      required: true,
    },

    {
      name: "status",
      label: "Linked Order",
      type: "select",
      options: [
        { value: "John Doe", label: "John Doe" },
        { value: "N/A", label: "N/A" },
      ],
      required: true,
    },
  ];

  useEffect(() => {
    // Fetch purchases data
    (async () => {
      if (sharedData?.purchases.length > 0) {
        setPurchases(sharedData?.purchases);
      } else {
        try {
          const response = await fetch("/api/purchase");
          if (!response.ok) {
            throw new Error("Failed to fetch purchases");
          }
          const data = await response.json();

          setSharedData((prevData) => ({
            ...prevData,
            purchases: data.purchase,
          }));
        } catch (error) {
          console.error(error);

          setPurchases([
            {
              purchase_id: 1,
              purchase_date: "2023-09-01",
              item_type: "Bottles",
              quantity: 1000,
              rejected_quantity: 20,
              amount: 500,
              order_id: 1,
            },
            {
              purchase_id: 2,
              purchase_date: "2023-09-15",
              item_type: "Labels",
              quantity: 5000,
              rejected_quantity: 20,
              amount: 250,
            },
          ]);
        }
      }
    })();

    // Fetch orders data
    (async () => {
      if (sharedData?.orders.length > 0) {
        setOrders(sharedData?.orders);
      } else {
        try {
          const response = await fetch("/api/orderss");
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await response.json();
          console.log(data.orders);
          setOrders(data.orders);
          setSharedData((prevData) => ({ ...prevData, orders: data.orders }));
        } catch (error) {
          console.log(error);
          setOrders([
            {
              order_id: 1,
              customer_id: 2,
              customer_name: "Customer A",
              order_date: "2024-09-01",
              status: "Progress",
              order_qty: 1,
            },
          ]);
        }
      }
    })();
  }, [sharedData, setSharedData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPurchase((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price"
          ? parseFloat(value)
          : name === "order_id"
          ? value
            ? parseInt(value)
            : undefined
          : value,
    }));
  };

  const handleAddPurchase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //
    (async () => {
      try {
        const response = await fetch("/api/purchasess", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPurchase),
        });

        const data = await response.json();

        // setSharedData((prevData) => ({
        //   ...prevData,
        //   purchases: [...prevData.purchases, data],
        // }));
        console.log(`New purchase added: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
      //Move to try block when finished
      const purchase = { id: purchases.length + 1, ...newPurchase };
      setSharedData((prevData) => ({
        ...prevData,
        purchases: [...prevData.purchases, purchase],
      })); //setting it in the useContext
      //
    })();
    // In a real application, you would send this data to your API

    setNewPurchase({
      purchase_date: "",
      item_type: "",
      quantity: 0,
      rejected_quantity: 0,
      amount: 0,
      order_id: undefined,
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDeleteTapper = (id: number) => {
    // In a real application, you would send a delete request to your API

    // request call
    (async (id: number) => {
      try {
        const response = await fetch(`/api/tapperss/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete tapper");
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
        console.log(`Tapper succesfully deleted: ${data}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    })(id);
    //Move to try block
    setSharedData((prevData) => ({
      ...prevData,
      purchases: prevData.purchases
        ? prevData.purchases.filter(
            (purchase: Purchase) => purchase.purchase_id !== id
          )
        : [],
    }));
  };

  const handleSort = (key: keyof Purchase) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedPurchases = React.useMemo(() => {
    let sortablePurchases = [...purchases];
    if (sortConfig !== null && sortablePurchases.length >= 2) {
      sortablePurchases.sort((a, b) => {
        const valueA = a[sortConfig.key] ?? ""; // Default value if undefined
        const valueB = b[sortConfig.key] ?? ""; // Default value if undefined
        if (valueA < valueB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePurchases;
  }, [purchases, sortConfig]);

  const filteredPurchases = sortedPurchases.filter((purchase) => {
    const matchFilterStatus =
      filterStatus === "" ||
      purchase.item_type.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch =
      purchase.item_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.purchase_date.includes(searchTerm) ||
      startDate
        ? purchase.purchase_date >= startDate
        : null ||
          (endDate ? purchase.purchase_date <= endDate : null) ||
          orders
            .find((order) => order.order_id === purchase.order_id)
            ?.customer_name.toLowerCase()
            .includes(searchTerm.toLowerCase());
    return matchFilterStatus && matchSearch;
  });

  return (
    <div className="page-container-routes">
      <Sidebar title="Purchases" alignment="top" sideNavitems={sideItems} />
      <div className={styles.contentContainer}>
        <div className="actions">
          <div className="dateFilterContainer">
            <input
              type="date"
              className="dateInput"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <span className="dateRangeSeparator">to</span>
            <input
              type="date"
              className="dateInput"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search purchases..."
              name="searchBar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="searchInput"
            />
          </div>

          <select
            className="filterSelect"
            name="filterSelect"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="bottles">Bottles</option>
            <option value="labels">Labels</option>
          </select>
        </div>

        <div className={styles.purchaseList}>
          <AddNewRecordBtn onOpen={onOpen} />
          <Table variant="simple" className="dataTable">
            <Thead sx={{ backgroundColor: "#32593b" }}>
              <Tr>
                <Th color="white" onClick={() => handleSort("purchase_date")}>
                  Date{" "}
                  {sortConfig?.key === "purchase_date" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        size={14}
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      />
                    ))}
                </Th>
                <Th color="white" onClick={() => handleSort("item_type")}>
                  Item Type{" "}
                  {sortConfig?.key === "item_type" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        size={14}
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      />
                    ))}
                </Th>
                <Th color="white" onClick={() => handleSort("quantity")}>
                  Purchased Quantity{" "}
                  {sortConfig?.key === "quantity" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        size={14}
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      />
                    ))}
                </Th>
                <Th color="white">Rejected Quantity</Th>
                <Th color="white" onClick={() => handleSort("amount")}>
                  Total Price{" "}
                  {sortConfig?.key === "amount" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        size={14}
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      />
                    ))}
                </Th>
                <Th color="white">Linked Order</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredPurchases.map((purchase) => (
                <Tr key={purchase.purchase_id}>
                  <Td>{purchase.purchase_date}</Td>
                  <Td>
                    {purchase.item_type == "Other"
                      ? purchase.custom_item_type
                      : purchase.item_type}
                  </Td>
                  <Td>{purchase.quantity}</Td>
                  <Td>50</Td>
                  <Td>${purchase.amount.toFixed(2)}</Td>
                  <Td>
                    {purchase.order_id
                      ? orders.find(
                          (order) => order.order_id === purchase.order_id
                        )?.customer_name || "Unknown"
                      : "N/A"}
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Edit purchase"
                      icon={<Edit size={18} />}
                      className="edit-btn"
                      size="sm"
                      mr={2}
                      onClick={() => setUpdateModal(true)}
                    />
                    <IconButton
                      aria-label="Delete purchase"
                      icon={<Trash2 size={18} />}
                      className="delete-btn"
                      size="sm"
                      onClick={() => {
                        handleDeleteTapper(purchase.purchase_id);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <p>Total</p>
        </div>

        {
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader textAlign="center">New Purchases</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleAddPurchase}>
                  <FormControl isRequired>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      name="date"
                      value={newPurchase.purchase_date}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Item Type</FormLabel>
                    <Select
                      name="item_type"
                      value={newPurchase.item_type}
                      onChange={handleInputChange}
                      className={styles.input}
                    >
                      <option value="">Item </option>
                      <option value="Bottles">Bottles</option>
                      <option value="Labels">Labels</option>
                      <option value="Other">Other</option>
                    </Select>
                    {newPurchase.item_type === "Other" && (
                      <input
                        type="text"
                        name="custom_item_type"
                        value={newPurchase.custom_item_type}
                        onChange={handleInputChange}
                        placeholder="Enter new category"
                        className={styles.input}
                      />
                    )}
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Quantity</FormLabel>
                    <Input
                      type="number"
                      name="quantity"
                      min={1}
                      max={10000}
                      value={newPurchase.quantity}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Unit Price</FormLabel>
                    <Input
                      type="number"
                      name="amount"
                      min={1}
                      value={newPurchase.amount}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    {newPurchase.item_type === "Bottles" ||
                      (newPurchase.item_type === "Other" && (
                        <>
                          <FormLabel>Linked Order</FormLabel>
                          <Select
                            name="order_id"
                            value={newPurchase.order_id || ""}
                            onChange={handleInputChange}
                            className={styles.input}
                          >
                            <option value="">Select Order (Optional)</option>
                            {orders.map((order) => (
                              <option
                                key={order.order_id}
                                value={order.order_id}
                              >
                                {order.customer_name} - {order.order_date}
                              </option>
                            ))}
                          </Select>
                        </>
                      ))}
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

        {updateModal ? (
          <EditModal
            UpdateFormData={updateFormData}
            setUpdateFormData={setUpdateFormData}
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

export default PurchaseRecordPage;
