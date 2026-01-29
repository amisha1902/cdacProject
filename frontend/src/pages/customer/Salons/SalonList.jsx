import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../context/SearchContext";

const SalonList = () => {
  const { search, location } = useSearch();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await axios.get("/api/salons", {
          params: { page: 0, size: 50, sort: "ratingAverage,desc" },
        });
        setSalons(response.data.content);
      } catch (err) {
        setError("Failed to fetch salons.");
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
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

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="text-center mt-5">
        <p>{error}</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      <Row className="g-3 justify-content-center">
        {filteredSalons.map((salon) => (
          <Col xs={12} sm={6} md={3} lg={3} key={salon.salonId}>
            <Card
              className="h-100 shadow-sm rounded-4 overflow-hidden border-0"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/salons/${salon.salonId}`)}
            >
              <Card.Img
                variant="top"
                src={salon.logo}
                alt={salon.salonName}
                className="img-fluid"
                style={{ height: "160px", objectFit: "cover" }}
              />

              <Card.Body className="d-flex flex-column justify-content-between p-3">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Card.Title
                      className="fw-bold mb-0"
                      style={{ fontSize: "1.2rem" }}
                    >
                      {salon.salonName}
                    </Card.Title>

                    <Badge
                      bg="success"
                      className="d-flex align-items-center gap-1 px-2 py-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {salon.ratingAverage.toFixed(1)} <StarFill size={10} />
                    </Badge>
                  </div>

                  <Card.Text
                    className="text-muted mb-1"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {salon.services?.join(", ") || "Hair, Skin, Nails"}
                  </Card.Text>

                  <Card.Text
                    className="text-muted mb-1"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {salon.address}, {salon.city}, {salon.state} -{" "}
                    {salon.pincode}
                  </Card.Text>

                  <Card.Text
                    className="text-danger mt-2"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Opens at {salon.openingTime?.slice(0, 5)} AM | Closes at{" "}
                    {salon.closingTime?.slice(0, 5)} PM
                  </Card.Text>
                </div>

                <Card.Text
                  className="text-end text-muted mt-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  {salon.totalReviews} Reviews
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SalonList;
