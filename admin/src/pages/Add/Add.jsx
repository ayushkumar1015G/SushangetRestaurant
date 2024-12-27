import React, {useState, useEffect} from "react";
import "./Add.css";
import {assets} from "../../assets/assets";
import axios from "axios";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom"; // Import useLocation

const Add = ({url}) => {
  const location = useLocation();
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (location.state) {
      const item = location.state;
      setData({
        id:item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
      });
      setImage(item.image); // Set image if passed
    }
  }, [location.state]);

  const onchangeHandler = (event) => {
    const {name, value} = event.target;
    setData((prevData) => ({...prevData, [name]: value}));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id",data.id);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("image", image);

    const apiUrl = location.state
      ? `${url}/api/food/update` // Update API for editing
      : `${url}/api/food/add`; // Add API for adding new item

    const response = await axios.post(apiUrl, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);
      setIsCustom(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={
                image
                  ? typeof image === "string"
                    ? `${url}/images/${image}`
                    : URL.createObjectURL(image)
                  : assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            type="file"
            id="image"
            hidden={!location.state}
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onchangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Enter Product Name"
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onchangeHandler}
            value={data.description}
            name="description"
            placeholder="Enter Product Description"
            rows="6"
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select
              onChange={(e) => {
                if (e.target.value === "Custom") {
                  setIsCustom(true);
                  setData((prevData) => ({...prevData, category: ""}));
                } else {
                  setIsCustom(false);
                  setData((prevData) => ({
                    ...prevData,
                    category: e.target.value,
                  }));
                }
              }}
              name="category"
              value={isCustom ? "Custom" : data.category}
            >
              <option value="Noodles">Noodles</option>
              <option value="Desserts">Desserts</option>
              <option value="Pasta">Pasta</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Cake">Cake</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Rolls">Rolls</option>
              <option value="Salad">Salad</option>
              <option value="Custom">Custom</option>
            </select>

            {isCustom && (
              <input
                type="text"
                name="category"
                placeholder="Enter Custom Category"
                onChange={onchangeHandler}
                value={data.category}
                className="custom-category-block"
              />
            )}
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onchangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="0 Rs."
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          {location.state ? "UPDATE" : "ADD"} {/* Update button text */}
        </button>
      </form>
    </div>
  );
};

export default Add;