import {useEffect, useState} from "react";
import "./List.css";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom"; // Import navigate function

const List = ({url}) => {
  const [list, setList] = useState([]);
  var firstTime = true;
  const navigate = useNavigate(); // Initialize navigate

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);

    if (response.data.success) {
      setList(response.data.data);
      
      if (firstTime) {
        toast.success(`Here your requested Data`);
        firstTime = false;
      }
    } else {
      toast.error(`Unable to Fetch data 
        Please Try Again Later🙏`);
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {id: foodId});
    firstTime = false;
    await fetchList();

    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Delete</b>
          <b>Edit</b>
        </div>

        {list.map((item, index) => (
          
          <div key={index} className="list-table-format">
            <img src={`${url}/images/` + item.image} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <div className="actions">
              <p onClick={() => removeFood(item._id)} className="cursor edit-btn">
                X
              </p>
            </div>
              <button
                onClick={() =>
                  
                  navigate("/add", {state: {...item}})
                } // Pass item data to Add page
                className="cursor edit-btn"
              >
                Edit
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;