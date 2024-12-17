import {useState} from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.jsx";
import Header from "../../components/Header/Header.jsx";
import "./Home.css";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";
function Home() {
  const [category, setCategory] = useState("All");
  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} setCategory={setCategory} />
    </div>
  );
}

export default Home;
