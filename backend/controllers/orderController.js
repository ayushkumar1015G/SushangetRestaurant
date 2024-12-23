import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";
import razorpay from "razorpay";

const {RAZORPAY_ID_KEY , RAZORPAY_SECRET_KEY} =process.env
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend

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

    const line_items = req.body.items.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

          //Delivery charges add krne ho toh 

    // line_items.push({
    //   price_data: {
    //     currency: "inr",
    //     product_data: {
    //       name: "Delivery Charges",
    //     },
    //     unit_amount: 2 * 100,
    //   },
    //   quantity: 1,
    // });

    // const session = await stripe.checkout.sessions.create({
    //     line_items:line_items,
    //     mode: 'payment',
    //     success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    //     cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    // })

    
    const instance = new Razorpay({
      key_id: RAZORPAY_ID_KEY,
      key_secret: RAZORPAY_SECRET_KEY,
    });

    const totalAmount = line_items.reduce((acc, item) => {
      return acc + (item.price_data.unit_amount) * item.quantity; 
    }, 0);

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: newOrder._id,
    }

    instance.orders.create(options, (error,order)=>{
      if(error){
        console.log(error);
          return res.status(500).json({message:"Something Went Wrong"});
        }
        else{
          res.status(200).json({data:order, success: true, session_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`});
        }
    })
    // res.json({success: true, session_url: success_url"});
  } catch (error) {
    console.log(error);
    res.json({success: false, error: "Error in placing order"});
  }
};

const verifyOrder = async (req, res) => {
  
  try {
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature,orderId, success} = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
      await orderId.findByIdAndUpdate(orderId, {payment: true});
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}

    // if (success == "true") {
    //   await orderId.findByIdAndUpdate(orderId, {payment: true});
    //   res, json({success: true, message: "Paid"});
    // } else {
    //   await orderModel.findByIdAndDelete(orderId);
    //   res.json({success: false, message: "Payment Unsuccessful!!"});
    // }
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in verifying the payment"});
  }
};

//user Order for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({userId: req.body.userId});
    console.log("Inside userOrders ", orders);
    res.json({success: true, data: orders});
  } catch (error) {
    console.log("Error");
    res.json({success: false, message: "Error"});
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

export {placeOrder, verifyOrder, userOrders, listOrder, updateOrderStatus};
