import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';
import { GiAirplaneDeparture, GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { MdCall, MdMyLocation, MdLocalMovies, MdCardTravel, MdAccountBalance } from 'react-icons/md';
import { RiAccountCircleLine } from 'react-icons/ri';
import { TiBeer, TiLocation } from 'react-icons/ti';
import { Link } from 'react-router-dom';

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
            <Navbar.Brand><Link to="/">Project Ivy</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                    {identity.pif?.includes(Feature.Beer) &&
                        <NavDropdown id="nav-dropdown-finance" title="Finance">
                            <NavDropdown.Item><MdAccountBalance /> <Link to="/accounts">Accounts</Link></NavDropdown.Item>
                            <NavDropdown.Item><GiPayMoney /> <Link to="/expenses">Expenses</Link></NavDropdown.Item>
                            <NavDropdown.Item><GiReceiveMoney /> <Link to="/incomes">Incomes</Link></NavDropdown.Item>
                        </NavDropdown>
                    }
                    {identity.pif?.includes(Feature.Tracking) &&
                        <NavDropdown id="nav-dropdown-travel" title="Travel">
                            <NavDropdown.Item><GiAirplaneDeparture /> <Link to="/flights">Flights</Link></NavDropdown.Item>
                            <NavDropdown.Item><TiLocation /> <Link to="/pois">Pois</Link></NavDropdown.Item>
                            <NavDropdown.Item><MdCardTravel /> <Link to="/trips">Trips</Link></NavDropdown.Item>
                        </NavDropdown>
                    }
                    {identity.pif?.includes(Feature.Tracking) &&
                        <NavDropdown id="nav-dropdown-travel" title="Tracking">
                            <NavDropdown.Item><MdMyLocation /> <Link to="/tracking">Tracking</Link></NavDropdown.Item>
                            <NavDropdown.Item><MdMyLocation /> <Link to="/location">Location</Link></NavDropdown.Item>
                        </NavDropdown>
                    }
                    {identity.pif?.includes(Feature.Beer) &&
                        < NavDropdown id="nav-dropdown-beer" title="Beer">
                            <NavDropdown.Item><TiBeer /> <Link to="/beer">Log</Link></NavDropdown.Item>
                        </NavDropdown>
                    }
                    {(identity.pif?.includes(Feature.Calls) || identity.pif?.includes(Feature.Movies)) &&
                        <NavDropdown id="nav-dropdown-other" title="Other">
                            {identity.pif?.includes(Feature.Calls) &&
                                <NavDropdown.Item><MdCall /> <Link to="/calls">Calls</Link></NavDropdown.Item>

                            }
                            {identity.pif?.includes(Feature.Movies) &&
                                <NavDropdown.Item><MdLocalMovies /> <Link to="/movies">Movies</Link></NavDropdown.Item>
                            }
                        </NavDropdown>
                    }
                    <NavDropdown id="nav-dropdown-account" title={identity.name}>
                        <NavDropdown.Item><RiAccountCircleLine /> <Link to="/account">My account</Link></NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item><FiLogOut /> <Link to="/not-found">Logout</Link></NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar >;

export default NavigationBar;
