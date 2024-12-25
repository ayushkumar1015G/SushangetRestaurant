import "./Order.css";
import {useState, useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {assets} from "../../assets/assets";

const Orders = ({url}) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });

      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated successfully");
      }
    } catch (error) {
      toast.error("An error occurred while updating order status");
    }
  };

  const removeOrder = async (order) => {
    try {
      const response = await axios.post(`${url}/api/order/remove`, {
        orderId: order._id,
      });
      if (response.data.success) {
        fetchAllOrders();
      } else {
        console.error("Failed to delete order:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>All Orders</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map(
                  (item, idx) =>
                    `${item.name} x ${item.quantity}${
                      idx === order.items.length - 1 ? "" : ", "
                    }`
                )}
              </p>

              <p className="order-item-name">
                {`${order.address.firstName} ${order.address.lastName}`}
              </p>
              <div className="order-item-address">
                <p>{`${order.address.street}, `}</p>
                <p>
                  {`${order.address.city}, ${order.address.state}, ${order.address.country} ${order.address.zipcode}`}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p className="">Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            {order.status === "Delivered" ? (
              <button
                className="my-orders-orderbutton"
                onClick={() => removeOrder(order)}
              >
                {" "}
                Remove
              </button>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

// <>
//   {" "}
//   <div key={index} className="my-orders-order">
//     <img src={assets.parcel_icon} alt="Parcel Icon" />
//     <p>
//       {order.items.map((item, itemIndex) => (
//         <span key={itemIndex}>
//           {item.name} x {item.quantity}
//           {itemIndex !== order.items.length - 1 && ", "}
//         </span>
//       ))}
//     </p>
//     <p>${order.amount}.00</p>
//     <p>Items: {order.items.length}</p>
//     <p>
//       <span>&#x25cf;</span> <b>{order.status}</b>
//     </p>
//     <button
//       onClick={() => {
//         removeOrder(order);
//       }}
//     >
//       Remove
//     </button>
//   </div>
// </>;
