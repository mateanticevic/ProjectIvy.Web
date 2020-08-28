import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { User } from 'types/users';

interface Props {
  user?: User;
}

const NavigationBar = ({ user }: Props) => {

  const { firstName, lastName } = user || {};

  return (
    <Navbar
      bg="white"
      collapseOnSelect
      expand="lg"
      fixed="top"
    >
      <Navbar.Brand href="/">Project Ivy</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" >
        <Nav className="mr-auto">
          <NavDropdown id="nav-dropdown-finance" title="Finance">
            <NavDropdown.Item href="/expenses">Expenses</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown id="nav-dropdown-travel" title="Travel">
            <NavDropdown.Item href="/flights">Expenses</NavDropdown.Item>
            <NavDropdown.Item href="/pois">Pois</NavDropdown.Item>
            <NavDropdown.Item href="/tracking">Tracking</NavDropdown.Item>
            <NavDropdown.Item href="/trips">Trips</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown id="nav-dropdown-other" title="Other">
            <NavDropdown.Item href="/beer">Beer</NavDropdown.Item>
            <NavDropdown.Item href="/calls">Calls</NavDropdown.Item>
            <NavDropdown.Item href="/todos">To Do</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <NavDropdown id="nav-dropdown-account" title={`${firstName} ${lastName}`}>
            <NavDropdown.Item href="/">My account</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/login?logout">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
