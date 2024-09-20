"use client";

import { useState, useEffect } from "react";
import styles from "./production.module.css";
import Sidebar from "@/components/layout/Sidebar/page";
import {
  Pickaxe,
  ArrowDown,
  ArrowUp,
  PlusCircle,
  Save,
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
  Textarea,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
import AddNewRecordBtn from "@/components/AddNewRecordBtn/page";
import ScrollToTopButton from "@/components/ScrolltoTop/page";

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

  const fields: FieldConfig[] = [
    { name: "orderDate", label: "Date", type: "date", required: true },
    {
      name: "orders",
      label: "Order",
      type: "select",
      options: orders.map((c) => ({
        value: c.id.toString(),
        label: c.customerName,
      })),
      required: true,
    },
    {
      name: "tappers",
      label: "Tapper",
      type: "select",
      options: tappers.map((c) => ({
        value: c.tapper_id.toString(),
        label: c.tapper_name,
      })),
      required: true,
    },
    {
      name: "volume collected",
      label: "Volume Collected",
      type: "number",
      required: true,
    },
    {
      name: "volume paid for",
      label: "Volume Paid For",
      type: "number",
      required: true,
    },

    {
      name: "status",
      label: "Payment Status",
      type: "select",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
      ],
      required: true,
    },
  ];

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
    <div className="page-container-routes">
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

        {/* <div className="cardSummary">
          <CustomCard
            title="Completed"
            data="15,000L"
            icon={<Warehouse color="white" />}
          />
          <CustomCard
            title="Pending"
            data="15,000L"
            icon={<Warehouse color="white" />}
          />
        </div> */}

        <div className={styles.card}>
          <AddNewRecordBtn onOpen={onOpen} />
          <Table variant="simple" className="dataTable">
            <Thead>
              <Tr sx={{ backgroundColor: "#32593b" }}>
                <Th color="white" onClick={() => handleSort("date")}>
                  Date
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                        size={14}
                      />
                    ) : (
                      <ArrowDown
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                        size={14}
                      />
                    ))}
                </Th>
                <Th color="white">Order</Th>
                <Th color="white">Tapper</Th>
                <Th color="white" onClick={() => handleSort("volumeCollected")}>
                  Volume Collected (L)
                  {sortConfig.key === "volumeCollected" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                        size={14}
                      />
                    ) : (
                      <ArrowDown
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                        size={14}
                      />
                    ))}
                </Th>
                <Th color="white" onClick={() => handleSort("volumePaidFor")}>
                  Volume Paid For (L)
                  {sortConfig.key === "volumePaidFor" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                        size={14}
                      />
                    ) : (
                      <ArrowDown
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                        size={14}
                      />
                    ))}
                </Th>
                <Th color="white" onClick={() => handleSort("paymentStatus")}>
                  Payment Status
                  {sortConfig.key === "paymentStatus" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUp
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                        size={14}
                      />
                    ) : (
                      <ArrowDown
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                        size={14}
                      />
                    ))}
                </Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEntries.map((entry) => (
                <Tr key={entry.id}>
                  <Td>{entry.date}</Td>
                  <Td>
                    {
                      orders.find((o) => o.id.toString() === entry.orderId)
                        ?.customerName
                    }
                  </Td>
                  <Td>
                    {
                      tappers.find(
                        (t) => t.tapper_id.toString() === entry.tapperId
                      )?.tapper_name
                    }
                  </Td>
                  <Td>{entry.volumeCollected}</Td>
                  <Td>{entry.volumePaidFor}</Td>
                  <Td>
                    <span className={"status " + `${[entry.paymentStatus]}`}>
                      {entry.paymentStatus}
                    </span>
                  </Td>

                  <Td>
                    <IconButton
                      aria-label="Edit entry"
                      icon={<Edit size={18} />}
                      className="edit-btn"
                      size="sm"
                      mr={2}
                      onClick={() => setUpdateModal(true)}
                    />
                    <IconButton
                      aria-label="Delete entry"
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

                <Button mt={6} colorScheme="green" type="submit">
                  <Save size={18} style={{ marginRight: "0.5rem" }} />
                  Save Production Data
                </Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        <ScrollToTopButton />

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
