import express from "express";
import authMiddleware from "../middleware/Auth.js";
import {
  placeOrder,
  userOrders,
  verifyOrder,
  listOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", userOrders);
orderRouter.get("/list", listOrder);
orderRouter.post("/status", updateOrderStatus);
export default orderRouter;
