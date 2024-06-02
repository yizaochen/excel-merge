import React from "react";

function OrderTable({ orders }) {
  return (
    <table>
      <thead>
        <tr>Order Table</tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>{/* Table row */}</tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderTable;
