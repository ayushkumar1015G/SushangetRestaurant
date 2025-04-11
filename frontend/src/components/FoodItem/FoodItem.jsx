import {useContext} from "react";
import {useNavigate} from "react-router-dom"; // Import useNavigate for redirection
import {assets} from "../../assets/assets.js";
import "./FoodItem.css";
import {StoreContext} from "../../context/StoreContext";

function FoodItem({id, name, price, description, image}) {
  const {url, cartItems, addToCart, removeFromCart} = useContext(StoreContext);
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle Buy button click
  const handleBuyNow = () => {
    addToCart(id); // Add item to cart
    navigate("/cart"); // Redirect to cart page
  };

  return (
    <div>
      <div className="food-item">
        <div className="food-item-img-container">
          <img
            src={url + "/images/" + image}
            className="food-item-image"
            alt=""
          />
          {!cartItems[id] ? (
            <img
              className="add"
              onClick={() => addToCart(id)}
              src={assets.add_icon_white}
              alt=""
            />
          ) : (
            <div className="food-item-counter">
              <img
                onClick={() => removeFromCart(id)}
                src={assets.remove_icon_red}
                alt=""
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={() => addToCart(id)}
                src={assets.add_icon_green}
                alt=""
              />
            </div>
          )}
        </div>

        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
          </div>
          <p className="food-item-description">{description}</p>
          <p className="food-item-price">₹{price}</p>
          {/* Buy Now Button */}
          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodItem;
