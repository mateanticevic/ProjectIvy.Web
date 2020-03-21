import React from 'react';
import { Nav, Navbar, NavItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { User } from 'types/users';

interface Props {
  user?: User;
}

const NavigationBar = ({ user }: Props) => {

  const { firstName, lastName } = user || {};

  return (
    <Navbar fixed="top" collapseOnSelect>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav>
          <NavDropdown id="nav_finance" eventKey={3} title="Finance">
            <LinkContainer to="/expenses">
              <NavItem>Expenses</NavItem>
            </LinkContainer>
            <LinkContainer to="/incomes">
              <NavItem>Incomes</NavItem>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown id="nav_travel" eventKey={4} title="Travel">
            <LinkContainer to="/flights">
              <NavItem>Flights</NavItem>
            </LinkContainer>
            <LinkContainer to="/pois">
              <NavItem>Pois</NavItem>
            </LinkContainer>
            <LinkContainer to="/tracking">
              <NavItem>Tracking</NavItem>
            </LinkContainer>
            <LinkContainer to="/trips">
              <NavItem>Trips</NavItem>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown id="nav_other" eventKey={5} title="Other">
            <LinkContainer to="/beer">
              <NavItem>Beer</NavItem>
            </LinkContainer>
            <LinkContainer to="/calls">
              <NavItem>Calls</NavItem>
            </LinkContainer>
            <LinkContainer to="/todos">
              <NavItem>To Do</NavItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        <Nav>
          <NavDropdown id="nav_user" eventKey={4} title={`${firstName} ${lastName}`}>
            <LinkContainer to="/login?logout">
              <NavItem>Logout</NavItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
