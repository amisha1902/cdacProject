import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

const Navbar = () => {
  const { search, setSearch, location, setLocation } = useSearch();
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const area =
            data.address.suburb ||
            data.address.neighbourhood ||
            data.address.city ||
            data.address.town ||
            data.address.state;
          setLocation(area || "");
        } catch {
          setLocation("");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => setLoadingLocation(false)
    );
  }, [setLocation]);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3 shadow-sm sticky-top">
      <div className="container-fluid align-items-center">

        {/* LOGO */}
        <Link
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2"
          to="/"
style={{ fontFamily: "Poppins,  system-ui, sans-serif" }}
        >
         <div
                className="bg-danger text-white rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36, fontSize: 14 }}
              >
                GB
              </div>
          Glamora <span className="text-danger">BEAUTY</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#glamoraNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CENTER */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="glamoraNavbar"
        >
          <div className="d-flex align-items-center gap-3 w-75">

            {/* 📍 Location */}
            <div
              className="input-group rounded-pill border px-2 align-items-center"
              style={{ maxWidth: "280px" }}
            >
              <span className="input-group-text bg-white border-0 text-muted">
                📍
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none small bg-transparent"
                value={loadingLocation ? "Detecting..." : location}
                placeholder="Enter location"
                onChange={(e) => setLocation(e.target.value)}
              />
              <span className="input-group-text bg-white border-0 text-muted">
                ▾
              </span>
            </div>

            {/* 🔍 Search */}
            <div className="input-group rounded-pill border flex-grow-1 px-2">
              <span className="input-group-text bg-white border-0 text-muted">
                <FiSearch />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none small"
                placeholder="Search for salons, services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/cart" className="position-relative">
            <HiOutlineShoppingBag size={22} className="text-dark" />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger"
              style={{ fontSize: "10px" }}
            >
              2
            </span>
          </Link>

          <Link className="nav-link fw-semibold" to="/register">
            Sign Up
          </Link>

          <Link to="/login">
            <button className="btn btn-dark px-4 rounded-pill">Login</button>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
