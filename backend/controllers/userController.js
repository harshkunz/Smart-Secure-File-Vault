exports.getProfile = async (req, res) => {
  res.status(200).json({
      msg: "successfully fetched user",
      user: req.user
    });
};