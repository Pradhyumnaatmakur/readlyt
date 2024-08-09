import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-200 py-4 mt-auto">
      <div className="container mx-auto flex justify-center items-center">
        <nav className="flex flex-wrap justify-center space-x-6">
          <Link
            href="/about"
            className="font-semibold hover:text-neutral-400 transition-colors duration-300 font-sans"
          >
            About
          </Link>
          <Link
            href="/terms"
            className="font-semibold hover:text-neutral-400 transition-colors duration-300 font-sans"
          >
            Terms
          </Link>
          <Link
            href="/contact-us"
            className="font-semibold hover:text-neutral-400 transition-colors duration-300 font-sans"
          >
            Contact Us
          </Link>
          <Link
            href="/sitemap"
            className="font-semibold hover:text-neutral-400 transition-colors duration-300 font-sans"
          >
            Sitemap
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
