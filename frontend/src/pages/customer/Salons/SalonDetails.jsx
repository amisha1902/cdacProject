import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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

const SalonDetails = () => {
  const { salonId } = useParams();

  const [salon, setSalon] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [services, setServices] = useState([]);

  const [loadingSalon, setLoadingSalon] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);

  /* ================= LIGHTBOX MODAL ================= */
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
      (prev) =>
        (prev - 1 + salon.galleryImages.length) % salon.galleryImages.length
    );

  /* ================= SALON DETAILS ================= */
  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await axios.get(`/api/salons/${salonId}`);
        setSalon(res.data);
        setCategories(res.data.categories || []);
        if (res.data.categories?.length > 0) {
          setSelectedCategoryId(res.data.categories[0].categoryId);
        }
      } catch (err) {
        console.error("Failed to load salon details", err);
      } finally {
        setLoadingSalon(false);
      }
    };
    fetchSalon();
  }, [salonId]);

  /* ================= SERVICES BY CATEGORY ================= */
  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const res = await axios.get(
          `/api/categories/${selectedCategoryId}/services`
        );
        setServices(res.data || []);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [selectedCategoryId]);

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
                src={salon.logo}
                roundedCircle
                width={80}
                height={80}
                alt={salon.salonName}
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
                  {/* Overlay text on last image */}
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
      <Row>
        <Col md={3} className="border-end">
          <h5 className="fw-bold mb-3">Select Categories</h5>
          <ListGroup variant="flush">
            {categories.map((cat) => (
              <ListGroup.Item
                key={cat.categoryId}
                action
                onClick={() => setSelectedCategoryId(cat.categoryId)}
                className={`fw-semibold mb-2 text-center ${
                  cat.categoryId === selectedCategoryId
                    ? "bg-danger text-white rounded-pill"
                    : "bg-light"
                }`}
                style={{ cursor: "pointer" }}
              >
                {cat.categoryName}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={9}>
          {loadingServices ? (
            <div className="text-center mt-5">
              <Spinner animation="border" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-muted">No services available.</p>
          ) : (
            <Row className="g-3">
              {services.map((service) => (
                <Col md={6} key={service.serviceId}>
                  <Card
                    className="border-0 shadow-sm rounded-3 h-100 p-3 service-card"
                    style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                  >
                    <div className="d-flex gap-3">
                      <img
                        src={
                          service.image ||
                          "https://via.placeholder.com/100x100?text=Service"
                        }
                        alt={service.serviceName}
                        className="rounded-3 object-fit-cover"
                        width="90"
                        height="90"
                      />

                      <div className="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                          <h6 className="fw-bold mb-1">
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
                            className="rounded-pill"
                            style={{ backgroundColor: "#dc3545", border: "none" }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

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
