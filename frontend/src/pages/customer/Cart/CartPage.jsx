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
    if (!userId || !token) return navigate("/login");

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
        image: "https://via.placeholder.com/120?text=Service",
      })) || [];
      setCart(items);
      setError("");
    } catch (err) {
      console.error(err);
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
      setCart(items => items.map(i => i.id === itemId ? { ...i, ...res.data } : i));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
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
        headers: { Authorization: `Bearer ${token}`, "USER-ID": userId },
      });
      setCart(items => items.filter(i => i.id !== itemId));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return navigate("/login");

    if (!window.confirm("Are you sure you want to clear all items from your cart? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete("http://localhost:8080/api/cart/clear", {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setCart([]);
      setCartId(null);
      window.dispatchEvent(new Event('cartUpdated'));
      alert("Cart cleared successfully!");
    } catch (err) {
      console.error("Clear cart error:", err);
      alert(err.response?.data?.message || "Failed to clear cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return navigate("/login");
    if (!cartId) return alert("Cart not found. Please try again.");

    console.log("Starting checkout for cart:", cartId);
    console.log("Cart items:", cart);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/api/bookings/checkout", { cartId }, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      
      console.log("Checkout successful, booking created:", res.data);
      navigate("/confirmBooking", { state: { booking: res.data } });
    } catch (err) {
      console.error("Checkout error:", err);
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
    <div className="container py-5" style={{ minWidth: "1024px" }}>
  {/* Progress Tracker */}
  <ProgressTracker currentStep={0} />

  {cart.length === 0 ? (
    <div className="text-center my-5">
      <h3>Your cart is empty</h3>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/salonList")}>
        Browse Services
      </button>
    </div>
  ) : (
    <div className="d-flex flex-lg-row flex-column gap-4 mt-4">
      {/* Cart Items */}
      <div className="flex-fill">
        {cart.map(item => (
          <div key={item.id} className="card mb-3 shadow-sm rounded-3 border-0">
            <div className="d-flex align-items-center p-3">
              {/* <div className="me-3" style={{ width: "120px", flexShrink: 0 }}>
                <img src={item.image} className="img-fluid rounded-3" alt={item.name} />
              </div> */}
              <div className="flex-fill">
                <h6 className="fw-semibold mb-2">{item.name}</h6>
                <div className="d-flex gap-3 text-muted small mb-2">
                  <span><FaCalendarAlt /> {item.date}</span>
                  <span><FaClock /> {item.time}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-outline-secondary btn-sm px-2" onClick={() => decreaseQty(item.id)}><FaMinus /></button>
                  <span className="fw-bold">{item.quantity}</span>
                  <button className="btn btn-outline-secondary btn-sm px-2" onClick={() => increaseQty(item.id)}><FaPlus /></button>
                </div>
              </div>
              <div className="text-end ms-3" style={{ width: "80px", flexShrink: 0 }}>
                <button className="btn btn-link text-danger p-0 mb-2" onClick={() => {
                  if (window.confirm('Remove this item from cart?')) deleteItem(item.id);
                }}><FaTrashAlt size={18} /></button>
                <p className="fw-bold fs-6">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div style={{ minWidth: "300px", maxWidth: "350px" }}>
        <div className="card shadow-sm rounded-3 p-4 sticky-top" style={{ top: "20px" }}>
          <h6 className="fw-bold mb-3">Order Summary</h6>
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button className="btn btn-danger w-100 mb-2" onClick={handleCheckout}>Proceed to Checkout</button>
          <button className="btn btn-outline-secondary w-100 mb-2" onClick={() => navigate("/salonList")}>Continue Browsing</button>
          {cart.length > 0 && (
            <button className="btn btn-outline-danger w-100" onClick={clearCart}>Clear Cart</button>
          )}
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default CartPage;
