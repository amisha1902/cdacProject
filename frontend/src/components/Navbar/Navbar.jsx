import React, { useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import ImageAvatar from "../ImageAvatar";
import { getProfile } from "../../services/userService";
import axios from "axios";
import { Button } from "react-bootstrap";

const Navbar = () => {
  const { search, setSearch, location, setLocation } = useSearch();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [profile, setProfile] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => {
        if (err?.response?.status === 403) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        console.log("Profile not loaded", err);
      });
  }, [isLoggedIn, navigate]);

  const fetchCartCount = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.get("/api/cart/getCart", {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(res.data.totalQuantity || 0);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchCartCount();
    else setCartCount(0);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'Accept': 'application/json',
              }
            }
          );
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          const area =
            data.address.suburb ||
            data.address.neighbourhood ||
            data.address.city ||
            data.address.town ||
            data.address.state;
          setLocation(area || "");
        } catch (error) {
          console.error("Failed to fetch location:", error);
          setLocation(""); // Set empty location on error
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        console.error("Geolocation permission denied");
        setLoadingLocation(false);
      }
    );
  }, [setLocation]);

  useEffect(() => {
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3 shadow-sm sticky-top">
      <div className="container-fluid align-items-center">

        {/* LOGO */}
        <Link
          className="navbar-brand fw-semibold fs-5 d-flex align-items-center gap-2"
          to="/"
          style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
        >
          <div
            className="bg-danger text-white rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: 34, height: 34, fontSize: 13 }}
          >
            GB
          </div>
          Glamora <span className="text-danger">Beauty</span>
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

            {/* Location */}
            <div
              className="input-group rounded-pill border px-2 align-items-center"
              style={{ maxWidth: "260px" }}
            >
              <span className="input-group-text bg-white border-0 text-muted small">
                📍
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none small bg-transparent"
                value={loadingLocation ? "Detecting..." : location}
                placeholder="Enter location"
                onChange={(e) => setLocation(e.target.value)}
              />
              <span className="input-group-text bg-white border-0 text-muted small">
                ▾
              </span>
            </div>

            {/* Search */}
            <div className="input-group rounded-pill border flex-grow-1 px-5">
              <span className="input-group-text bg-white border-0 text-muted">
                <FiSearch size={14} />
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
        <div className="d-flex align-items-center gap-3 position-relative">

          {isLoggedIn && (
            <Link to="/cart" className="text-secondary position-relative">
              <HiOutlineShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "10px", padding: "3px 6px" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/registerOwner">
                <button className="btn btn-sm border border-dark rounded-5">Become a partner</button>
              </Link>       
                 <Link to="/registerCustomer" className="small text-decoration-none">
                Sign Up
              </Link>
              <Link to="/login">
                <button className="btn btn-dark btn-sm px-3">Login</button>
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div ref={menuRef} className="position-relative">

              {/* Avatar */}
              <div
                role="button"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <ImageAvatar
                  name={
                    profile
                      ? `${profile.firstName} ${profile.lastName}`
                      : "User"
                  }
                  imageUrl={profile?.profileImage || null}
                  size={34}
                />
              </div>

              {/* Dropdown Menu */}
              {showMenu && (
                <div
                  className="position-absolute end-0 ps-3 mt-2 bg-white border rounded-3 shadow-sm py-2"
                  style={{ width: 180, zIndex: 1000 }}
                >
                  <button
                    className="dropdown-item small"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/profile");
                    }}
                  >
                    My Profile
                  </button>

                  <button
                    className="dropdown-item small"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/my-bookings");
                    }}
                  >
                    My Bookings
                  </button>

                  <hr className="dropdown-divider my-1" />

                  <button
                    className="dropdown-item small text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
