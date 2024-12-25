import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./PlaceOrder.css";
import {StoreContext} from "../../context/StoreContext";

import {toast} from "react-toastify";
const PlaceOrder = () => {
  const {getTotalCartAmount, token, food_list, cartItems, url} =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [error, setError] = useState(null);

  const onChangeHandler = (event) => {
    const {name, value} = event.target;
    setData((prevData) => ({...prevData, [name]: value}));
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const placeOrder = async (event) => {
    event.preventDefault();
    try {
      const orderItems = food_list
        .filter((item) => cartItems[item._id] > 0)
        .map((item) => ({
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        }));

      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2, // Include delivery fee
      };

      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: {token},
      });

      if (response.data.success) {
        const razorpayOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.data.data.amount, // Amount in paise
          currency: response.data.data.currency,
          name: "Anurag's Store",
          description: "Order Payment",
          order_id: response.data.data.id, // Order ID from backend
          handler: async (paymentResponse) => {
            try {
              const verifyResponse = await axios.post(
                `${url}/api/order/verify`,
                {
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  orderId: response.data.orderId,
                },
                {headers: {token}}
              );

              if (verifyResponse.data.success) {
                toast.success("Payment Successful!");
                navigate("/myorders");
              } else {
                toast.error(
                  "Payment verification failed. Please contact support."
                );
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error("Error in verifying payment. Please try again.");
            }
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#5f63b8",
          },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while placing the order.");
      console.error("PlaceOrder error:", err);
    }
  };

  const totalCartAmount = getTotalCartAmount();
  const deliveryFee = totalCartAmount === 0 ? 0 : 2;
  const totalAmount = totalCartAmount + deliveryFee;

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${totalCartAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${totalAmount}</b>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
