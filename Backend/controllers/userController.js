const User = require("../models/User");

// Search users by name or email
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query; // search query
    const currentUserId = req.user; // current user making the search

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    // Search users by name or email (excluding current user)
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } }, // case-insensitive
        { email: { $regex: q, $options: "i" } },
      ],
      _id: { $ne: currentUserId }, // exclude current user
    })
      .select("name email avatarUrl")
      .limit(20); // limit results

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("name email avatarUrl");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (for demo/testing purposes)
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("name email avatarUrl")
      .limit(50);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

