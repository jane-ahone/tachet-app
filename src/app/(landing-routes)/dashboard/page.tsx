"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wine, Truck, Warehouse, Grape, Tag } from "lucide-react";

const sampleData = [
  { month: "Jan", production: 4000, sales: 2400, inventory: 2000 },
  { month: "Feb", production: 3000, sales: 1398, inventory: 2300 },
  { month: "Mar", production: 2000, sales: 9800, inventory: 2200 },
  { month: "Apr", production: 2780, sales: 3908, inventory: 2000 },
  { month: "May", production: 1890, sales: 4800, inventory: 2181 },
  { month: "Jun", production: 2390, sales: 3800, inventory: 2500 },
];

const MetricCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const DataInputForm = ({ title, fields, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <Select
                  onValueChange={(value) =>
                    handleChange({ target: { name: field.name, value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  onChange={handleChange}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const PalmWineDashboard = () => {
  const handleProductionSubmit = (data) => {
    console.log("Production data submitted:", data);
    // Here you would typically send this data to your backend
  };

  const handlePurchaseSubmit = (data) => {
    console.log("Purchase data submitted:", data);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Palm Wine Production Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard title="Total Production" value="15,000 L" icon={Wine} />
        <MetricCard title="Total Sales" value="12,500 L" icon={Truck} />
        <MetricCard
          title="Current Inventory"
          value="2,500 L"
          icon={Warehouse}
        />
        <MetricCard title="Active Tappers" value="25" icon={Grape} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production Input</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Input</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Production Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="production" fill="#8884d8" name="Production" />
                  <Bar dataKey="sales" fill="#82ca9d" name="Sales" />
                  <Bar dataKey="inventory" fill="#ffc658" name="Inventory" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production">
          <DataInputForm
            title="Input Production Data"
            fields={[
              {
                name: "date_received",
                label: "Date Received",
                type: "date",
                required: true,
              },
              {
                name: "tapper_id",
                label: "Tapper",
                type: "select",
                required: true,
                options: [
                  { value: "1", label: "Tapper 1" },
                  { value: "2", label: "Tapper 2" },
                  // Add more tappers as needed
                ],
              },
              {
                name: "volume_purchased",
                label: "Volume Purchased (L)",
                type: "number",
                required: true,
              },
              {
                name: "purchase_price",
                label: "Purchase Price",
                type: "number",
                required: true,
              },
              {
                name: "processing_status",
                label: "Processing Status",
                type: "select",
                required: true,
                options: [
                  { value: "not begun", label: "Not Begun" },
                  { value: "in progress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                  { value: "paused", label: "Paused" },
                  { value: "cancelled", label: "Cancelled" },
                ],
              },
            ]}
            onSubmit={handleProductionSubmit}
          />
        </TabsContent>

        <TabsContent value="purchase">
          <DataInputForm
            title="Input Purchase Data"
            fields={[
              {
                name: "purchase_date",
                label: "Purchase Date",
                type: "date",
                required: true,
              },
              {
                name: "purchase_type",
                label: "Purchase Type",
                type: "select",
                required: true,
                options: [
                  { value: "bottle", label: "Bottle" },
                  { value: "label", label: "Label" },
                ],
              },
              {
                name: "purchase_qty",
                label: "Quantity",
                type: "number",
                required: true,
              },
              {
                name: "purchase_price",
                label: "Total Price",
                type: "number",
                required: true,
              },
            ]}
            onSubmit={handlePurchaseSubmit}
          />
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button>Production Report</Button>
                <Button>Sales Report</Button>
                <Button>Inventory Report</Button>
                <Button>Tapper Performance Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PalmWineDashboard;
