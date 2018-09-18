import React from 'react';
import { Navbar, MenuItem, Nav, NavDropdown } from 'react-bootstrap/lib';
import { IndexLink, browserHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => {

  function logout() {
    localStorage.removeItem("token");
    browserHistory.push("/login");
  }

  return (
    <Navbar fixedTop collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <IndexLink to="/">Project Ivy</IndexLink>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavDropdown id="nav_finance" eventKey={3} title="Finance">
            <LinkContainer to="/expenses">
              <MenuItem eventKey={3.1}>Expenses</MenuItem>
            </LinkContainer>
            <LinkContainer to="/incomes">
              <MenuItem eventKey={3.2}>Incomes</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown id="nav_travel" eventKey={4} title="Travel">
            <LinkContainer to="/flights">
              <MenuItem eventKey={4.1}>Flights</MenuItem>
            </LinkContainer>
            <LinkContainer to="/pois">
              <MenuItem eventKey={4.2}>Pois</MenuItem>
            </LinkContainer>
            <LinkContainer to="/trips">
              <MenuItem eventKey={4.3}>Trips</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown id="nav_other" eventKey={5} title="Other">
            <LinkContainer to="/beer">
              <MenuItem eventKey={5.1}>Beer</MenuItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <NavDropdown id="nav_user" eventKey={4} title="Mate Antičević">
            <MenuItem onClick={logout}>Logout</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
