import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { Link, IndexLink } from 'react-router';
import { browserHistory } from 'react-router';

const NavigationBar = () => {

  function logout(){
    localStorage.removeItem("token");
    browserHistory.push("/login");
  }

  return (
         <Navbar fixedTop={true}>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">Project Ivy</IndexLink>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavDropdown eventKey={3} title="Finance">
              <MenuItem><Link to="/expenses">Expenses</Link></MenuItem>
              <MenuItem eventKey={3.2}>Incomes</MenuItem>
            </NavDropdown>
            <NavDropdown eventKey={3} title="Travel">
              <MenuItem><Link to="/trips">Trips</Link></MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavDropdown eventKey={4} title="Mate Antičević">
              <MenuItem><Link onClick={logout}>Logout</Link></MenuItem>
            </NavDropdown>
          </Nav>
         </Navbar>
  );
};

export default NavigationBar;
