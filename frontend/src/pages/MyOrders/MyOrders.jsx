import {useContext, useEffect, useState} from "react";
import "./MyOrders.css";
import {StoreContext} from "../../context/StoreContext";
import axios from "axios";
import {assets} from "../../assets/assets";
import {useNavigate} from "react-router-dom";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const {url, token} = useContext(StoreContext);
  const navigate = useNavigate();

  // Function to fetch user orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        // {userId: "6763f2bac2e21f8ef0f6635e"}, // require used id but may be that come through payment
        {},
        // console.log(token),
        {headers: token} // Correct header
      );
      console.log("in fetchOrders" + response.data.message);

      if (response.data.success) {
        setData(response.data.data || []);
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
      console.log("hari and calleing fetched orders");
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length > 0 ? (
          data.map((order, index) => (
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
              <p>${order.amount}.00</p>
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
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
