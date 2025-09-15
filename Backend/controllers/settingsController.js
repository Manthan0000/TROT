const User = require("../models/User");

// Update user settings (example: name, email)
exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
