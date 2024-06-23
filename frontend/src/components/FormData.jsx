import React from "react";
import { Form, Button } from "react-bootstrap";
import DateRangePicker from "./DateRangePicker";

function FormData({
  batchID,
  setBatchID,
  orderNumber,
  setOrderNumber,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  customerName,
  setCustomerName,
  productName,
  setProductName,
  handleFieldButtonClick,
  handleSearch,
  handleReset,
}) {
  return (
    <Form>
      {[
        {
          label: "批次號碼",
          value: batchID,
          setter: setBatchID,
          field: "batchID",
        },
        {
          label: "訂單號碼",
          value: orderNumber,
          setter: setOrderNumber,
          field: "orderNumber",
        },
        {
          label: "客戶名稱",
          value: customerName,
          setter: setCustomerName,
          field: "customerName",
        },
        {
          label: "產品名稱",
          value: productName,
          setter: setProductName,
          field: "productName",
        },
      ].map(({ label, value, setter, field }) => (
        <Form.Group
          className="my-3"
          controlId={`queryForm-${field}`}
          key={field}
        >
          <Form.Label>{label}</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="text"
              value={value}
              onChange={(e) => setter(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={() => handleFieldButtonClick(field)}
              className="ms-2"
            >
              Find
            </Button>
          </div>
        </Form.Group>
      ))}
      <DateRangePicker
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <Button variant="primary" className="my-3" onClick={handleSearch}>
        Search
      </Button>
      <Button variant="secondary" className="my-3 ms-2" onClick={handleReset}>
        Reset
      </Button>
    </Form>
  );
}

export default FormData;

