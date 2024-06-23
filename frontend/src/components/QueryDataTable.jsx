import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

function QueryDataTable({ data, handleUpdate, handleDelete }) {
  const isEmpty = data.length === 0;

  if (isEmpty) {
    return null;
  }

  return (
    <Table className="my-5" striped bordered hover>
      <thead>
        <tr>
          <th>Order Number</th>
          <th>Order Date</th>
          <th>Customer Name</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Delivery Method</th>
          <th>Batch ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((record) => (
          <tr key={record.OrderID}>
            <td>{record.OrderNumber}</td>
            <td>{record.OrderDate}</td>
            <td>{record.CustomerName}</td>
            <td>{record.PhoneNumber}</td>
            <td>{record.Email}</td>
            <td>{record.ProductID}</td>
            <td>{record.ProductName}</td>
            <td>{record.Quantity}</td>
            <td>{record.DeliveryMethod}</td>
            <td>{record.BatchID}</td>
            <td>
              <div className="d-flex flex-column">
                <Button
                  variant="warning"
                  className="mb-2"
                  onClick={() => handleUpdate(record)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button variant="danger" onClick={() => handleDelete(record)}>
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default QueryDataTable;
