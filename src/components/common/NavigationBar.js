import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { Link, IndexLink } from 'react-router';

const NavigationBar = () => {

  return (
         <Navbar fixedTop={true}>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">Project Ivy</IndexLink>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavDropdown eventKey={3} title="Finance" id="basic-nav-dropdown">
              <MenuItem><Link to="/expenses">Expenses</Link></MenuItem>
              <MenuItem eventKey={3.2}>Incomes</MenuItem>
            </NavDropdown>
            <NavDropdown eventKey={3} title="Travel" id="basic-nav-dropdown">
              <MenuItem><Link to="/trips">Trips</Link></MenuItem>
            </NavDropdown>
          </Nav>
         </Navbar>
  );
};

export default NavigationBar;
