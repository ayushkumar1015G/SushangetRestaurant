import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/sidebar/sidebar.jsx";
const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
      </div>
    </div>
  );
};

export default App;
