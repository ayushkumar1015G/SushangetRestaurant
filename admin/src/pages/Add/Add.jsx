import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios"
import { toast } from 'react-toastify';


const Add = ({url}) => {
    const [image,setImage] = useState(false);
    const [data,setData] = useState({
        name:"",
        description:"",
        price:"",
        category:"salad"
    });

    const onchangeHandler = (event) =>{
        const {name,value} = event.target;
        setData((prevData) => ({...prevData, [name]: value}));
    }

    const onSubmitHandler = async (event)=>{
        event.preventDefault();
        const formData=new FormData();
        formData.append("name",data.name);
        formData.append("description",data.description);
        formData.append("price",data.price);
        formData.append("category",data.category);
        formData.append("image",image);

        const response = await axios.post(`${url}/api/food/add`,formData);
        if(response.data.success){
            setData({
                name:"",
                description:"",
                price:"",
                category:"salad"
            })
            setImage(false);
            toast.success(response.data.message)
        }
        else{
            toast.error(response.data.message)
        }
        
    }

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => { setImage(e.target.files[0])}} type="file" id="image" hidden required />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Namce</p>
          <input onChange={onchangeHandler} value={data.name} type="text" name="name" placeholder="Enter Product Name" />
        </div>

        <div className="add-product-discription flex-col">
          <p>Product Discription</p>
          <textarea
            onChange={onchangeHandler} value={data.description}
            name="description"
            placeholder="Enter Product Discription"
            rows="6"
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select onChange={onchangeHandler} name="category">
              <option value="Kheer">Kheer</option>
              <option value="desert">desert</option>
              <option value="Rasmalai">Rasmalai</option>
              <option value="Gulab Jamun">Gulab Jamun</option>
              <option value="Jalebi">Jalebi</option>
              <option value="Barfi">Barfi</option>322
              <option value="Ladoo">Ladoo</option>
              <option value="Halwa">Halwa</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onchangeHandler} value={data.price} type="Number" name="price" placeholder="0 Rs." />
          </div>
        </div>


        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
