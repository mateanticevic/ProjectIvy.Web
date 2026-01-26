import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BiWorld } from 'react-icons/bi';
import { FaRegCalendarAlt, FaRoute, FaShapes } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { GiAirplaneDeparture, GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { MdCall, MdMyLocation, MdLocalMovies, MdCardTravel, MdAccountBalance, MdInventory } from 'react-icons/md';
import { RiAccountCircleLine } from 'react-icons/ri';
import { TiBeer, TiLocation } from 'react-icons/ti';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import { Feature, Identity, Scopes } from 'types/users';

interface Props {
    identity: Identity;
    theme?: 'light' | 'dark';
    onThemeToggle?: () => void;
}

const NavigationBar = ({ identity, theme, onThemeToggle }: Props) =>
    <Navbar
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
                            <NavDropdown.Item as={Link} to="/accounts"><MdAccountBalance /> Accounts</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/expenses"><GiPayMoney /> Expenses</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/incomes"><GiReceiveMoney /> Incomes</NavDropdown.Item>
                        </NavDropdown>
                    }
                    {identity.pif?.includes(Feature.Tracking) &&
                        <NavDropdown id="nav-dropdown-travel" title="Travel">
                            <NavDropdown.Item as={Link} to="/flights"><GiAirplaneDeparture /> Flights</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/flights-old"><GiAirplaneDeparture /> Flights (old)</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/locations"><TiLocation /> Locations</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/places"><TiLocation /> Places</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/pois"><TiLocation /> Pois</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/tracking"><FaRoute /> Tracking</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/tracking-old"><FaRoute /> Tracking (old)</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/trips"><MdCardTravel /> Trips</NavDropdown.Item>
                        </NavDropdown>
                    }
                    {(identity.pif?.includes(Feature.Calls) || identity.pif?.includes(Feature.Movies) || identity.scope.includes(Scopes.BeerUser)) &&
                        <NavDropdown id="nav-dropdown-other" title="Other">
                            {identity.scope.includes(Scopes.BeerUser) &&
                                <NavDropdown.Item as={Link} to="/beer"><TiBeer /> Beer</NavDropdown.Item>
                            }
                            <NavDropdown.Item as={Link} to="/calendar"><FaRegCalendarAlt /> Calendar</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/inventory"><MdInventory /> Inventory</NavDropdown.Item>
                            {identity.pif?.includes(Feature.Calls) &&
                                <NavDropdown.Item as={Link} to="/calls"><MdCall /> Calls</NavDropdown.Item>
                            }
                            {identity.pif?.includes(Feature.Movies) &&
                                <NavDropdown.Item as={Link} to="/movies"><MdLocalMovies /> Movies</NavDropdown.Item>
                            }
                        </NavDropdown>
                    }
                    <NavDropdown id="nav-dropdown-admin" title="Admin">
                        <NavDropdown.Item as={Link} to="/beer/admin"><TiBeer /> Manage beers</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/expense-types"><FaShapes /> Expense Types</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown id="nav-dropdown-account" title={identity.name}>
                        <NavDropdown.Item as={Link} to="/account"><RiAccountCircleLine /> My account</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item><FiLogOut /> <Link to="/not-found" onClick={logOut}>Logout</Link></NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav className="ms-auto">
                    {onThemeToggle && (
                        <Nav.Link onClick={onThemeToggle}>
                            {theme === 'light' ? <BsMoonStarsFill /> : <BsSunFill />}
                        </Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar >;

const logOut = () => {
    document.cookie = `AccessToken=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${import.meta.env.VITE_ACCESS_TOKEN_COOKIE_DOMAIN}`;
    window.location = '/';
};

export default NavigationBar;
