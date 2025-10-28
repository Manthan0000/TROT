const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Chat = require("./models/Chat");
const Message = require("./models/Message");
const ChatRequest = require("./models/ChatRequest");
require("dotenv").config();

// Demo data
const demoUsers = [
  {
    name: "Alice Johnson",
    email: "alice@demo.com",
    password: "demo123",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Bob Smith",
    email: "bob@demo.com",
    password: "demo123",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
];

const demoMessages = [
  {
    content: "Hey Bob! How's it going? 👋",
    senderIndex: 0, // Alice
  },
  {
    content: "Hi Alice! I'm doing great, thanks for asking! How about you?",
    senderIndex: 1, // Bob
  },
  {
    content: "Awesome! I just finished a new project. Want to hear about it?",
    senderIndex: 0,
  },
  {
    content: "Absolutely! I'd love to hear about it! 😊",
    senderIndex: 1,
  },
  {
    content: "It's a mobile app for skill sharing. Pretty exciting! Would you be interested in testing it?",
    senderIndex: 0,
  },
  {
    content: "That sounds amazing! I'm definitely interested. Can you send me more details?",
    senderIndex: 1,
  },
  {
    content: "Sure! I'll send you the details tomorrow. Looking forward to your feedback! 🚀",
    senderIndex: 0,
  },
];

async function seedDemoChat() {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️ Clearing existing demo data...");
    await User.deleteMany({ email: { $in: demoUsers.map((u) => u.email) } });
    await Chat.deleteMany({});
    await Message.deleteMany({});
    await ChatRequest.deleteMany({});

    // Create users
    console.log("👥 Creating demo users...");
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`   Created user: ${user.name} (${user.email})`);
    }

    // Create a chat between Alice and Bob
    console.log("💬 Creating demo chat...");
    const chat = await Chat.create({
      participants: [createdUsers[0]._id, createdUsers[1]._id],
    });

    // Create messages
    console.log("📝 Creating demo messages...");
    let lastMessage = null;
    for (const msgData of demoMessages) {
      const message = await Message.create({
        chat: chat._id,
        sender: createdUsers[msgData.senderIndex]._id,
        content: msgData.content,
        read: msgData.senderIndex === 1 ? false : true, // Bob's messages unread by Alice
      });
      lastMessage = message;
      
      // Add delay between messages
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Update chat with last message
    chat.lastMessage = lastMessage._id;
    chat.lastMessageTime = lastMessage.createdAt;
    await chat.save();

    console.log(`   Created ${demoMessages.length} messages`);

    // Create a pending chat request (for testing)
    console.log("📨 Creating a pending chat request...");
    const pendingUser = await User.findOne({ email: "alice@demo.com" });
    if (pendingUser) {
      await ChatRequest.create({
        sender: pendingUser._id,
        receiver: createdUsers[1]._id,
        status: "pending",
        message: "Hi! I'd like to connect with you.",
      });
      console.log("   Created pending request");
    }

    console.log("\n✅ Demo chat data seeded successfully!");
    console.log("\n📋 Demo Account Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`👤 Account 1: Alice`);
    console.log(`   Email: ${demoUsers[0].email}`);
    console.log(`   Password: ${demoUsers[0].password}`);
    console.log("\n👤 Account 2: Bob");
    console.log(`   Email: ${demoUsers[1].email}`);
    console.log(`   Password: ${demoUsers[1].password}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🚀 You can now test the chat feature with these credentials!");
    console.log("   Use them to log in through your app's login screen.\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
    process.exit(1);
  }
}

// Run the seed script
seedDemoChat();

