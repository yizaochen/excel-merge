import React from "react";
import { Button, Form } from "react-bootstrap";

function FileUpload() {
  const handleFileUpload = (event) => {
    console.log("handleFileUpload Click");
  };

  return (
    <Form onSubmit={handleFileUpload}>

      <Button variant="primary" type="submit">
        Upload
      </Button>
    </Form>
  );
}

export default FileUpload;
