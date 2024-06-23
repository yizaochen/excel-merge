import React, { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import axios from "axios";
import CandidateModal from "../components/CandidateModal";
import EditModal from "../components/EditModal";
import FormData from "../components/FormData";
import QueryDataTable from "../components/QueryDataTable";

function QueryPage() {
  const [batchID, setBatchID] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [searchEmptry, setSearchEmpty] = useState(false);
  const [data, setData] = useState([]);
  const [modalState, setModalState] = useState("noModal");
  const [modalCandidates, setModalCandidates] = useState([]);
  const [currentField, setCurrentField] = useState("");
  const [editData, setEditData] = useState(null);

  const candidateModalPresent = modalState === "showCandidate";
  const editModalPresent = modalState === "showEdit";

  const handleSearch = async () => {
    const query = {
      BatchID: batchID || undefined,
      OrderNumber: orderNumber || undefined,
      CustomerName: customerName || undefined,
      ProductName: productName || undefined,
      StartDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
      EndDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/query/", query);
      if (response.data.length === 0) {
        setSearchEmpty(true);
      } else {
        setSearchEmpty(false);
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReset = () => {
    setBatchID("");
    setOrderNumber("");
    setCustomerName("");
    setProductName("");
    setStartDate(null);
    setEndDate(null);
    setData([]);
  };

  const handleFieldButtonClick = async (field) => {
    const fieldMapping = {
      batchID: { columnName: "BatchID", keyword: batchID },
      orderNumber: { columnName: "OrderNumber", keyword: orderNumber },
      customerName: { columnName: "CustomerName", keyword: customerName },
      productName: { columnName: "ProductName", keyword: productName },
    };

    if (!fieldMapping[field]) {
      console.error("Invalid field:", field);
      return;
    }

    const { columnName, keyword } = fieldMapping[field];

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/find/?column_name=${columnName}&keyword=${keyword}`
      );
      setModalCandidates(response.data);
      setCurrentField(field);
      setModalState("showCandidate");
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleCandidateSelect = (candidate) => {
    switch (currentField) {
      case "batchID":
        setBatchID(candidate);
        break;
      case "orderNumber":
        setOrderNumber(candidate);
        break;
      case "customerName":
        setCustomerName(candidate);
        break;
      case "productName":
        setProductName(candidate);
        break;
      default:
        break;
    }
    setModalState("noModal");
  };

  const handleDelete = async (row) => {
    const orderID = row.OrderID;
    try {
      await axios.delete(`http://127.0.0.1:8000/orders/${orderID}`);
      const newData = data.filter((item) => item.OrderID !== orderID);
      setData(newData);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleUpdate = (record) => {
    setEditData(record);
    setModalState("showEdit");
  };

  const handleModalClose = () => {
    setModalState("noModal");
    setEditData(null);
  };

  const handleEditChange = (field, value) => {
    if (field === "OrderDate") {
      value = new Date(value).toISOString().split("T")[0];
    }
    setEditData({ ...editData, [field]: value });
  };

  const handleModalSave = async () => {
    try {
      const updateData = {
        OrderNumber: editData.OrderNumber,
        OrderDate: editData.OrderDate,
        CustomerName: editData.CustomerName,
        PhoneNumber: editData.PhoneNumber,
        Email: editData.Email,
        ProductID: editData.ProductID,
        ProductName: editData.ProductName,
        Quantity: editData.Quantity,
        ProductType: editData.ProductType,
        DeliveryMethod: editData.DeliveryMethod,
        BatchID: editData.BatchID,
      };
      await axios.put(`http://127.0.0.1:8000/orders/${editData.OrderID}`, updateData);
      setData(
        data.map((item) =>
          item.OrderID === editData.OrderID ? editData : item
        )
      );
    } catch (error) {
      console.error("Error updating record:", error);
    }
    handleModalClose();
  };

  return (
    <Container>
      <FormData
        batchID={batchID}
        setBatchID={setBatchID}
        orderNumber={orderNumber}
        setOrderNumber={setOrderNumber}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        customerName={customerName}
        setCustomerName={setCustomerName}
        productName={productName}
        setProductName={setProductName}
        handleFieldButtonClick={handleFieldButtonClick}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />

      <hr />
      <Alert
        variant="danger"
        show={searchEmptry}
        onClose={() => setSearchEmpty(false)}
        dismissible
      >
        No records found!
      </Alert>

      <QueryDataTable
        data={data}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />

      {candidateModalPresent && (
        <CandidateModal
          show={candidateModalPresent}
          candidates={modalCandidates}
          onSelect={handleCandidateSelect}
          onClose={handleModalClose}
        />
      )}

      {editModalPresent && (
        <EditModal
          show={editModalPresent}
          data={editData}
          onChange={handleEditChange}
          onSave={handleModalSave}
          onClose={handleModalClose}
        />
      )}
    </Container>
  );
}

export default QueryPage;
