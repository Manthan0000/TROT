# Demo Chat Setup Guide

## Overview
This guide will help you set up a demo chat with two pre-configured accounts so you can test the chat feature immediately.

## Setup Instructions

### Step 1: Run the Demo Chat Seeder

Navigate to the Backend directory and run the seed script:

```bash
cd TROT/Backend
npm run seed:chat
```

This will create:
- **2 demo user accounts** (Alice and Bob)
- **A complete chat conversation** with 7 messages
- **A pending chat request** for testing

### Step 2: Login Credentials

After running the seed script, you'll get these demo accounts:

**Account 1: Alice**
- Email: `alice@demo.com`
- Password: `demo123`
- Avatar: Random profile image

**Account 2: Bob**
- Email: `bob@demo.com`
- Password: `demo123`
- Avatar: Random profile image

### Step 3: Test the Chat Feature

1. **Start your backend server:**
   ```bash
   cd TROT/Backend
   npm start
   ```

2. **Start your frontend app:**
   ```bash
   cd TROT
   npm start
   ```

3. **Login with one of the accounts:**
   - Go to the login screen
   - Use either `alice@demo.com` or `bob@demo.com` with password `demo123`

4. **Access the Chat feature:**
   - Navigate to the Chat/Session screen
   - You should see:
     - A chat conversation between Alice and Bob with 7 pre-loaded messages
     - A pending chat request (depending on which account you logged into)

### What You'll See

#### In the Chat List
- A conversation between Alice and Bob
- Last message preview
- Message timestamp
- Unread badge (if any unread messages)

#### In the Chat Screen
- Full conversation history with 7 messages
- Messages aligned to left (Bob) and right (Alice) sides
- Message timestamps
- Typing indicator ready for new messages

#### Chat Requests
- One pending request for testing
- Accept/Reject buttons

## Features to Test

✅ View chat list
✅ Open existing chat
✅ Send new messages
✅ Accept/Reject chat requests
✅ See unread message badges
✅ Message timestamps

## Adding More Demo Data

To add more demo chats, edit `TROT/Backend/seedDemoChat.js`:

```javascript
// Add more users
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
  // Add more users here
];

// Add more messages
const demoMessages = [
  { content: "Your message here", senderIndex: 0 },
  // Add more messages here
];
```

Then run `npm run seed:chat` again.

## Resetting Demo Data

To clear all demo data and start fresh:

```bash
cd TROT/Backend
npm run seed:chat
```

This will delete all existing demo users and chats, then recreate them.

## Notes

- Demo users use simple passwords for testing only
- The avatars use placeholder image URLs (pravatar.cc)
- Messages are timestamped with realistic delays
- Some messages are marked as unread for testing

## Troubleshooting

**Error: Cannot find module 'bcryptjs'**
```bash
cd TROT/Backend
npm install bcryptjs
```

**Error: MongoDB connection failed**
- Make sure MongoDB is running
- Check your `.env` file has correct `MONGO_URI`

**No chat visible**
- Make sure you're logged in with one of the demo accounts
- Check that the seed script ran successfully
- Restart the backend server

## Next Steps

After testing with demo accounts:
1. Set up proper user authentication
2. Implement user ID tracking from auth context
3. Replace demo avatars with user uploads
4. Add real-time features (WebSocket/Socket.io)

