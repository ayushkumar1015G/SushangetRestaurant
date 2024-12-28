import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const {token} = req.headers; // {} are required

  // console.log("token in auth middleware" + token);
  if (!token) {
    return res.json({success: false, message: "Not authorized , Login again."});
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(tokenDecode);
    req.body.userId = tokenDecode.id; // id se token bnaya tha
    next();
  } catch (error) {
    console.log("In Auth middleware" + " : " + error);
    return res.json({success: false, message: error.message});
  }
};

export default authMiddleware;
