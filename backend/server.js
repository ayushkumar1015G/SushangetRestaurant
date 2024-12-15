import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

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

app.listen(PORT, () => {
  console.log(`listening on port = ${PORT}`);
});
