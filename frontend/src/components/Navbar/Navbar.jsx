import React from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
// import ImageAvatar from "../ImageAvatar";

const Navbar = () => {
  const location = useLocation();

  // ✅ Check if current route is /salonList
  const isSalonListPage = location.pathname === "/salonList";
  const isProfile = location.pathname === "/profile";

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3">
      <div className="container-fluid">

        {/* ✅ LOGO */}
        <Link
          className="navbar-brand fs-4"
          to="/"
          style={{ fontFamily: "Syne, sans-serif", fontWeight: "200" }}
        >
          Glamora <span className="text-danger"> BEAUTY</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#glamoraNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="glamoraNavbar">

          {isSalonListPage ? (
            <div className="w-50">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search for salons, services..."
                />
              </div>
            </div>
          ) : (
            <ul className="navbar-nav gap-4">
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-danger" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="">
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="">
                  Contact Us
                </Link>
              </li>
            </ul>
          )}

        </div>

        <div className="d-flex align-items-center gap-4">
          {!isSalonListPage && <FiSearch size={20} className="cursor-pointer" />}
          
          <Link className="nav-link fw-semibold" to="/cart">
            <HiOutlineShoppingBag size={22} className="cursor-pointer" />  
          </Link>
          <Link className="nav-link fw-semibold" to="/register">
            Sign Up
          </Link>
           <Link to="/login">
          <button className="btn btn-dark px-4">
            Login
          </button>
          </Link>
          {/* {!isProfile ? (<ImageAvatar/>
):(null)} */}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
