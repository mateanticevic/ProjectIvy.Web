import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';
import { GiAirplaneDeparture, GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { MdCall, MdMyLocation, MdLocalMovies, MdCardTravel, MdAccountBalance } from 'react-icons/md';
import { RiAccountCircleLine } from 'react-icons/ri';
import { TiBeer, TiLocation } from 'react-icons/ti';

import { Feature, Identity } from 'types/users';

interface Props {
    identity: Identity;
}

const NavigationBar = ({ identity }: Props) =>
    <Navbar
        bg="white"
        collapseOnSelect
        expand="lg"
        fixed="top"
    >
        <Container fluid>
            <Navbar.Brand href="/">Project Ivy</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {identity.pif?.includes(Feature.Beer) &&
                    <NavDropdown id="nav-dropdown-finance" title="Finance">
                        <NavDropdown.Item href="/accounts"><MdAccountBalance /> Accounts</NavDropdown.Item>
                        <NavDropdown.Item href="/expenses"><GiPayMoney /> Expenses</NavDropdown.Item>
                        <NavDropdown.Item href="/incomes"><GiReceiveMoney /> Incomes</NavDropdown.Item>
                    </NavDropdown>
                }
                {identity.pif?.includes(Feature.Tracking) &&
                    <NavDropdown id="nav-dropdown-travel" title="Travel">
                        <NavDropdown.Item href="/flights"><GiAirplaneDeparture /> Flights</NavDropdown.Item>
                        <NavDropdown.Item href="/pois"><TiLocation /> Pois</NavDropdown.Item>
                        <NavDropdown.Item href="/trips"><MdCardTravel /> Trips</NavDropdown.Item>
                    </NavDropdown>
                }
                {identity.pif?.includes(Feature.Tracking) &&
                    <NavDropdown id="nav-dropdown-travel" title="Tracking">
                        <NavDropdown.Item href="/tracking"><MdMyLocation /> Tracking</NavDropdown.Item>
                        <NavDropdown.Item href="/location"><MdMyLocation /> Location</NavDropdown.Item>
                    </NavDropdown>
                }
                {identity.pif?.includes(Feature.Beer) &&
                    < NavDropdown id="nav-dropdown-beer" title="Beer">
                        <NavDropdown.Item href="/beer"><TiBeer /> Log</NavDropdown.Item>
                    </NavDropdown>
                }
                {(identity.pif?.includes(Feature.Calls) || identity.pif?.includes(Feature.Movies)) &&
                    <NavDropdown id="nav-dropdown-other" title="Other">
                        {identity.pif?.includes(Feature.Calls) &&
                            <NavDropdown.Item href="/calls"><MdCall /> Calls</NavDropdown.Item>
                        }
                        {identity.pif?.includes(Feature.Movies) &&
                            <NavDropdown.Item href="/movies"><MdLocalMovies /> Movies</NavDropdown.Item>
                        }
                    </NavDropdown>
                }
                <NavDropdown id="nav-dropdown-account" title={identity.name}>
                    <NavDropdown.Item href="/account"><RiAccountCircleLine /> My account</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/not-found"><FiLogOut /> Logout</NavDropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
        </Container>
    </Navbar >;

export default NavigationBar;
