import React from 'react';
import { Navbar, MenuItem, Nav, NavDropdown } from 'react-bootstrap/lib';
import { Link, IndexLink, browserHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => {

  function logout(){
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
              <NavDropdown eventKey={3} title="Finance">
                <LinkContainer to="/expenses">
                  <MenuItem eventKey={3.1}>Expenses</MenuItem>
                </LinkContainer>
                <LinkContainer to="/incomes">
                  <MenuItem eventKey={3.2}>Incomes</MenuItem>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown eventKey={4} title="Travel">
                <LinkContainer to="/pois">
                  <MenuItem eventKey={4.1}>Pois</MenuItem>
                </LinkContainer>
                <LinkContainer to="/trips">
                  <MenuItem eventKey={4.2}>Trips</MenuItem>
                </LinkContainer>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={4} title="Mate Antičević">
                <MenuItem onClick={logout}>Logout</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
         </Navbar>
  );
};

export default NavigationBar;
