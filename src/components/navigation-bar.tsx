import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { FaRegCalendarAlt, FaRoute, FaShapes, FaBook } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { GiAirplaneDeparture, GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { MdCall, MdLocalMovies, MdCardTravel, MdAccountBalance, MdInventory } from 'react-icons/md';
import { RiAccountCircleLine } from 'react-icons/ri';
import { TiBeer, TiLocation } from 'react-icons/ti';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { Link, NavLink } from 'react-router-dom';

import { Feature, Identity, Scopes } from 'types/users';
import { LuListTodo } from 'react-icons/lu';

interface Props {
    identity: Identity;
    theme?: 'light' | 'dark';
    onThemeToggle?: () => void;
}

const NavigationBrand = () => (
    <span className="d-inline-flex align-items-center gap-2">
        <img src="/icons/ivy-192.png" width={32} height={32} alt="" />
        <span>ivy</span>
    </span>
);

const NavigationBar = ({ identity, theme, onThemeToggle }: Props) => {
    const [show, setShow] = useState(false);
    const closeNavigation = () => setShow(false);

    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 992px)');
        const closeOnBreakpointChange = () => setShow(false);
        desktop.addEventListener('change', closeOnBreakpointChange);
        return () => desktop.removeEventListener('change', closeOnBreakpointChange);
    }, []);

    return (
        <>
            <Navbar as="header" role="banner" expand={false} fixed="top" className="d-lg-none navigation-mobile-header" expanded={show}>
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" onClick={closeNavigation}><NavigationBrand /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="ivy-navigation" aria-expanded={show} onClick={() => setShow(!show)} />
                </Container>
            </Navbar>
            <Offcanvas
                id="ivy-navigation"
                className="navigation-sidebar"
                placement="start"
                responsive="lg"
                show={show}
                onHide={closeNavigation}
                aria-labelledby="ivy-navigation-title"
            >
                <Offcanvas.Header className="d-lg-none" closeButton>
                    <Offcanvas.Title id="ivy-navigation-title"><NavigationBrand /></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Navbar.Brand as={Link} to="/" className="d-none d-lg-block mb-4" onClick={closeNavigation}><NavigationBrand /></Navbar.Brand>
                    {/* Route links own the active state, including browser back/forward navigation. */}
                    <Nav as="nav" aria-label="Main navigation" className="flex-column" activeKey="" onSelect={closeNavigation}>
                        {identity.pif?.includes(Feature.Finance) &&
                            <section className="mb-3" aria-label="Finance">
                                <h2 className="navigation-group-title">Finance</h2>
                                <Nav.Link as={NavLink} eventKey="/accounts" to="/accounts"><MdAccountBalance /> Accounts</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/expenses" to="/expenses"><GiPayMoney /> Expenses</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/incomes" to="/incomes"><GiReceiveMoney /> Incomes</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/salary" to="/salary"><GiReceiveMoney /> Salary</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/net-worth" to="/net-worth"><MdAccountBalance /> Net worth</Nav.Link>
                            </section>
                        }
                        <section className="mb-3" aria-label="Organizational">
                            <h2 className="navigation-group-title">Organizational</h2>
                            <Nav.Link as={NavLink} eventKey="/calendar" to="/calendar"><FaRegCalendarAlt /> Calendar</Nav.Link>
                            <Nav.Link as={NavLink} eventKey="/inventory" to="/inventory"><MdInventory /> Inventory</Nav.Link>
                            <Nav.Link as={NavLink} eventKey="/journal" to="/journal"><FaBook /> Journal</Nav.Link>
                            <Nav.Link as={NavLink} eventKey="/todo" to="/todo"><LuListTodo /> Todo</Nav.Link>
                        </section>
                        {identity.pif?.includes(Feature.Tracking) &&
                            <section className="mb-3" aria-label="Travel">
                                <h2 className="navigation-group-title">Travel</h2>
                                <Nav.Link as={NavLink} eventKey="/flights" to="/flights"><GiAirplaneDeparture /> Flights</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/places" to="/places"><TiLocation /> Places</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/pois" to="/pois"><TiLocation /> Pois</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/tracking" to="/tracking"><FaRoute /> Tracking</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/tracking-old" to="/tracking-old"><FaRoute /> Tracking (old)</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/routes" to="/routes"><FaRoute /> Routes</Nav.Link>
                                <Nav.Link as={NavLink} eventKey="/trips" to="/trips"><MdCardTravel /> Trips</Nav.Link>
                            </section>
                        }
                        {(identity.pif?.includes(Feature.Calls) || identity.pif?.includes(Feature.Movies) || identity.scope.includes(Scopes.BeerUser)) &&
                            <section className="mb-3" aria-label="Other">
                                <h2 className="navigation-group-title">Other</h2>
                                {identity.scope.includes(Scopes.BeerUser) &&
                                    <Nav.Link as={NavLink} eventKey="/beer" to="/beer" end><TiBeer /> Beer</Nav.Link>
                                }
                                {identity.pif?.includes(Feature.Calls) &&
                                    <Nav.Link as={NavLink} eventKey="/calls" to="/calls"><MdCall /> Calls</Nav.Link>
                                }
                                {identity.pif?.includes(Feature.Movies) &&
                                    <Nav.Link as={NavLink} eventKey="/movies" to="/movies"><MdLocalMovies /> Movies</Nav.Link>
                                }
                            </section>
                        }
                        <section className="mb-3" aria-label="Admin">
                            <h2 className="navigation-group-title">Admin</h2>
                            <Nav.Link as={NavLink} eventKey="/beer/admin" to="/beer/admin"><TiBeer /> Manage beers</Nav.Link>
                            <Nav.Link as={NavLink} eventKey="/expense-types" to="/expense-types"><FaShapes /> Expense Types</Nav.Link>
                        </section>
                        <section className="mb-3" aria-label={identity.name}>
                            <h2 className="navigation-group-title">{identity.name}</h2>
                            <Nav.Link as={NavLink} eventKey="/account" to="/account"><RiAccountCircleLine /> My Account</Nav.Link>
                            <hr className="my-2" />
                            <Nav.Link as={Link} eventKey="/not-found" to="/not-found" onClick={logOut}><FiLogOut /> Logout</Nav.Link>
                        </section>
                        {onThemeToggle && (
                            <Nav.Link as="button" className="text-start" aria-label="Toggle theme" onClick={onThemeToggle}>
                                {theme === 'light' ? <BsMoonStarsFill /> : <BsSunFill />} Toggle theme
                            </Nav.Link>
                        )}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

const logOut = () => {
    document.cookie = `AccessToken=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${import.meta.env.VITE_ACCESS_TOKEN_COOKIE_DOMAIN}`;
    window.location = '/';
};

export default NavigationBar;
