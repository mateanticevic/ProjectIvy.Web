import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import { FiLogOut, FiMap } from 'react-icons/fi';
import { GiAirplaneDeparture, GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { MdCall, MdMyLocation, MdLocalMovies, MdCardTravel } from 'react-icons/md';
import { RiAccountCircleLine } from 'react-icons/ri';
import { TiBeer, TiLocation } from 'react-icons/ti';

import { UserContext } from 'contexts/user-context';

const NavigationBar = () =>
    <UserContext.Consumer>
        {({ firstName, lastName }) =>
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
                            <NavDropdown.Item href="/expenses"><GiPayMoney /> Expenses</NavDropdown.Item>
                            <NavDropdown.Item href="/incomes"><GiReceiveMoney /> Incomes</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown id="nav-dropdown-travel" title="Travel">
                            <NavDropdown.Item href="/flights"><GiAirplaneDeparture /> Flights</NavDropdown.Item>
                            <NavDropdown.Item href="/pois"><TiLocation /> Pois</NavDropdown.Item>
                            <NavDropdown.Item href="/tracking"><MdMyLocation /> Tracking</NavDropdown.Item>
                            <NavDropdown.Item href="/location"><MdMyLocation /> Location</NavDropdown.Item>
                            <NavDropdown.Item href="/trips"><MdCardTravel /> Trips</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown id="nav-dropdown-beer" title="Beer">
                            <NavDropdown.Item href="/beer"><TiBeer /> Log</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown id="nav-dropdown-other" title="Other">
                            <NavDropdown.Item href="/calls"><MdCall /> Calls</NavDropdown.Item>
                            <NavDropdown.Item href="/movies"><MdLocalMovies /> Movies</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown id="nav-dropdown-account" title={`${firstName} ${lastName}`}>
                            <NavDropdown.Item href="/account"><RiAccountCircleLine /> My account</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/not-found"><FiLogOut /> Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        }
    </UserContext.Consumer>;

export default NavigationBar;
