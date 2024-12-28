import "./Order.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [ordersByDate, setOrdersByDate] = useState({});
  const [filter, setFilter] = useState("All");
  const [grandTotal, setGrandTotal] = useState(0);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);

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

        setOrdersByDate(groupedOrders);
        calculateGrandTotal(groupedOrders);
        toast.success("Orders Fetched Successfully");
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    }
  };

  const calculateGrandTotal = (orders) => {
    let total = 0;
    Object.values(orders).forEach((dailyOrders) => {
      dailyOrders.forEach((order) => {
        if (order.payment !== false) {
          total += order.amount;
        }
      });
    });
    setGrandTotal(total);
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

  const filterOrders = (orders) => {
    if (filter === "All") return orders;
    return orders.filter((order) => order.status === filter);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <div className="Heading">
        <h3>All Orders</h3>
        <h4>Grand Total: ${grandTotal.toFixed(2)}</h4>
        <br />
        <div className="filter-section">
          <label htmlFor="filter">Filter by Status: </label>
          <select
            id="filter"
            value={filter}
            className="filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Food Processing">Food Processing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>
      <br />
      <hr />
      <br />
      <br />
      <div className="order-list">
        {Object.entries(ordersByDate).map(([date, orders]) => {
          const filteredOrders = filterOrders(orders).filter(
            (order) => order.payment !== false
          );
          if (filteredOrders.length === 0) return null;

          const dailyTotal = filteredOrders.reduce(
            (sum, order) => sum + order.amount,
            0
          );

          return (
            <div key={date} className="order-date-section">
              <div className="date-category">
                <h4>{date}</h4>
                <h4>- Total: ${dailyTotal.toFixed(2)}</h4>
              </div>
              {filteredOrders.map((order, index) => (
                <div key={index} className="order-item">
                  <img src={assets.parcel_icon} alt="" />
                  <div>
                    <p className="order-item-food">
                      {order.items.map(
                        (item, idx) =>
                          `${item.name} x ${item.quantity}$${
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
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
