import userModel from "../models/userModel.js";

// add item to cart

const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById({_id: req.body.userId});
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId]++;
    }

    await userModel.findByIdAndUpdate(req.body.userId, {cartData: cartData});

    return res.json({success: true, message: "Added to cart"});
  } catch (error) {}
  return res.json({success: false, message: "Error in adding to cart"});
};

// remove item from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById({_id: req.body.userId});
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId]) {
      cartData[req.body.itemId]--;
      if (cartData[req.body.itemId] === 0) {
        delete cartData[req.body.itemId];
      }
    }
    await userModel.findByIdAndUpdate(req.body.userId, {cartData: cartData});
    return res.json({success: true, message: "Removed from cart"});
  } catch (err) {
    return res.json({success: false, message: "Error in removing from cart"});
  }
};

//fetch user cart data

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({success: true, cartData: cartData});
  } catch (error) {
    res.json({success: false, message: "Error in fetching cart data"});
  }
};

//export function

export {addToCart, removeFromCart, getCart};
