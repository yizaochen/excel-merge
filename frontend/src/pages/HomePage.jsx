import React from "react";
import FileUpload from "../components/FileUpload";
import { Container } from "react-bootstrap";

function HomePage() {
  return (
    <Container>
      <div className="mt-3">
        <h1>Upload Excel Files</h1>
        <FileUpload />
      </div>
    </Container>
  );
}

export default HomePage;
