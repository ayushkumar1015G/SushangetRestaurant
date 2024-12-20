import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

//Routers import
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


// app config
const app = express();
const PORT = 4000;
// middleware
dotenv.config();
app.use(express.json());
app.use(cors());

// db connection

connectDB();

app.get("/", (req, res) => {
  res.send("Hare krishna buddy");
});

// Routes
//api endpoints
app.use("/api/food", foodRouter); // handle food related queries add,
app.use("/api/user", userRouter); // handle user related queries add
app.use("/api/cart", cartRouter); // handle cart related queries add
app.use("/images", express.static("uploads"));
app.use("/api/order", orderRouter); // handle order related queries add

// Start the server

app.listen(PORT, () => {
  console.log(`listening on port = ${PORT}`);
});
