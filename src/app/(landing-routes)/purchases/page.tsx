"use client";

import React, { useState, useEffect } from "react";
import styles from "./purchases.module.css";
import {
  PlusCircle,
  LogOut,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
} from "lucide-react";
import EditModal from "@/components/EditModal/editModal";
import { Order, Purchase, FieldConfig } from "@/lib/types/interface";
import Sidebar from "@/components/layout/Sidebar/page";
import { Table, Thead, Tr, Th, Tbody, Td, IconButton } from "@chakra-ui/react";

const PurchaseRecordPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newPurchase, setNewPurchase] = useState<Omit<Purchase, "id">>({
    date: "",
    itemType: "",
    quantity: 0,
    price: 0,
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
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    {
      route: "Sign Out",
      link: "/logout",
      icon: LogOut,
      id: "logout",
    },
  ];

  const fields: FieldConfig[] = [
    { name: "purchaseDate", label: "Date", type: "date", required: true },
    {
      name: "itemType",
      label: "Item Type",
      type: "select",
      options: [
        { value: "Bottles", label: "Bottles" },
        { value: "Labels", label: "Labels" },
        { value: "Completed", label: "Completed" },
      ],
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
      label: "Production Status",
      type: "select",
      options: [
        { value: "John Doe", label: "John Doe" },
        { value: "N/A", label: "N/A" },
      ],
      required: true,
    },
  ];

  useEffect(() => {
    // Fetch purchases data from API
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

    // Fetch orders data from API
    setOrders([
      {
        id: 1,
        customerName: "John Doe",
        customerId: 2,
        orderDate: "2023-08-30",
        status: "John Doe",
        orderQty: 1,
      },
      {
        id: 2,
        customerName: "Jane Smith",
        customerId: 2,
        orderDate: "2023-09-10",
        status: "Pending",
        orderQty: 1,
      },
    ]);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
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

  const handleAddPurchase = () => {
    // In a real application, you would send this data to your API
    const purchase = { id: purchases.length + 1, ...newPurchase };
    setPurchases((prev) => [...prev, purchase]);
    setNewPurchase({
      date: "",
      itemType: "",
      quantity: 0,
      price: 0,
      orderId: undefined,
    });
    setIsAdding(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <Sidebar title="Purchases" alignment="top" sideNavitems={sideItems} />
      <div className={styles.contentContainer}>
        <div className={styles.actionBar}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {isAdding && (
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
        )}

        <div className={styles.purchaseList}>
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
                  <Td>{purchase.itemType}</Td>
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
                      onClick={() => {}}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>

        <div className="new-tb-entry-btn-div">
          <button
            className="new-tb-entry-btn"
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle size={16} />
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

export default PurchaseRecordPage;
