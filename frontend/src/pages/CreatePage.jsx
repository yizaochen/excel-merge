import { React, useState, useRef } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import FileTable from "../components/FileTable";
import axios from "axios";

function CreatePage() {
  const fileInputRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [batchID, setBatchID] = useState("");
  const [uploadStatus, setUploadStatus] = useState("initial");

  const handleChange = (e) => {
    setFileList(e.target.files);
    setUploadStatus("initial"); // Reset upload status
  };

  const handleReset = () => {
    setFileList([]);
    fileInputRef.current.value = null;
    setBatchID("");
    setUploadStatus("initial"); // Reset upload status
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let file of fileList) {
      formData.append("files", file);
    }
    formData.append("batch_id", batchID);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      // Reset the form
      setFileList([]);
      fileInputRef.current.value = null;
      setBatchID("");
      setUploadStatus("success"); // Set upload status to success
    } catch (error) {
      console.error(error);
      setUploadStatus("failed"); // Set upload status to failed
    }
  };

  return (
    <Container>
      <Form>
        <Form.Group className="my-3" controlId="formBatchID">
          <Form.Label>Batch ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="B1000"
            value={batchID}
            onChange={(e) => {
              setBatchID(e.target.value);
              setUploadStatus("initial"); // Reset upload status
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formFileUploads">
          <Form.Label>Upload Your Excel Files</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleChange}
            ref={fileInputRef}
            accept=".xlsx"
          />
        </Form.Group>
      </Form>
      <FileTable fileList={fileList} />
      <Button className="btn btn-primary" onClick={handleSubmit}>
        Upload
      </Button>
      <Button className="btn btn-secondary ms-2" onClick={handleReset}>
        Reset
      </Button>
      {uploadStatus === "success" && (
        <Alert variant="success mt-3">Upload succeeded!</Alert>
      )}
      {uploadStatus === "failed" && (
        <Alert variant="danger mt-3">Upload failed. Please try again.</Alert>
      )}
    </Container>
  );
}

export default CreatePage;
