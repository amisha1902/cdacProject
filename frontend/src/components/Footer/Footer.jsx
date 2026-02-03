import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-top pt-5 pb-3 mt-5">
      <div className="container">

        {/* Top Section */}
        <div className="d-flex flex-lg-row flex-column flex-wrap justify-content-between gap-4">

          {/* Logo */}
          <div className="flex-shrink-0" style={{ minWidth: "200px" }}>
            <div className="fw-bold fs-4 mb-3 d-flex align-items-center gap-2">
              <div
                className="bg-dark text-white rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36, fontSize: 14 }}
              >
                GB
              </div>
              Glamora Beauty
            </div>
          </div>

          {/* Company */}
          <div className="flex-shrink-0" style={{ minWidth: "150px" }}>
            <h6 className="fw-semibold mb-3">Company</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li>About us</li>
              <li>Investor Relations</li>
              <li>Terms & conditions</li>
              <li>Privacy policy</li>
              <li>Anti-discrimination policy</li>
              <li>Careers</li>
            </ul>
          </div>

          {/* For Customers */}
          <div className="flex-shrink-0" style={{ minWidth: "150px" }}>
            <h6 className="fw-semibold mb-3">For customers</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li>GB reviews</li>
              <li>Categories near you</li>
              <li>Contact us</li>
            </ul>
          </div>

          {/* For Professionals */}
          <div className="flex-shrink-0" style={{ minWidth: "150px" }}>
            <h6 className="fw-semibold mb-3">For professionals</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li>Register as a professional</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex-shrink-0" style={{ minWidth: "180px" }}>
            <h6 className="fw-semibold mb-3">Social links</h6>
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <div className="border rounded-circle p-2 text-muted">
                <FaTwitter />
              </div>
              <div className="border rounded-circle p-2 text-muted">
                <FaFacebookF />
              </div>
              <div className="border rounded-circle p-2 text-muted">
                <FaInstagram />
              </div>
              <div className="border rounded-circle p-2 text-muted">
                <FaLinkedinIn />
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                style={{ width: 120 }}
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Play Store"
                style={{ width: 120 }}
              />
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-4" />

        {/* Bottom Section */}
        <div className="text-muted small text-center text-lg-start d-flex flex-column flex-lg-row justify-content-between gap-2">
          <div>* As on December 31, 2024</div>
          <div>© Copyright 2026 Glamora Beauty Limited. All rights reserved.</div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
