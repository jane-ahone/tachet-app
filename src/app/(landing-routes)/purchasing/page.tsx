"use client";

import React, { useState, useEffect } from "react";
import styles from "./purchasing.module.css";
import {
  PlusCircle,
  Search,
  LogOut,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar/page";

interface Purchase {
  id: number;
  date: string;
  itemType: string;
  quantity: number;
  price: number;
  orderId?: number; // Optional because not all purchases (e.g., labels) are linked to orders
}

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
}

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
      { id: 1, customerName: "John Doe", orderDate: "2023-08-30" },
      { id: 2, customerName: "Jane Smith", orderDate: "2023-09-10" },
    ]);
  }, []);

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
    if (sortConfig !== null) {
      sortablePurchases.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
        <h1 className={styles.title}>Purchase Records</h1>
        <div className={styles.actionBar}>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            className={styles.addButton}
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle size={20} />
            Record New Purchase
          </button>
        </div>

        {isAdding && (
          <div className={styles.addForm}>
            <input
              type="date"
              name="date"
              value={newPurchase.date}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
            <select
              name="itemType"
              value={newPurchase.itemType}
              onChange={handleInputChange}
              className={styles.input}
              required
            >
              <option value="">Select Item Type</option>
              <option value="Bottles">Bottles</option>
              <option value="Labels">Labels</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              name="quantity"
              value={newPurchase.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className={styles.input}
              required
            />
            <input
              type="number"
              name="price"
              value={newPurchase.price}
              onChange={handleInputChange}
              placeholder="Total Price"
              className={styles.input}
              required
            />
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
          <table className={styles.purchaseTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort("date")}>
                  Date{" "}
                  {sortConfig?.key === "date" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    ))}
                </th>
                <th onClick={() => handleSort("itemType")}>
                  Item Type{" "}
                  {sortConfig?.key === "itemType" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    ))}
                </th>
                <th onClick={() => handleSort("quantity")}>
                  Quantity{" "}
                  {sortConfig?.key === "quantity" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    ))}
                </th>
                <th onClick={() => handleSort("price")}>
                  Total Price{" "}
                  {sortConfig?.key === "price" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    ))}
                </th>
                <th>Linked Order</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.date}</td>
                  <td>{purchase.itemType}</td>
                  <td>{purchase.quantity}</td>
                  <td>${purchase.price.toFixed(2)}</td>
                  <td>
                    {purchase.orderId
                      ? orders.find((order) => order.id === purchase.orderId)
                          ?.customerName || "Unknown"
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRecordPage;
