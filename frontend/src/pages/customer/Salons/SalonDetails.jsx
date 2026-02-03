import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Spinner,
  Image,
  Button,
  Modal,
} from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";

// ================= SLOT MODAL COMPONENT =================
const SlotModal = ({ show, onClose, availableDates, availableSlots, onSelectSlot }) => {
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [selectedTime, setSelectedTime] = useState("");

  // reset time when date changes
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) return;
    onSelectSlot({ date: selectedDate, time: selectedTime });
    onClose();
  };

  if (!availableDates || availableDates.length === 0) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select your booking details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* ================= DATES ROW ================= */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {availableDates.map((date) => (
            <Button
              key={date}
              size="sm"
              variant={selectedDate === date ? "dark" : "outline-dark"}
              onClick={() => setSelectedDate(date)}
            >
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </Button>
          ))}
        </div>

        {/* ================= TIME SLOTS ================= */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {availableSlots[selectedDate]?.map((time) => (
            <Button
              key={time}
              size="sm"
              variant={selectedTime === time ? "dark" : "outline-dark"}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </Button>
          ))}
        </div>

        <Button
          className="w-100 bg-dark rounded-pill text-white border-dark"
          disabled={!selectedTime}
          onClick={handleProceed}
        >
          Proceed to Cart
        </Button>
      </Modal.Body>
    </Modal>
  );
};

// ================= MAIN COMPONENT =================
const SalonDetails = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const [loadingSalon, setLoadingSalon] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // ================= LIGHTBOX MODAL =================
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const openGallery = (idx) => {
    setCurrentImageIdx(idx);
    setShowGallery(true);
  };
  const closeGallery = () => setShowGallery(false);
  const nextImage = () =>
    setCurrentImageIdx((prev) => (prev + 1) % salon.galleryImages.length);
  const prevImage = () =>
    setCurrentImageIdx(
      (prev) => (prev - 1 + salon.galleryImages.length) % salon.galleryImages.length
    );

  // ================= SLOT MODAL =================
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedService, setSelectedService] = useState(null);

  const handleAddToCartClick = async (service) => {
    try {
      setSelectedService(service);
      const res = await api.get(
        `/api/salons/${salonId}/services/${service.serviceId}/availability`
      );

      // Check if there are any available slots
      if (!res.data || res.data.length === 0) {
        alert("No available slots for this service at the moment. Please try again later or contact the salon.");
        return;
      }

      // transform API response to dates + slots format
      const dates = [...new Set(res.data.map((s) => s.date))];
      const slotsMap = {};
      dates.forEach((date) => {
        slotsMap[date] = res.data
          .filter((s) => s.date === date)
          .map((s) => s.startTime);
      });

      setAvailableDates(dates);
      setAvailableSlots(slotsMap);
      setShowSlotModal(true);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      alert("Unable to fetch slots. Try again later.");
    }
  };

  const handleSlotSelect = async (slot) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    try {
      await api.post(
        `/api/cart/addToCart?userId=${userId}`,
        {
          serviceId: selectedService.serviceId,
          quantity: 1,
          date: slot.date,
          time: slot.time,
        }
      );

      setShowSlotModal(false);
      window.dispatchEvent(new Event('cartUpdated')); // Trigger cart update
      alert("Service added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      
      // Check if it's a salon validation error
      if (err.response?.data?.message && err.response.data.message.includes("different salon")) {
        const confirmClear = window.confirm(
          "You have services from a different salon in your cart. " +
          "Would you like to clear your cart and add this service instead?"
        );
        
        if (confirmClear) {
          try {
            // Clear the cart first
            await api.delete(`/api/cart/clear?userId=${userId}`);
            
            // Then add the new service
            await api.post(
              `/api/cart/addToCart?userId=${userId}`,
              {
                serviceId: selectedService.serviceId,
                quantity: 1,
                date: slot.date,
                time: slot.time,
              }
            );
            
            setShowSlotModal(false);
            window.dispatchEvent(new Event('cartUpdated')); // Trigger cart update
            alert("Cart cleared and service added successfully!");
            navigate("/cart");
          } catch (clearErr) {
            console.error("Failed to clear cart and add service:", clearErr);
            alert("Failed to clear cart and add service. Please try again.");
          }
        }
      } else {
        alert("Failed to add to cart. Please try again.");
      }
    }
  };

  // ================= SALON DETAILS =================
  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await api.get(`/api/salons/${salonId}`);
        setSalon(res.data);
        setCategories(res.data.categories || []);
        if (res.data.categories?.length > 0) {
          setSelectedCategoryId(res.data.categories[0].categoryId);
          // Set services from the first category
          setServices(res.data.categories[0].services || []);
        }
      } catch (err) {
        console.error("Failed to load salon details", err);
      } finally {
        setLoadingSalon(false);
      }
    };
    fetchSalon();
  }, [salonId]);

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const [reviewsRes, avgRes] = await Promise.all([
          api.get(`/api/reviews/salon/${salonId}`),
          api.get(`/api/reviews/salon/${salonId}/average`)
        ]);
        setReviews(reviewsRes.data || []);
        setAverageRating(avgRes.data || 0);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [salonId]);

  // ================= SERVICES BY CATEGORY =================
  useEffect(() => {
    if (!selectedCategoryId || !categories.length) return;

    // Find services from the selected category (already loaded from salon details)
    const selectedCategory = categories.find(cat => cat.categoryId === selectedCategoryId);
    if (selectedCategory) {
      setServices(selectedCategory.services || []);
    }
  }, [selectedCategoryId, categories]);

  if (loadingSalon)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (!salon) return null;

  return (
    <Container className="my-4">
      {/* ================= HEADER ================= */}
      <Card className="border-0 mb-4">
        <Card.Body className="p-0">
          <Row className="align-items-center">
            <Col xs={3} md={2}>
              <Image
                src={salon.logo && salon.logo.startsWith('http') ? salon.logo : (salon.logo ? `http://localhost:8080/${salon.logo}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Ccircle cx="40" cy="40" r="40" fill="%23ddd"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Logo%3C/text%3E%3C/svg%3E')}
                roundedCircle
                width={80}
                height={80}
                alt={salon.salonName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Ccircle cx="40" cy="40" r="40" fill="%23ddd"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Logo%3C/text%3E%3C/svg%3E';
                }}
              />
            </Col>
            <Col>
              <h2 className="fw-bold mb-1">{salon.salonName}</h2>
              <p className="text-muted mb-1">
                {salon.address}, {salon.city}, {salon.state} - {salon.pincode}
              </p>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span className="text-danger small">
                  Open now · {salon.openingTime?.slice(0, 5)} -{" "}
                  {salon.closingTime?.slice(0, 5)}
                </span>
                {salon.phone && (
                  <span className="text-muted small">📞 {salon.phone}</span>
                )}
              </div>
              <Badge
                bg="success"
                className="d-inline-flex align-items-center gap-1 px-3 py-2 mt-2"
              >
                {(salon.ratingAverage ?? 0).toFixed(1)} <StarFill size={12} /> (
                {salon.totalReviews})
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ================= GALLERY STACK ================= */}
      {salon.galleryImages?.length > 0 && (
        <Row className="mb-4 g-2">
          {salon.galleryImages.map((img, idx) => {
            const isLast = idx === salon.galleryImages.length - 1;
            return (
              <Col xs={6} md={3} key={idx}>
                <Card
                  className="border-0 cursor-pointer position-relative"
                  onClick={() => openGallery(idx)}
                >
                  <Card.Img
                    variant="top"
                    src={img}
                    style={{ objectFit: "cover", height: "150px" }}
                  />
                  {isLast && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        borderRadius: "0.25rem",
                      }}
                    >
                      View Gallery
                    </div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* ================= CATEGORY + SERVICES ================= */}
   <div className="container">
<div className="d-flex mt-4">
  {/* Categories */}
  <Col md={3} className="pe-4 border-end">
    <h6 className="fw-bold text-uppercase text-muted mb-3">
      Categories
    </h6>
    <ListGroup variant="flush">
      {categories.map((cat) => (
        <ListGroup.Item
          key={cat.categoryId}
          action
          onClick={() => setSelectedCategoryId(cat.categoryId)}
          className={`fw-semibold px-3 py-2 mb-2 rounded ${
            cat.categoryId === selectedCategoryId
              ? "bg-danger text-white"
              : "bg-light"
          }`}
          style={{ cursor: "pointer", border: "none" }}
        >
          {cat.categoryName}
        </ListGroup.Item>
      ))}
    </ListGroup>
  </Col>

  {/* Services */}
  <Col md={9} className="ms-4">
  {loadingServices ? (
    <div className="text-center mt-5">
      <Spinner animation="border" />
    </div>
  ) : services.length === 0 ? (
    <p className="text-muted">No services available.</p>
  ) : (
    <Row className="g-4">
      {services.map((service) => (
        <Col xs={12} sm={6} lg={5} key={service.serviceId}>
          <Card
            className="border-0 shadow-sm h-100 service-card"
            style={{ borderRadius: "14px" }}
          >
            <Card.Body className="p-3">
              <div className="d-flex gap-3">
                {/* <img
                  src={
                    service.image ||
                    "https://via.placeholder.com/100x100?text=Service"
                  }
                  alt={service.serviceName}
                  className="rounded object-fit-cover"
                  width="72"
                  height="72"
                /> */}

                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="fw-semibold mb-1">
                      {service.serviceName}
                    </h6>

                    {service.description && (
                      <p
                        className="text-muted small mb-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="fw-semibold text-danger">
                      ₹{service.basePrice}
                    </span>
                    <span className="text-muted small">
                      {service.durationMinutes} mins
                    </span>
                    <Button
                      size="sm"
                      className="rounded-pill px-3"
                      style={{ backgroundColor: "#dc3545", border: "none" }}
                      onClick={() => handleAddToCartClick(service)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )}
</Col>

</div>
</div>

      {/* ================= REVIEWS SECTION ================= */}
      <Card className="border-0 shadow-sm mt-4 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Customer Reviews</h5>
            <Badge bg="success" className="d-flex align-items-center gap-1 px-3 py-2">
              {averageRating.toFixed(1)} <StarFill size={14} /> ({reviews.length})
            </Badge>
          </div>

          {loadingReviews ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-muted mb-0">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((review) => (
                <Card key={review.reviewId} className="border">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="fw-semibold">{review.customerName || "Customer"}</div>
                        <div className="d-flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarFill
                              key={star}
                              size={14}
                              color={star <= review.rating ? "#ffc107" : "#e4e5e9"}
                            />
                          ))}
                        </div>
                      </div>
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </small>
                    </div>
                    {review.comment && (
                      <p className="text-muted small mb-0">{review.comment}</p>
                    )}
                    {review.isVerified && (
                      <Badge bg="info" className="mt-2" style={{ fontSize: "10px" }}>
                        Verified
                      </Badge>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>


      {/* ================= SLOT SELECTION MODAL ================= */}
      <SlotModal
        show={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        availableDates={availableDates}
        availableSlots={availableSlots}
        onSelectSlot={handleSlotSelect}
      />

      {/* ================= LIGHTBOX MODAL ================= */}
      <Modal
        show={showGallery}
        onHide={closeGallery}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Body className="p-0 position-relative">
          <Button
            variant="light"
            onClick={closeGallery}
            className="position-absolute top-0 end-0 m-2 rounded-circle border"
          >
            ✕
          </Button>
          <img
            src={salon.galleryImages[currentImageIdx]}
            alt="Gallery"
            className="w-100"
            style={{ objectFit: "cover", maxHeight: "70vh" }}
          />
          <Button
            variant="light"
            onClick={prevImage}
            className="position-absolute top-50 start-0 translate-middle-y border rounded-circle"
          >
            ◀
          </Button>
          <Button
            variant="light"
            onClick={nextImage}
            className="position-absolute top-50 end-0 translate-middle-y border rounded-circle"
          >
            ▶
          </Button>
        </Modal.Body>
      </Modal>

      {/* ================= CUSTOM CSS ================= */}
      <style>
        {`
          .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }
          .cursor-pointer {
            cursor: pointer;
          }
        `}
      </style>
    </Container>
  );
};

export default SalonDetails;
