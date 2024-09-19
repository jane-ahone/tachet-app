"use client";

import { useState, useEffect } from "react";
import styles from "./production.module.css";
import Sidebar from "@/components/layout/Sidebar/page";
import {
  LogOut,
  Pickaxe,
  ArrowDown,
  ArrowUp,
  PlusCircle,
  Save,
  Edit,
  Trash2,
  Warehouse,
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
  Textarea,
} from "@chakra-ui/react";
import Link from "next/link";
import EditModal from "@/components/EditModal/editModal";
import CustomCard from "@/components/layout/Card/page";
import { createHandleInputChange } from "@/lib/helpers/tableHelpers";
import {
  Order,
  ProductionData,
  Tapper,
  FieldConfig,
} from "@/lib/types/interface";

interface ProductionEntry extends ProductionData {
  id: number;
}

const ProductionPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sideItems = [
    {
      route: "Tappers",
      link: "/production/tapper",
      icon: Pickaxe,
      id: "Tappers",
    },
    {
      route: "Sign Out",
      link: "/logout",
      icon: LogOut,
      id: "logout",
    },
  ];

  const [productionData, setProductionData] = useState<ProductionData>({
    date: "",
    orderId: "",
    tapperId: "",
    volumeCollected: "",
    volumePaidFor: "",
    paymentStatus: "",
    notes: "",
  });

  const fields: FieldConfig[] = [
    { name: "orderDate", label: "Date", type: "date", required: true },
    // {
    //   // name: "customerId",
    //   // label: "Customer",
    //   // type: "select",
    //   // options: customers.map((c) => ({
    //   //   value: c.id.toString(),
    //   //   label: c.customerName,
    //   // })),
    //   required: true,
    // },
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
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
      ],
      required: true,
    },
  ];

  const [formInitialData, setFormInitialData] = useState<Order>({
    id: 1,
    customerId: 1,
    customerName: "John Doe",
    orderQty: 1,
    orderDate: new Date().toISOString().split("T")[0],
    status: "Pending",
  });

  const [tappers, setTappers] = useState<Tapper[]>([
    {
      tapper_id: 1,
      tapper_name: "John Doe",
      phone_number: "123-456-7890",
      email: "johndoe@example.com",
      home_address: "123 Main St, Anytown, USA",
      joiningDate: "2024-01-01",
    },
    {
      tapper_id: 1,
      tapper_name: "John Doe",
      phone_number: "123-456-7890",
      email: "johndoe@example.com",
      home_address: "123 Main St, Anytown, USA",
      joiningDate: "2024-01-01",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
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

  const [previousEntries, setPreviousEntries] = useState<ProductionEntry[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  useEffect(() => {
    // Fetch previous entries, tappers, and orders from API
    // For now, we'll use dummy data
    setPreviousEntries([
      {
        id: 1,
        date: "2024-09-01",
        orderId: "1",
        tapperId: "1",
        volumeCollected: "100",
        volumePaidFor: "90",
        paymentStatus: "completed",
        notes: "First batch",
      },
      {
        id: 2,
        date: "2024-09-02",
        orderId: "2",
        tapperId: "2",
        volumeCollected: "150",
        volumePaidFor: "150",
        paymentStatus: "pending",
        notes: "Second batch",
      },
    ]);
  }, []);

  const handleInputChange = createHandleInputChange(setProductionData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted production data:", productionData);
    // Here you would typically send this data to your API
    // After successful submission:
    const newEntry: ProductionEntry = {
      ...productionData,
      id: previousEntries.length + 1,
    };
    setPreviousEntries((prev) => [...prev, newEntry]);
    onClose();
    // Reset form
    setProductionData({
      date: "",
      orderId: "",
      tapperId: "",
      volumeCollected: "",
      volumePaidFor: "",
      paymentStatus: "",
      notes: "",
    });
  };

  const handleSort = (key: keyof ProductionEntry) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = [...previousEntries].sort((a, b) => {
    if (
      a[sortConfig.key as keyof ProductionEntry] <
      b[sortConfig.key as keyof ProductionEntry]
    ) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (
      a[sortConfig.key as keyof ProductionEntry] >
      b[sortConfig.key as keyof ProductionEntry]
    ) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredEntries = sortedEntries.filter((entry) => {
    const matchesStatus = entry.paymentStatus
      .toLowerCase()
      .includes(filterStatus.toLowerCase());
    const matchesSearch =
      entry.date.includes(searchTerm) ||
      tappers
        .find((t) => t.tapper_id.toString() === entry.tapperId)
        ?.tapper_name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      orders
        .find((o) => o.id.toString() === entry.orderId)
        ?.customerName.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      entry.volumeCollected.includes(searchTerm) ||
      entry.volumePaidFor.includes(searchTerm) ||
      entry.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange =
      (!startDate || entry.date >= startDate) &&
      (!endDate || entry.date <= endDate);

    return matchesStatus && matchesSearch && matchesDateRange;
  });

  return (
    <div className={styles.container}>
      <Sidebar title="Production" sideNavitems={sideItems} alignment="top" />

      <div className={styles.content}>
        <div className={styles.actions}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search entries..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.dateFilterContainer}>
            <input
              type="date"
              className={styles.dateInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <span className={styles.dateRangeSeparator}>to</span>
            <input
              type="date"
              className={styles.dateInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className={styles.cardDiv}>
          <CustomCard
            title="Current Inventory"
            data="15,000L"
            icon={<Warehouse color="white" />}
          />
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th onClick={() => handleSort("date")}>
                  Date
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        size={14}
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      />
                    ))}
                </th>
                <th>Order</th>
                <th>Tapper</th>
                <th onClick={() => handleSort("volumeCollected")}>
                  Volume Collected (L)
                  {sortConfig.key === "volumeCollected" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        size={14}
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      />
                    ))}
                </th>
                <th onClick={() => handleSort("volumePaidFor")}>
                  Volume Paid For (L)
                  {sortConfig.key === "volumePaidFor" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        size={14}
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      />
                    ))}
                </th>
                <th onClick={() => handleSort("paymentStatus")}>
                  Payment Status
                  {sortConfig.key === "paymentStatus" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        size={14}
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      />
                    ))}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>
                    {
                      orders.find((o) => o.id.toString() === entry.orderId)
                        ?.customerName
                    }
                  </td>
                  <td>
                    {
                      tappers.find(
                        (t) => t.tapper_id.toString() === entry.tapperId
                      )?.tapper_name
                    }
                  </td>
                  <td>{entry.volumeCollected}</td>
                  <td>{entry.volumePaidFor}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[entry.paymentStatus]
                      }`}
                    >
                      {entry.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className="edit-btn">
                        <Edit
                          size={18}
                          onClick={() => {
                            setUpdateModal(true);
                          }}
                        />
                      </button>
                      <button className="delete-btn" onClick={() => {}}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.addButton} onClick={onOpen}>
            <PlusCircle size={20} />
            Add New Entry
          </button>
        </div>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">Production Data Input</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={productionData.date}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Order</FormLabel>
                  <Select
                    name="orderId"
                    value={productionData.orderId}
                    onChange={handleInputChange}
                    placeholder="Select Order"
                  >
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.customerName} - {order.orderDate}
                      </option>
                    ))}
                  </Select>
                  <Link href="/orders" className={styles.link}>
                    Create New Order
                  </Link>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Tapper</FormLabel>
                  <Select
                    name="tapperId"
                    value={productionData.tapperId}
                    onChange={handleInputChange}
                    placeholder="Select Tapper"
                  >
                    {tappers.map((tapper) => (
                      <option key={tapper.tapper_id} value={tapper.tapper_id}>
                        {tapper.tapper_name}
                      </option>
                    ))}
                  </Select>
                  <Link href="/production/tappers" className={styles.link}>
                    Add New Tapper
                  </Link>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Volume Collected (L)</FormLabel>
                  <Input
                    type="number"
                    name="volumeCollected"
                    value={productionData.volumeCollected}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Volume Paid For (L)</FormLabel>
                  <Input
                    type="number"
                    name="volumePaidFor"
                    value={productionData.volumePaidFor}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Payment Status</FormLabel>
                  <Select
                    name="paymentStatus"
                    value={productionData.paymentStatus}
                    onChange={handleInputChange}
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </Select>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Additional Notes</FormLabel>
                  <Textarea
                    name="notes"
                    value={productionData.notes}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </FormControl>

                <Button mt={6} colorScheme="blue" type="submit">
                  <Save size={18} style={{ marginRight: "0.5rem" }} />
                  Save Production Data
                </Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
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

export default ProductionPage;
