import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

function EditModal({ show, data, onChange, onSave, onClose }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {[
            { label: "Order Number", field: "orderNumber" },
            { label: "Order Date", field: "orderDate" },
            { label: "Customer Name", field: "customerName" },
            { label: "Phone Number", field: "phoneNumber" },
            { label: "Email", field: "email" },
            { label: "Product ID", field: "productID" },
            { label: "Product Name", field: "productName" },
            { label: "Quantity", field: "quantity" },
            { label: "Product Type", field: "productType" },
            { label: "Delivery Method", field: "deliveryMethod" },
            { label: "Batch ID", field: "batchID" },
          ].map(({ label, field }) => (
            <Form.Group className="mb-3" controlId={`editForm-${field}`} key={field}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type="text"
                value={data[field]}
                onChange={(e) => onChange(field, e.target.value)}
              />
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
