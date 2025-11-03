const Chat = require("../models/Chat");
const Message = require("../models/Message");
const ChatRequest = require("../models/ChatRequest");
let User;
try {
  User = require("../models/User");
} catch {}

// Send a chat request
exports.sendChatRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user; // req.user is the user ID from auth middleware

    // Check if request already exists
    const existingRequest = await ChatRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Chat request already exists" });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.status(400).json({ error: "Chat already exists" });
    }

    const chatRequest = await ChatRequest.create({
      sender: senderId,
      receiver: receiverId,
      message: message || "",
    });

    // Populate sender details
    await chatRequest.populate("sender", "name email avatarUrl");

    res.status(201).json(chatRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat requests
exports.getChatRequests = async (req, res) => {
  try {
    const userId = req.user;

    const requests = await ChatRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "name email avatarUrl");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept/Reject chat request
exports.respondToChatRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // "accept" or "reject"

    const chatRequest = await ChatRequest.findById(requestId);

    if (!chatRequest) {
      return res.status(404).json({ error: "Chat request not found" });
    }

    if (chatRequest.receiver.toString() !== req.user.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (action === "accept") {
      chatRequest.status = "accepted";

      // Create a chat
      const chat = await Chat.create({
        participants: [chatRequest.sender, chatRequest.receiver],
      });

      // Update request with chat reference
      chatRequest.chatId = chat._id;
      await chatRequest.save();

      res.json({ chatRequest, chat });
    } else if (action === "reject") {
      chatRequest.status = "rejected";
      await chatRequest.save();
      res.json({ message: "Chat request rejected" });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user chats
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name email avatarUrl")
      .populate("lastMessage")
      .sort({ lastMessageTime: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get messages for a chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user;

    // Verify user is a participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatarUrl")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const userId = req.user;

    // Verify user is a participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Create message
    const message = await Message.create({
      chat: chatId,
      sender: userId,
      content,
    });

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageTime = Date.now();
    await chat.save();

    // Populate sender for response
    await message.populate("sender", "name email avatarUrl");

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user;

    // Mark all unread messages in this chat as read
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        read: false,
      },
      {
        read: true,
        readAt: Date.now(),
      }
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear all messages in a chat (but keep the chat)
exports.clearChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete all messages but keep the chat
    await Message.deleteMany({ chat: chatId });
    
    // Reset chat's last message
    chat.lastMessage = null;
    chat.lastMessageTime = Date.now();
    chat.unreadCount = new Map();
    await chat.save();

    res.json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a chat (and its messages) for participants
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete messages first, then the chat
    await Message.deleteMany({ chat: chatId });
    await Chat.findByIdAndDelete(chatId);

    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

