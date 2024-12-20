import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/sidebar/sidebar.jsx";
import {Route, Routes} from "react-router-dom";
import Add from "./pages/Add/Add.jsx";
import List from "./pages/List/List.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import {ToastContainer} from "react-toastify";

const App = () => {
  const url = "http://localhost:4000";
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/List" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
