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
import { useSharedContext } from "@/app/SharedContext";

const PurchaseRecordPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newPurchase, setNewPurchase] = useState<Omit<Purchase, "id">>({
    date: "",
    itemType: "",
    quantity: 0,
    price: 0,
    customItemType: "",
    orderId: undefined,
  });
  const [formInitialData, setFormInitialData] = useState<Order>({
    id: 1,
    customerName: "John Doe",
    customerId: 2,
    orderQty: 1,
    orderDate: new Date().toISOString().split("T")[0],
    status: "Pending",
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
      name: "itemType",
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

  const { sharedData, setSharedData } = useSharedContext();

  useEffect(() => {
    // Fetch purchases data
    (async () => {
      if (sharedData?.purchases) {
        setPurchases(sharedData?.purchases);
      } else {
        try {
          const response = await fetch("/api/purchase");
          if (!response.ok) {
            throw new Error("Failed to fetch purchases");
          }
          const data = await response.json();
          console.log(data.purchase);
          setPurchases(data.purchase);
          setSharedData((prevData) => ({
            ...prevData,
            purchases: data.purchase,
          }));
        } catch (error) {
          console.error(error);
          setPurchases([
            {
              id: 1,
              date: "2023-09-01",
              itemType: "Bottles",
              quantity: 1000,
              price: 500,
              orderId: 1,
            },
            {
              id: 2,
              date: "2023-09-15",
              itemType: "Labels",
              quantity: 5000,
              price: 250,
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
              id: 1,
              customerId: 2,
              customerName: "Customer A",
              orderDate: "2024-09-01",
              status: "Progress",
              orderQty: 1,
            },
            {
              id: 2,
              customerId: 3,
              customerName: "Customer B",
              orderDate: "2024-09-02",
              status: "Progress",
              orderQty: 1,
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
          : name === "orderId"
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
      date: "",
      itemType: "",
      quantity: 0,
      price: 0,
      orderId: undefined,
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
        ? prevData.purchases.filter((purchase: Purchase) => purchase.id !== id)
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

  const filteredPurchases = sortedPurchases.filter(
    (purchase) =>
      purchase.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.date.includes(searchTerm) ||
      orders
        .find((order) => order.id === purchase.orderId)
        ?.customerName.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ((!startDate || purchase.date >= startDate) &&
        (!endDate || purchase.date <= endDate))
  );

  return (
    <div className="page-container-routes">
      <Sidebar title="Purchases" alignment="top" sideNavitems={sideItems} />
      <div className={styles.contentContainer}>
        <div className={styles.actionBar}>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="searchInput"
            />
          </div>
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
          <select
            className="filterSelect"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="bottles">Bottles</option>
            <option value="labels">Labels</option>
          </select>
        </div>

        {/* {isAdding && (
          <div className={styles.addForm}>
            <div className="dateField">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                name="date"
                value={newPurchase.date}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className="itemTypeField">
              <label htmlFor="itemType">Select Item Type</label>
              <select
                name="itemType"
                value={newPurchase.itemType}
                onChange={handleInputChange}
                className={styles.input}
                required
              >
                <option value="">Item </option>
                <option value="Bottles">Bottles</option>
                <option value="Labels">Labels</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="quantityField">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={newPurchase.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className={styles.input}
                required
              />
            </div>
            <div className="priceField">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                value={newPurchase.price}
                onChange={handleInputChange}
                placeholder="Total Price"
                className={styles.input}
                required
              />
            </div>
            {newPurchase.itemType === "Bottles" && (
              <select
                name="orderId"
                value={newPurchase.orderId || ""}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="">Select Order (Optional)</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.customerName} - {order.orderDate}
                  </option>
                ))}
              </select>
            )}
            <button onClick={handleAddPurchase} className={styles.saveButton}>
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        )} */}

        <div className={styles.purchaseList}>
          <AddNewRecordBtn onOpen={onOpen} />
          <Table variant="simple" className="dataTable">
            <Thead sx={{ backgroundColor: "#32593b" }}>
              <Tr>
                <Th color="white" onClick={() => handleSort("date")}>
                  Date{" "}
                  {sortConfig?.key === "date" &&
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
                <Th color="white" onClick={() => handleSort("itemType")}>
                  Item Type{" "}
                  {sortConfig?.key === "itemType" &&
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
                  Quantity{" "}
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
                <Th color="white" onClick={() => handleSort("price")}>
                  Total Price{" "}
                  {sortConfig?.key === "price" &&
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
                <Tr key={purchase.id}>
                  <Td>{purchase.date}</Td>
                  <Td>
                    {purchase.itemType == "Other"
                      ? purchase.customItemType
                      : purchase.itemType}
                  </Td>
                  <Td>{purchase.quantity}</Td>
                  <Td>${purchase.price.toFixed(2)}</Td>
                  <Td>
                    {purchase.orderId
                      ? orders.find((order) => order.id === purchase.orderId)
                          ?.customerName || "Unknown"
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
                        handleDeleteTapper(purchase.id);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
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
                      value={newPurchase.date}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Item Type</FormLabel>
                    <Select
                      name="itemType"
                      value={newPurchase.itemType}
                      onChange={handleInputChange}
                      className={styles.input}
                    >
                      <option value="">Item </option>
                      <option value="Bottles">Bottles</option>
                      <option value="Labels">Labels</option>
                      <option value="Other">Other</option>
                    </Select>
                    {newPurchase.itemType === "Other" && (
                      <input
                        type="text"
                        name="customItemType"
                        value={newPurchase.customItemType}
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
                      name="price"
                      min={1}
                      value={newPurchase.price}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    {newPurchase.itemType === "Bottles" ||
                      (newPurchase.itemType === "Other" && (
                        <>
                          <FormLabel>Linked Order</FormLabel>
                          <Select
                            name="orderId"
                            value={newPurchase.orderId || ""}
                            onChange={handleInputChange}
                            className={styles.input}
                          >
                            <option value="">Select Order (Optional)</option>
                            {orders.map((order) => (
                              <option key={order.id} value={order.id}>
                                {order.customerName} - {order.orderDate}
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
