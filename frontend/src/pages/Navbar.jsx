import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function AppNavbar() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Container>
        <Navbar.Brand href="/create">Excel-Merge</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
              <Nav.Link href="/create" active={pathname === "/create"}>Create</Nav.Link>
              <Nav.Link href="/read" active={pathname === "/read"}>Read</Nav.Link>
              <Nav.Link href="/update" active={pathname === "/update"}>Update</Nav.Link>
              <Nav.Link href="/delete" active={pathname === "/delete"}>Delete</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
