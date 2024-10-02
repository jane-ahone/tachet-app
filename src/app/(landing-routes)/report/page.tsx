"use client";

import Sidebar from "@/components/layout/Sidebar/page";
import React from "react";

const Report = () => {
  return (
    <div>
      <Sidebar alignment="top" title="Reports" />
      <h1>Daily/Weekly/Monthly</h1>
      <h1>Orders</h1>

      <p>Total Number of Orders</p>
      <p>Orders in progress vs Pending Orders</p>
      <p>Number of Orders per Customer</p>
      <p>Largest Order</p>
      <p>Smallest Order</p>
      <p>Pending Orders, Cancelled Orders, Completed Orders</p>
      <h2>Production</h2>
      <p>Volume Collected</p>
      <p>Volume collcetd per tapper</p>
      <p>Pending vs Completed tapper payments</p>
      <p>Volume Collected per tapper per order</p>
      <p>Total actual volume Collected</p>
      <p>Processed palm wine vs unprocessed</p>
      <h2>Purchases</h2>
      <p>Total bottles purchased</p>
      <p>Labels purchased</p>
    </div>
  );
};

export default Report;
