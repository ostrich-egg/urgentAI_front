"use client";

import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Link from 'next/link';
import Image from 'next/image';


  
export const NavBar = () => {
  
   
    
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="/">
          <Image src="/img/logo.svg" width={500} height={500} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
            <Nav.Link href="/accounting" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Feature</Nav.Link>
            <Nav.Link href="/accounting" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>About Us</Nav.Link>


            </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a href="#"><Image src="/img/nav-icon1.svg" width={500} height={500} alt="navIcon1" /></a>
              <a href="#"><Image src="/img/nav-icon2.svg" width={500} height={500} alt="navIcon2" /></a>
              <a href="#"><Image src="/img/nav-icon3.svg" width={500} height={500} alt="navIcon3" /></a>
              
            </div>
            <Link href="#connect">
              <button className="vvd"><span>Logins</span></button>
            </Link>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
