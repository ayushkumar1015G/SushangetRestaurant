import {useContext, useEffect, useState} from "react";
import "./MyOrders.css";
import {StoreContext} from "../../context/StoreContext";
import axios from "axios";
import {assets} from "../../assets/assets";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const {url, token, setCartItems} = useContext(StoreContext);
  const navigate = useNavigate();

  // Function to fetch user orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {token: token}
      );
      if (response.data.success) {
        const sortedOrders = response.data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const groupedOrders = sortedOrders.reduce((acc, order) => {
          const orderDate = new Date(order.date).toLocaleDateString();
          if (!acc[orderDate]) {
            acc[orderDate] = [];
          }
          acc[orderDate].push(order);
          return acc;
        }, {});
        setData(groupedOrders || {});
        setCartItems([]);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Unauthorized! Redirecting to login.");
        navigate("/login"); // Redirect to login page if unauthorized
      } else {
        console.error("Error fetching orders:", error);
      }
    }
  };

  // Fetch orders on component mount or when token changes
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {Object.entries(data).length > 0 ? (
          Object.entries(data).map(([date, orders]) => (
            <div key={date} className="order-date-section">
              <h4>{date}</h4>
              {orders.map((order, index) => (
                <div key={index} className="my-orders-order">
                  <img src={assets.parcel_icon} alt="Parcel Icon" />
                  <p>
                    {order.items.map((item, itemIndex) => (
                      <span key={itemIndex}>
                        {item.name} x {item.quantity}
                        {itemIndex !== order.items.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                  <p>₹{order.amount}.00</p>
                  <p>Items: {order.items.length}</p>
                  <p>
                    <span>&#x25cf;</span> <b>{order.status}</b>
                  </p>
                  <button
                    onClick={() => {
                      fetchOrders();
                    }}
                  >
                    Track Order
                  </button>
                  
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
