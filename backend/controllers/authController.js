const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '24h'});
    res.cookie('token', token);
    res.status(201).json({success:true, token, user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({success:false, message: 'Invalid email or password' });
      }
      
      const isCompared = await bcrypt.compare(password, user.password);
      if (!isCompared) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '24h'});
      res.cookie('token', token);
      res.status(200).json({success:true, token, user });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
};

exports.logout = async (req, res) => {
  try {

    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    await BlacklistedToken.create({ token });
    res.clearCookie('token'); 
    res.status(200).json({ msg: "Logout user" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
