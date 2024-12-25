import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// const {RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY} = process.env;

const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.amount * 100, // Amount in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      data: order,
      success: true,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.json({success: false, error: "Error in placing order"});
  }
};

// Verify Order
const verifyOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await orderModel.findByIdAndUpdate(orderId, {payment: true});
      return res
        .status(200)
        .json({success: true, message: "Payment verified successfully"});
    } else {
      return res
        .status(400)
        .json({success: false, message: "Invalid signature sent!"});
    }
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in verifying the payment"});
  }
};

// Fetch user orders
const userOrders = async (req, res) => {
  try {
    const token = req.body.token;
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(tokenDecode);
    const orders = await orderModel.find({userId: tokenDecode.id});
    res.json({success: true, data: orders});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in fetching orders"});
  }
};

//listing order for admin panel

const listOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success: true, data: orders});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in showing order list"});
  }
};

//api for updating order status

const updateOrderStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({success: true, message: "Order status updated successfully"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in updating order status"});
  }
};

const removeOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({success: true, message: "Order deleted successfully"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in deleting order"});
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrder,
  updateOrderStatus,
  removeOrder,
};
