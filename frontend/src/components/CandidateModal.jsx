import React from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";

function CandidateModal({ show, candidates, onSelect, onClose }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Candidate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {candidates.map((candidate, index) => (
            <ListGroup.Item key={index} action onClick={() => onSelect(candidate)}>
              {candidate}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CandidateModal;