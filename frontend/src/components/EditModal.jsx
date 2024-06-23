import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";

function EditModal({ show, data, onChange, onSave, onClose }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {[
            { label: "Order Number", field: "OrderNumber" },
            { label: "Order Date", field: "OrderDate" },
            { label: "Customer Name", field: "CustomerName" },
            { label: "Phone Number", field: "PhoneNumber" },
            { label: "Email", field: "Email" },
            { label: "Product ID", field: "ProductID" },
            { label: "Product Name", field: "ProductName" },
            { label: "Quantity", field: "Quantity" },
            { label: "Product Type", field: "ProductType" },
            { label: "Delivery Method", field: "DeliveryMethod" },
            { label: "Batch ID", field: "BatchID" },
          ].map(({ label, field }) => (
            <Form.Group
              className="mb-3"
              controlId={`editForm-${field}`}
              key={field}
            >
              <Form.Label>{label}</Form.Label>
              {field === "OrderDate" ? (
                <div className="d-flex">
                  <DatePicker
                    selected={new Date(data[field])}
                    onChange={(date) => onChange(field, date)}
                    className="form-control"
                  />
                </div>
              ) : (
                <Form.Control
                  type="text"
                  value={data[field] || ""}
                  onChange={(e) => onChange(field, e.target.value)}
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditModal;
