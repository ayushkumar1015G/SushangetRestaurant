// import foodModel from "../models/foodModel.js";
// import fs from "fs";

// //add food items

// const addFood = async (req, res) => {
//   try {
//     let image_filename = `${req.file.filename}`;
//     // console.log(`the image file new name = ${req.file.filename}`); //sahi hai
//     const {name, description, price, category} = req.body;
//     const food = new foodModel({
//       name: name,
//       description: description,
//       price: price,
//       category: category,
//       image: image_filename,
//     });

//     await food.save(); //to save changes to db
//     return res.json({success: true, message: "Food Item added succesfully"});
//   } catch (error) {
//     return res.json({success: false, error: error.message});
//   }
// };

// //show all food list

// const listFood = async (req, res) => {
//   try {
//     const foods = await foodModel.find({});
//     // console.log(foodList);
//     return res.json({success: true, data: foods});
//   } catch (error) {
//     console.log(error);
//     res.json({success: false, message: "Error in showing food list"});
//   }
// };


// //remove food items
// const removeFood = async (req, res) => {
//   try {
//     const food = await foodModel.findById(req.body.id);

//     if (!food) return res.json({success: false, message: "Food not exists"});

//     await fs.unlink(`uploads/${food.image}`, () => {}); //await necessary for unlink

//     await foodModel.findByIdAndDelete(req.body.id);
//     return res.json({success: true, message: "Food is removed successfully"});
//   } catch (error) {
//     return res.json({success: false, message: "Error in removing"});
//   }
// };

// export {addFood, listFood, removeFood};


import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food items
const addFood = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;
    const {name, description, price, category} = req.body;
    const food = new foodModel({
      name: name,
      description: description,
      price: price,
      category: category,
      image: image_filename,
    });

    await food.save();
    return res.json({success: true, message: "Food Item added successfully"});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
};

// Show all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    return res.json({success: true, data: foods});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in showing food list"});
  }
};

// Remove food items
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) return res.json({success: false, message: "Food not exists"});

    await fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    return res.json({success: true, message: "Food is removed successfully"});
  } catch (error) {
    return res.json({success: false, message: "Error in removing"});
  }
};

// Update food items
const updateFood = async (req, res) => {
  try {
    const {id, name, description, price, category} = req.body;
    // console.log("Updating food " , id);
    const food = await foodModel.findById({_id:id});
    
    if (!food) {
      return res.json({success: false, message: "Food item not found"});
    }
    
    food.name = name || food.name;
    food.description = description || food.description;
    food.price = price || food.price;
    food.category = category || food.category;
    
    if (req.file) {
      await fs.unlink(`uploads/${food.image}`, () => {});
      food.image = req.file.filename;
    }
    
    await food.save();
    return res.json({success: true, message: "Food item updated successfully"});
  } catch (error) {
    return res.json({success: false, message: "Error updating food item", error: error.message});
  }
};

export {addFood, listFood, removeFood, updateFood};
