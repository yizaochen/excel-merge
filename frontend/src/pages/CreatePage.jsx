import { React, useState, useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import FileTable from "../components/FileTable";

function CreatePage() {
  const fileInputRef = useRef(null);
  const [fileList, setFileList] = useState([]);

  const handleChange = (e) => {
    setFileList(e.target.files);
  };

  const handleReset = () => {
    setFileList([]);
    fileInputRef.current.value = null;
  };

  return (
    <Container>
      <Form>
        <Form.Group className="my-3" controlId="formBatchID">
          <Form.Label>Batch ID</Form.Label>
          <Form.Control type="text" placeholder="B1000" />
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
      <Button className="btn btn-primary">Upload</Button>
      <Button className="btn btn-secondary ms-2" onClick={handleReset}>
        Reset
      </Button>
    </Container>
  );
}

export default CreatePage;
