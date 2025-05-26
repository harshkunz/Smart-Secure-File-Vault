const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const BlacklistedToken = require("../models/BlacklistedToken");


module.exports = async (req, res, next) => {
  
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if(!token) {
    return res.status(401).json({ msg: 'Unauthorized access' });
  }

  const isBlacklisted = await BlacklistedToken.findOne({ token : token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Unauthorized access expired token' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id) 
    req.user = user;
    return next();

  } catch (err) {
    return res.status(403).json({ msg: 'Unauthorized access' });
  }
};
