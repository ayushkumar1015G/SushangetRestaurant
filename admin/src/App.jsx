import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/sidebar/sidebar.jsx";
import {Route, Routes} from 'react-router-dom'
import Add from "./pages/Add/Add.jsx";
import List from "./pages/List/List.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add/>}/>
          <Route path="/List" element={<List/>}/>
          <Route path="/orders" element={<Orders/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
