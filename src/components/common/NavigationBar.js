import React from 'react';
import { Navbar, MenuItem, Nav, NavDropdown } from 'react-bootstrap/lib';
import { Link, IndexLink, browserHistory } from 'react-router';

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
                <MenuItem><Link to="/expenses">Expenses</Link></MenuItem>
                <MenuItem eventKey={3.2}>Incomes</MenuItem>
              </NavDropdown>
              <NavDropdown eventKey={3} title="Travel">
                <MenuItem><Link to="/pois">Pois</Link></MenuItem>
                <MenuItem><Link to="/trips">Trips</Link></MenuItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={4} title="Mate Antičević">
                <MenuItem><Link onClick={logout}>Logout</Link></MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
         </Navbar>
  );
};

export default NavigationBar;
