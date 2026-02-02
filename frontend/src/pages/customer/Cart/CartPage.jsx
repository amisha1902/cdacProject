import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt, FaMinus, FaPlus, FaClock, FaCalendarAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import ProgressTracker from "../../../components/ProgressTracker";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("/api/cart/getCart", {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartId(res.data.cartId);

      const items = res.data.items?.map(item => ({
        id: item.itemId,
        serviceId: item.serviceId,
        name: item.serviceName || "Service",
        date: item.date || "",
        time: item.time || "",
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: "https://via.placeholder.com/100?text=Service",
      })) || [];

      setCart(items);
      setError("");
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart items");
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, updateData) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.put(`/api/cart/update/${itemId}`, updateData, {
        headers: { Authorization: `Bearer ${token}`, "X-USER-ID": userId },
      });

      setCart(items =>
        items.map(i => i.id === itemId ? { ...i, ...res.data } : i)
      );
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error("Failed to update cart item:", err);
      alert(err.response?.data?.message || "Failed to update item");
    }
  };

  const increaseQty = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    updateCartItem(itemId, { quantity: item.quantity + 1 });
  };

  const decreaseQty = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    if (item.quantity > 1) updateCartItem(itemId, { quantity: item.quantity - 1 });
  };

  const deleteItem = async (itemId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      await axios.delete(`/api/cart/delete/${itemId}`, {
        headers: { Authorization: `Bearer ${token}`, "X-USER-ID": userId },
      });
      setCart(items => items.filter(i => i.id !== itemId));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    if (!cartId) {
      alert("Cart not found. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/bookings/checkout", { cartId }, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      navigate("/confirmBooking", { state: { booking: res.data } });
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  if (loading) return <div className="container text-center py-5"><h2>Loading cart...</h2></div>;
  if (error) return <div className="container text-center py-5 text-danger"><h2>{error}</h2></div>;

  return (
    <div className="container py-5">
   {/* 0 = Cart, 1 = Payment, 2 = Booked! */}

      {cart.length === 0 ? (
        <div className="text-center my-5">
          <h3>Your cart is empty</h3>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/salonList")}>
            Browse Services
          </button>
        </div>
      ) : (
        
        <div className="row">
        <ProgressTracker currentStep={0} />
          <div className="col-lg-8">
            {cart.map(item => (
              <div key={item.id} className="card mb-3 shadow-sm">
                <div className="row g-0 align-items-center">
                  <div className="col-md-2">
                    <img src={item.image} className="img-fluid rounded-start" alt={item.name} />
                  </div>
                  <div className="col-md-7">
                    <div className="card-body p-3">
                      <h5 className="card-title mb-2">{item.name}</h5>
                      <div className="d-flex gap-3 mb-2 text-muted">
                        <span><FaCalendarAlt /> {item.date}</span>
                        <span><FaClock /> {item.time}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => decreaseQty(item.id)}><FaMinus /></button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => increaseQty(item.id)}><FaPlus /></button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 text-end pe-3">
                    <button className="btn btn-link text-danger p-0 mb-2" onClick={() => {
                      if (window.confirm('Remove this item from cart?')) deleteItem(item.id);
                    }}><FaTrashAlt size={20} /></button>
                    <p className="fw-bold fs-5">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm p-3 mb-3">
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button className="btn btn-danger w-100 mt-3" onClick={handleCheckout}>Proceed to Checkout</button>
              <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate("/salonList")}>Continue Browsing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
