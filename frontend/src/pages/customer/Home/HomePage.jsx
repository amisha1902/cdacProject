import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useSearch } from "../../../context/SearchContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { search, location } = useSearch();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewAllSalons = () => {
    navigate("/salons");
  };

  useEffect(() => {
    const fetchTopSalons = async () => {
      try {
        const res = await axios.get("/api/salons", {
          params: {
            page: 0,
            size: 20,
            sort: "ratingAverage,desc",
          },
        });
        setSalons(res.data.content || []);
      } catch (err) {
        console.error("Failed to load salons", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSalons();
  }, []);

  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.salonName.toLowerCase().includes(search.toLowerCase()) ||
      salon.services?.join(", ").toLowerCase().includes(search.toLowerCase());

    const matchesLocation = location
      ? salon.city?.toLowerCase().includes(location.toLowerCase()) ||
        salon.state?.toLowerCase().includes(location.toLowerCase())
      : true;

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="home-container">
      {/* ================= HERO SECTION ================= */}
      <section
        className="position-relative overflow-hidden d-flex align-items-center"
        style={{
          minHeight: "90vh",
          top: "30",
          background: "linear-gradient(135deg, #fff7f2, #fefefe)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <motion.div
              className="col-lg-4 text-lg-start text-center"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-secondary small">
                DISCOVER PREMIUM SALON & SPA SERVICES NEAR YOU
              </p>

              <h1 className="fw-semibold lh-sm">
                BOOK YOUR PERFECT <br />
                <span className="text-danger">SALON EXPERIENCE</span> <br />
                ANYTIME, ANYWHERE.
              </h1>

              <div className="mt-4 d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to="/salonList">
                  <button className="btn btn-danger rounded-pill px-4">
                    Find Nearby Salons
                  </button>
                </Link>

                <button className="btn btn-outline-dark rounded-pill px-4">
                  About Us
                </button>
              </div>
            </motion.div>

            {/* RIGHT IMAGE STACK */}
            <div
              className="col-lg-8 position-relative d-flex justify-content-center align-items-center"
              style={{
                borderTopLeftRadius: "160px",
                borderBottomLeftRadius: "160px",
                background: "linear-gradient(135deg, #fff7f2, #fefefe)",
                padding: "100px 0",
              }}
            >
              {/* LEFT IMAGE */}
              <motion.div
                className="position-absolute shadow"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.6 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  width: "210px",
                  height: "280px",
                  borderRadius: "120px",
                  overflow: "hidden",
                  left: "6%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#fff",
                  zIndex: 2,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                  className="w-100 h-100 object-fit-cover"
                  alt=""
                />
              </motion.div>

              {/* CENTER IMAGE */}
              <motion.div
                className="shadow position-relative"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8 }}
                whileHover={{ scale: 1.07 }}
                style={{
                  width: "340px",
                  height: "380px",
                  borderRadius: "180px",
                  overflow: "hidden",
                  zIndex: 5,
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250"
                  className="w-100 h-100 object-fit-cover"
                  alt=""
                />
              </motion.div>

              {/* RIGHT IMAGE */}
              <motion.div
                className="position-absolute shadow"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.6 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  width: "210px",
                  height: "280px",
                  borderRadius: "120px",
                  overflow: "hidden",
                  right: "6%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#fff",
                  zIndex: 2,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a"
                  className="w-100 h-100 object-fit-cover"
                  alt=""
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* CURVED WAVE */}
        <svg
          viewBox="0 0 1440 120"
          style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}
        >
          <path
            fill="#ffffff"
            d="M0,64L80,74.7C160,85,320,107,480,96C640,85,800,43,960,32C1120,21,1280,43,1360,53.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </section>

      {/* ================= POPULAR SALONS SECTION ================= */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h6 className="text-danger fw-semibold mb-2">POPULAR SALONS</h6>

            <p className="text-muted small mb-4">
              Explore top-rated salons and spas near you. From hair styling and
              makeup to spa therapies and grooming services — book instantly and
              hassle-free.
            </p>

            <button
              className="btn btn-danger rounded-pill px-4"
              onClick={handleViewAllSalons}
            >
              View All Salons
            </button>
          </div>

          <div className="col-lg-8">
            <div className="row g-4">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div className="col-md-4" key={i}>
                    <div
                      className="card border-0 shadow-sm text-center p-3"
                      style={{ borderRadius: "18px", height: "190px" }}
                    />
                  </div>
                ))}

              {!loading &&
                filteredSalons.slice(0, 6).map((salon) => (
                  <div className="col-md-4" key={salon.salonId}>
                    <div
                      className="card border-0 shadow-sm text-center p-3 h-100"
                      style={{ borderRadius: "18px", cursor: "pointer" }}
                      onClick={() => navigate(`/salons/${salon.salonId}`)}
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          src={
                            salon.logo ||
                            "https://via.placeholder.com/90x90?text=Salon"
                          }
                          alt={salon.salonName}
                          className="rounded-circle object-fit-cover"
                          width="90"
                          height="90"
                        />
                      </div>

                      <h6 className="mt-3 fw-bold">{salon.salonName}</h6>

                      <p className="text-muted small mb-2">
                        {salon.city}, {salon.state}
                      </p>

                      <div className="text-warning small">
                        {"★".repeat(Math.round(salon.ratingAverage || 0))}
                        {"☆".repeat(5 - Math.round(salon.ratingAverage || 0))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
