// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const CartPage = () => {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const USER_ID = 1;

//   const fetchCart = async () => {
//     try {
//       const res = await axios.get("/api/cart/getCart", {
//         params: { userId: USER_ID },
//       });
//       setCart(res.data);
//     } catch (err) {
//       console.error("Failed to fetch cart", err);
//       setCart({ items: [] }); // defensive fallback
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const updateItem = async (itemId, payload) => {
//     await axios.put(`/api/cart/update/${itemId}`, payload, {
//       params: { userId: USER_ID },
//     });
//     fetchCart();
//   };

//   const deleteItem = async (itemId) => {
//     await axios.delete(`/api/cart/delete/${itemId}`, {
//       params: { userId: USER_ID },
//     });
//     fetchCart();
//   };

//   const handleQtyChange = (item, delta) => {
//     const newQty = item.quantity + delta;
//     if (newQty < 1) return;

//     updateItem(item.itemId, {
//       quantity: newQty,
//       date: item.date,
//       time: item.time,
//     });
//   };

//   const getItemTotal = (item) => item.price * item.quantity;

//   const getCartTotal = () =>
//     cart?.items?.reduce((sum, item) => sum + getItemTotal(item), 0) || 0;

//   if (loading) return <div className="text-center mt-5">Loading cart...</div>;

//   if (!cart?.items?.length) {
//     return (
//       <div className="container mt-5 text-center">
//         <h5>Your cart is empty 🛒</h5>
//       </div>
//     );
//   }

//   return (
//     <div className="container my-4">
//       <div className="row justify-content-center">
//         <div className="col-lg-8 col-md-10 col-12">
//           <div className="card shadow-sm">
//             <div className="card-header bg-white fw-bold fs-5">
//               Your Cart
//             </div>

//             <div className="card-body">
//               {cart.items.map((item) => (
//                 <div
//                   key={item.itemId}
//                   className="border-bottom pb-3 mb-3 d-flex flex-column gap-2"
//                 >
//                   <div className="d-flex justify-content-between align-items-start">
//                     <div>
//                       <h6 className="mb-1">{item.serviceName}</h6>
//                       <p className="text-muted mb-1 small">
//                         {item.serviceDescription}
//                       </p>
//                     </div>

//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => deleteItem(item.itemId)}
//                     >
//                       ✕
//                     </button>
//                   </div>

//                   <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
//                     <div className="btn-group">
//                       <button
//                         className="btn btn-outline-secondary btn-sm"
//                         onClick={() => handleQtyChange(item, -1)}
//                       >
//                         −
//                       </button>
//                       <button className="btn btn-outline-secondary btn-sm" disabled>
//                         {item.quantity}
//                       </button>
//                       <button
//                         className="btn btn-outline-secondary btn-sm"
//                         onClick={() => handleQtyChange(item, 1)}
//                       >
//                         +
//                       </button>
//                     </div>

//                     <div className="fw-semibold">
//                       ₹{getItemTotal(item)}
//                     </div>
//                   </div>

//                   <div className="row g-2">
//                     <div className="col-6">
//                       <input
//                         type="date"
//                         className="form-control form-control-sm"
//                         value={item.date}
//                         onChange={(e) =>
//                           updateItem(item.itemId, {
//                             quantity: item.quantity,
//                             date: e.target.value,
//                             time: item.time,
//                           })
//                         }
//                       />
//                     </div>

//                     <div className="col-6">
//                       <input
//                         type="time"
//                         className="form-control form-control-sm"
//                         value={item.time}
//                         onChange={(e) =>
//                           updateItem(item.itemId, {
//                             quantity: item.quantity,
//                             date: item.date,
//                             time: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <div className="d-flex justify-content-between align-items-center border-top pt-3">
//                 <h6 className="mb-0">Total Amount</h6>
//                 <h5 className="mb-0 fw-bold">₹{getCartTotal()}</h5>
//               </div>
//             </div>

//             <div className="card-footer bg-white">
//               <button className="btn btn-success w-100 fw-semibold">
//                 Confirm Booking
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      itemId: 1,
      serviceName: "Haircut",
      serviceDescription: "Professional haircut by senior stylist",
      price: 250,
      quantity: 1,
      date: "2026-01-28",
      time: "14:00",
    },
    {
      itemId: 2,
      serviceName: "Facial Cleanup",
      serviceDescription: "Deep cleansing facial treatment",
      price: 600,
      quantity: 2,
      date: "2026-01-29",
      time: "16:30",
    },
  ]);

  const updateQuantity = (itemId, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const updateDate = (itemId, date) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, date } : item
      )
    );
  };

  const updateTime = (itemId, time) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, time } : item
      )
    );
  };

  const deleteItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const getItemTotal = (item) => item.price * item.quantity;
  const cartTotal = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h5>Your cart is empty 🛒</h5>
      </div>
    );
  }
  
const navigate = useNavigate();

  const handleConfirmBooking = () => {
    // Navigate to confirmBooking page
    navigate("/confirmBooking");
  };
  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold fs-5">
              Your Cart
            </div>

            <div className="card-body">
              {cartItems.map((item) => (
                <div
                  key={item.itemId}
                  className="border-bottom pb-3 mb-3 d-flex flex-column gap-2"
                >
                  {/* Top row */}
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{item.serviceName}</h6>
                      <p className="text-muted mb-1 small">
                        {item.serviceDescription}
                      </p>
                    </div>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteItem(item.itemId)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Quantity + price */}
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.itemId, -1)}
                      >
                        −
                      </button>
                      <button className="btn btn-outline-secondary btn-sm" disabled>
                        {item.quantity}
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.itemId, 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="fw-semibold">
                      ₹{getItemTotal(item)}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={item.date}
                        onChange={(e) =>
                          updateDate(item.itemId, e.target.value)
                        }
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="time"
                        className="form-control form-control-sm"
                        value={item.time}
                        onChange={(e) =>
                          updateTime(item.itemId, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart total */}
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <h6 className="mb-0">Total Amount</h6>
                <h5 className="mb-0 fw-bold">₹{cartTotal}</h5>
              </div>
            </div>

            <div className="card-footer bg-white">
      <button
        className="btn btn-success w-100 fw-semibold"
        onClick={handleConfirmBooking}
      >
        Confirm Booking
      </button>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
