"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const NavLink = ({ href, children, mobile }) => {
  const baseClasses =
    "text-neutral-200 font-medium hover:text-neutral-400 transition-colors duration-300 font-sans";
  const mobileClasses = mobile ? "block text-center py-2 px-4" : "px-3 py-2";
  return (
    <a href={href} className={`${baseClasses} ${mobileClasses}`}>
      {children}
    </a>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-neutral-900 shadow-md p-4">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-center md:justify-between items-center">
          <a href="/" className="text-center md:text-left">
            <h1 className=" text-6xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-neutral-200 font-sans">
              Readlyt
            </h1>
          </a>
          <button
            onClick={toggleMenu}
            className="md:hidden absolute right-4 flex items-center justify-center text-neutral-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} size="lg" />
          </button>
          <nav className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 items-center">
            <NavLink href="how-it-works">How It Works</NavLink>
          </nav>
        </div>
        {isMobile && (
          <nav
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } flex-col items-center mt-4 space-y-2 md:hidden bg-neutral-800 p-4 rounded-lg shadow-lg`}
          >
            <NavLink href="how-it-works" mobile>
              How It Works
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
