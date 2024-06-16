import React, { useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import fakeData from "./fakedata";
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

  const [data, setData] = useState(fakeData);
  const [modalState, setModalState] = useState("noModal");
  const [modalCandidates, setModalCandidates] = useState([]);
  const [currentField, setCurrentField] = useState("");
  const [editData, setEditData] = useState(null);

  const candidateModalPresent = modalState === "showCandidate";
  const editModalPresent = modalState === "showEdit";

  const handleSearch = async () => {
    console.log("Searching...");
  };

  const handleReset = () => {
    setBatchID("");
    setOrderNumber("");
    setCustomerName("");
    setProductName("");
    setStartDate(null);
    setEndDate(null);
  }

  const handleFieldButtonClick = async (field) => {
    try {
      const response = await axios.get(`/api/candidates?field=${field}`);
      setModalCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setModalCandidates(fakeData.map((item) => item[field]));
    }
    setCurrentField(field);
    setModalState("showCandidate");
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

  const handleDelete = async (orderID) => {
    try {
      await axios.delete(`/api/orders/${orderID}`);
      setData(data.filter((item) => item.orderID !== orderID));
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
    setEditData({ ...editData, [field]: value });
  };

  const handleModalSave = () => {
    setData(
      data.map((item) => (item.orderID === editData.orderID ? editData : item))
    );
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
