// import express from "express";
// import {addFood, listFood, removeFood} from "../controllers/foodController.js";
// import multer from "multer";

// const foodRouter = express.Router();

// // Image storage configuration
// const storage = multer.diskStorage({
//   destination: "uploads", // Directory to store uploaded images
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Prepend timestamp for uniqueness
//   },
// });

// const upload = multer({storage}); // Create a Multer instance with the storage

// foodRouter.post("/add", upload.single("image"), addFood);
// foodRouter.get("/list", listFood);
// foodRouter.post("/remove", removeFood);

// export default foodRouter;


import express from "express";
import {addFood, listFood, removeFood, updateFood} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image storage configuration
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({storage});

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/update", upload.single("image"), updateFood); // New update route

export default foodRouter;
