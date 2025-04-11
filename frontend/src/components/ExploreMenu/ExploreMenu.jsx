import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets.js";
function ExploreMenu({ category, setCategory }) {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        – A delightful journey of pure, Sattvik flavors!
        <div style={{ marginLeft: "60px" }}>
          <ul>
            <li>
              Wholesome traditional dishes prepared with fresh, natural
              ingredients
            </li>
            <li>Refreshing juices to revitalize and nourish your body</li>
            <li>
              Thoughtfully curated vegetarian options promoting balance and
              well-being
            </li>
            <li>
              Pure and delicious flavors crafted to enhance your dining
              experience
            </li>
          </ul>
        </div>
      </p>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
}

export default ExploreMenu;
