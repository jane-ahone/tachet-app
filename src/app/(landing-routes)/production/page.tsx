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
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import EditModal from "@/components/EditModal/editModal";
import CustomCard from "@/components/layout/Card/page";
import { createHandleInputChange } from "@/lib/helpers/tableHelpers";
import {
  Order,
  Tapper,
  FieldConfig,
  ProductionData,
} from "@/lib/types/interface";
import AddNewRecordBtn from "@/components/AddNewRecordBtn/page";
import ScrollToTopButton from "@/components/ScrolltoTop/page";
import { useSharedContext } from "@/app/sharedContext";

interface ProductionEntry extends ProductionData {
  palmwine_id: number;
}

const ProductionPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { sharedData, setSharedData } = useSharedContext();
  const toast = useToast();

  const [formData, setFormData] = useState<ProductionData>({
    date_received: "",
    order_id: 1,
    tapper_id: 1,
    volume_purchased: 1,
    volume_processed: 1,
    tapper_payment_status: "",
  });
  const [formInitialData, setFormInitialData] = useState<ProductionEntry>({
    palmwine_id: 1,
    date_received: "",
    order_id: 1,
    tapper_id: 1,
    volume_purchased: 1,
    volume_processed: 1,
    tapper_payment_status: "",
  });
  const [updateFormData, setUpdateFormData] = useState<ProductionData>({
    date_received: "",
    order_id: 1,
    tapper_id: 1,
    volume_purchased: 1,
    volume_processed: 1,
    tapper_payment_status: "",
  });
  const [tappers, setTappers] = useState<Tapper[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productionsData, setProductionsData] = useState<ProductionEntry[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  const sideItems = [
    {
      route: "Tappers",
      link: "/production/tapper",
      icon: Pickaxe,
      id: "Tappers",
    },
  ];

  const fields: FieldConfig[] = [
    { name: "order_date", label: "Date", type: "date", required: true },
    {
      name: "orders",
      label: "Order",
      type: "select",
      options: orders.map((c) => ({
        value: c.order_id.toString(),
        label: c.customer_name,
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
    //Fetch orders
    if (sharedData?.orders && sharedData?.orders.length > 0) {
      setOrders(sharedData.orders);
    } else {
      (async () => {
        try {
          const response = await fetch("/api/orderCustomer");
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await response.json();

          setOrders(data.orders);
          setSharedData({ ...sharedData, orders: data.orders });
        } catch (error) {
          console.log(error);
          toast({
            title: "Error",
            description: "Failed to fetch orders.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })();
    }
    //Fetch tappers
    if (sharedData?.tappers && sharedData?.tappers.length > 0) {
      setTappers(sharedData.tappers);
    } else {
      (async () => {
        try {
          const response = await fetch("/api/tapper");
          if (!response.ok) {
            throw new Error("Failed to fetch tappers");
          }
          const data = await response.json();
          setTappers(data.tappers);
          setSharedData({ ...sharedData, tappers: data.tappers });
        } catch (error) {
          console.log(error);
          toast({
            title: "Error",
            description: "Failed to fetch tappers.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })();
    }

    // Fetch production data

    if (sharedData?.production) {
      setProductionsData(sharedData.production);
    } else {
      (async () => {
        try {
          const response = await fetch("/api/production");
          if (!response.ok) {
            throw new Error("Failed to fetch production data");
          }
          const data = await response.json();

          setProductionsData(data.production);
          setSharedData({ ...sharedData, production: data.production });
        } catch (error) {
          console.log(error);
          toast({
            title: "Error",
            description: "Failed to fetch production data.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })();
    }
  }, [sharedData, setSharedData, toast]);

  const handleInputChange = createHandleInputChange(setFormData);

  const handleAddProd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/production", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add production data");
      }

      const data = await response.json();
      console.log(`New production entry added: ${data}`);

      const newEntry: ProductionEntry = {
        ...formData,
        palmwine_id: productionsData.length + 1,
      };

      const updatedEntries = [...productionsData, newEntry];
      setProductionsData(updatedEntries);
      setSharedData({ ...sharedData, production: updatedEntries });

      onClose();
      // Reset form
      setFormData({
        date_received: "",
        order_id: 1,
        tapper_id: 1,
        volume_purchased: 1,
        volume_processed: 1,
        tapper_payment_status: "",
      });

      toast({
        title: "Entry added.",
        description: "The Entry has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      toast({
        title: "Error",
        description: "Failed to add entry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/productions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete production entry");
      }

      const data = await response.json();
      console.log(`Production entry successfully deleted: ${data}`);

      const updatedEntries = productionsData.filter(
        (entry) => entry.palmwine_id !== id
      );
      setProductionsData(updatedEntries);
      setSharedData({ ...sharedData, production: updatedEntries });

      toast({
        title: "Entry deleted.",
        description: "The entry has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      toast({
        title: "Error",
        description: "Failed to delete entry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleEditField = (id: number) => {
    productionsData.map((entry) => {
      if (entry.palmwine_id == id) {
        setFormInitialData(entry);
      }
    });
    setUpdateModal(true);
  };
  const handleUpdate = async (e: React.FormEvent) => {
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

      toast({
        title: "Order updated.",
        description: "The order has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      toast({
        title: "Error",
        description: "Failed to uodate order.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdateModal(false);
    }
  };

  const handleSort = (key: keyof ProductionEntry) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = [...productionsData].sort((a, b) => {
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
    const matchesStatus = entry.tapper_payment_status.includes(
      filterStatus.toLowerCase()
    );
    const matchesSearch =
      entry.date_received.includes(searchTerm) ||
      tappers
        .find((t) => t.tapper_id === entry.tapper_id)
        ?.tapper_name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      orders
        .find((o) => o.customer_id === entry.order_id)
        ?.customer_name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      entry.volume_purchased.toString().includes(searchTerm) ||
      entry.tapper_payment_status
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesDateRange =
      (!startDate || entry.date_received >= startDate) &&
      (!endDate || entry.date_received <= endDate);

    return matchesStatus && matchesSearch && matchesDateRange;
  });

  return (
    <div className="page-container-routes">
      <Sidebar title="Production" sideNavitems={sideItems} alignment="top" />

      <Tabs
        size="sm"
        position="relative"
        variant="line"
        align="center"
        defaultIndex={0}
        isFitted
      >
        <TabList bg={"white"} marginY="0.5rem" marginX="1rem">
          <Tab fontWeight={700} padding={4}>
            {" "}
            Collection
          </Tab>
          <Tab fontWeight={700} padding={4}>
            {" "}
            Bottling
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <div className={styles.content}>
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
                    placeholder="Search entries..."
                    className="searchInput"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="filterSelect"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {/* Replace with status options */}
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className={styles.card}>
                <AddNewRecordBtn onOpen={onOpen} />
                <Table variant="simple" className="dataTable">
                  <Thead textAlign="center">
                    <Tr sx={{ backgroundColor: "#32593b" }}>
                      <Th color="white">Order</Th>
                      <Th
                        color="white"
                        onClick={() => handleSort("date_received")}
                      >
                        Date
                        {sortConfig.key === "date_received" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUp
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ) : (
                            <ArrowDown
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ))}
                      </Th>
                      <Th color="white">Tapper</Th>
                      <Th
                        color="white"
                        onClick={() => handleSort("volume_purchased")}
                      >
                        Volume Collected (L)
                        {sortConfig.key === "volume_purchased" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUp
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ) : (
                            <ArrowDown
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ))}
                      </Th>

                      <Th
                        color="white"
                        onClick={() => handleSort("tapper_payment_status")}
                      >
                        Tapper Payment Status
                        {sortConfig.key === "tapper_payment_status" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUp
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ) : (
                            <ArrowDown
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ))}
                      </Th>
                      <Th color="white">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredEntries.map((entry) => (
                      <Tr key={entry.palmwine_id}>
                        <Td>
                          <p>
                            {
                              orders.find((o) => o.order_id === entry.order_id)
                                ?.customer_name
                            }
                          </p>

                          <p>
                            {
                              orders
                                .find((o) => o.order_id === entry.order_id)
                                ?.order_date.split("T")[0]
                            }
                          </p>
                        </Td>
                        <Td padding="2rem">
                          {entry.date_received.split("T")[0]}
                        </Td>

                        <Td>
                          {
                            tappers.find((t) => t.tapper_id === entry.tapper_id)
                              ?.tapper_name
                          }
                        </Td>
                        <Td>{entry.volume_purchased}</Td>

                        <Td>
                          <span
                            className={
                              "status " + `${[entry.tapper_payment_status]}`
                            }
                          >
                            {entry.tapper_payment_status}
                          </span>
                        </Td>

                        <Td>
                          <IconButton
                            aria-label="Edit entry"
                            icon={<Edit size={18} />}
                            className="edit-btn"
                            size="sm"
                            mr={2}
                            onClick={() => handleEditField(entry.palmwine_id)}
                          />
                          <IconButton
                            aria-label="Delete entry"
                            icon={<Trash2 size={18} />}
                            className="delete-btn"
                            size="sm"
                            onClick={() => {
                              handleDelete(entry.palmwine_id);
                            }}
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
                  <ModalHeader textAlign="center">
                    Production Data Input
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form onSubmit={handleAddProd}>
                      <FormControl isRequired>
                        <FormLabel>Date</FormLabel>
                        <Input
                          type="date"
                          name="date_received"
                          value={formData.date_received}
                          onChange={handleInputChange}
                        />
                      </FormControl>

                      <FormControl isRequired mt={4}>
                        <FormLabel>Order</FormLabel>
                        <Select
                          name="order_id"
                          value={formData.order_id}
                          onChange={handleInputChange}
                          placeholder="Select Order"
                        >
                          {orders.map((order) => (
                            <option
                              key={order.customer_id}
                              value={order.customer_id}
                            >
                              {order.customer_name} - {order.order_date}
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
                          name="tapper_id"
                          value={formData.tapper_id}
                          onChange={handleInputChange}
                          placeholder="Select Tapper"
                        >
                          {tappers.map((tapper) => (
                            <option
                              key={tapper.tapper_id}
                              value={tapper.tapper_id}
                            >
                              {tapper.tapper_name}
                            </option>
                          ))}
                        </Select>
                        <Link
                          href="/production/tappers"
                          className={styles.link}
                        >
                          Add New Tapper
                        </Link>
                      </FormControl>

                      <FormControl isRequired mt={4}>
                        <FormLabel>Volume Collected (L)</FormLabel>
                        <Input
                          type="number"
                          name="volume_purchased"
                          value={formData.volume_purchased}
                          onChange={handleInputChange}
                          min="0"
                          step="0.1"
                        />
                      </FormControl>

                      <FormControl isRequired mt={4}>
                        <FormLabel>Payment Status</FormLabel>
                        <Select
                          name="tapper_payment_status"
                          value={formData.tapper_payment_status}
                          onChange={handleInputChange}
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                        </Select>
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
                  setUpdateFormData={setUpdateFormData}
                  UpdateFormData={updateFormData}
                  initialData={formInitialData}
                  fields={fields}
                  updateModal={updateModal}
                  setUpdateModal={setUpdateModal}
                  handleSubmit={handleUpdate}
                />
              ) : null}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={styles.content}>
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
                    placeholder="Search entries..."
                    className="searchInput"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="filterSelect"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className={styles.card}>
                <AddNewRecordBtn onOpen={onOpen} />
                <Table variant="simple" className="dataTable">
                  <Thead>
                    <Tr sx={{ backgroundColor: "#32593b" }}>
                      <Th color="white">Order</Th>
                      <Th
                        color="white"
                        onClick={() => handleSort("date_received")}
                      >
                        Date
                        {sortConfig.key === "date_received" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUp
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ) : (
                            <ArrowDown
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ))}
                      </Th>

                      <Th color="white">TVC( L )</Th>
                      <Th
                        color="white"
                        onClick={() => handleSort("volume_purchased")}
                      >
                        {" "}
                        TVP( L )
                        {sortConfig.key === "volume_purchased" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUp
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ) : (
                            <ArrowDown
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ))}
                      </Th>

                      <Th
                        color="white"
                        onClick={() => handleSort("tapper_payment_status")}
                      >
                        NVP( L )
                        {sortConfig.key === "tapper_payment_status" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUp
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ) : (
                            <ArrowDown
                              style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                              }}
                              size={14}
                            />
                          ))}
                      </Th>
                      <Th color="white">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredEntries.map((entry) => (
                      <Tr key={entry.palmwine_id}>
                        <Td paddingX="0.5rem">
                          <p>
                            {
                              orders.find((o) => o.order_id === entry.order_id)
                                ?.customer_name
                            }
                          </p>

                          <p>
                            {
                              orders
                                .find((o) => o.order_id === entry.order_id)
                                ?.order_date.split("T")[0]
                            }
                          </p>
                        </Td>
                        <Td>{entry.date_received.split("T")[0]}</Td>
                        <Td>300</Td>
                        <Td>{entry.volume_purchased}</Td>

                        <Td>
                          <span
                            className={
                              "status " + `${[entry.tapper_payment_status]}`
                            }
                          >
                            {entry.tapper_payment_status}
                          </span>
                        </Td>

                        <Td>
                          <IconButton
                            aria-label="Edit entry"
                            icon={<Edit size={18} />}
                            className="edit-btn"
                            size="sm"
                            mr={2}
                            onClick={() => handleEditField(entry.palmwine_id)}
                          />
                          <IconButton
                            aria-label="Delete entry"
                            icon={<Trash2 size={18} />}
                            className="delete-btn"
                            size="sm"
                            onClick={() => {
                              handleDelete(entry.palmwine_id);
                            }}
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
                  <ModalHeader textAlign="center">
                    Production Data Input
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form onSubmit={handleAddProd}>
                      <FormControl isRequired>
                        <FormLabel>Date</FormLabel>
                        <Input
                          type="date"
                          name="date"
                          value={formData.date_received}
                          onChange={handleInputChange}
                        />
                      </FormControl>

                      <FormControl isRequired mt={4}>
                        <FormLabel>Order</FormLabel>
                        <Select
                          name="orderId"
                          value={formData.order_id}
                          onChange={handleInputChange}
                          placeholder="Select Order"
                        >
                          {orders.map((order) => (
                            <option
                              key={order.customer_id}
                              value={order.customer_id}
                            >
                              {order.customer_name} - {order.order_date}
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
                          value={formData.tapper_id}
                          onChange={handleInputChange}
                          placeholder="Select Tapper"
                        >
                          {tappers.map((tapper) => (
                            <option
                              key={tapper.tapper_id}
                              value={tapper.tapper_id}
                            >
                              {tapper.tapper_name}
                            </option>
                          ))}
                        </Select>
                        <Link
                          href="/production/tappers"
                          className={styles.link}
                        >
                          Add New Tapper
                        </Link>
                      </FormControl>

                      <FormControl isRequired mt={4}>
                        <FormLabel>Volume Collected (L)</FormLabel>
                        <Input
                          type="number"
                          name="volumeCollected"
                          value={formData.volume_purchased}
                          onChange={handleInputChange}
                          min="0"
                          step="0.1"
                        />
                      </FormControl>

                      <FormControl isRequired mt={4}>
                        <FormLabel>Payment Status</FormLabel>
                        <Select
                          name="tapperPaymentStatus"
                          value={formData.tapper_payment_status}
                          onChange={handleInputChange}
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                        </Select>
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
                  setUpdateFormData={setUpdateFormData}
                  UpdateFormData={updateFormData}
                  updateModal={updateModal}
                  setUpdateModal={setUpdateModal}
                  handleSubmit={handleUpdate}
                />
              ) : null}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ProductionPage;
