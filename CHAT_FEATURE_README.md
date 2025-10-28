# Chat Feature Implementation

## Overview
A complete real-time chat feature has been added to the TROT application, allowing users to send chat requests, communicate with other users, and manage their conversations.

## Backend Components

### Models
- **Chat.js** - Stores chat conversations between users
- **Message.js** - Stores individual messages in chats
- **ChatRequest.js** - Stores pending chat requests

### API Endpoints

#### Chat Routes (`/api/chat`)
- `POST /api/chat/request` - Send a chat request to another user
- `GET /api/chat/requests` - Get pending chat requests for current user
- `PATCH /api/chat/request/:requestId` - Accept or reject a chat request
- `GET /api/chat/user/:userId` - Get all chats for a user
- `GET /api/chat/:chatId/messages` - Get messages for a specific chat
- `POST /api/chat/message` - Send a message in a chat
- `PATCH /api/chat/:chatId/read` - Mark messages as read

### Setup
1. Install dependencies (already installed):
   ```bash
   cd TROT/Backend
   npm install
   ```

2. Make sure your MongoDB connection is configured in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

## Frontend Components

### New Components Created
1. **ChatsDashboard** (`app/screens/Chats/index.tsx`) - Main chat list view
2. **ChatList** (`app/screens/Chats/ChatList.tsx`) - Displays all user chats
3. **ChatRequests** (`app/screens/Chats/ChatRequests.tsx`) - Shows pending chat requests
4. **ChatScreen** (`app/screens/Chats/ChatScreen.tsx`) - Individual chat conversation view

### Navigation
Chat routes are registered in `App.tsx`:
- `/Chats` - Chat list screen
- `/ChatScreen` - Individual chat screen

## Important Notes

### Authentication
The chat feature requires user authentication. Currently, the following need to be configured:

1. **User ID** - Replace `"CURRENT_USER_ID"` with actual user ID from auth context:
   - In `app/screens/Chats/index.tsx` (line 13)
   - In `app/screens/Chats/ChatScreen.tsx` (line 54)

2. **Auth Token** - Add authentication header to API calls:
   ```typescript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   const token = await AsyncStorage.getItem('token');
   const headers = { 'Authorization': `Bearer ${token}` };
   ```

### Polling
The current implementation uses polling for real-time updates:
- Chat list refreshes every 5 seconds
- Messages in chat screen refresh every 2 seconds

For production, consider implementing WebSocket/Socket.io for real-time messaging.

## Usage

1. **Send a Chat Request**
   ```javascript
   POST /api/chat/request
   Body: { receiverId: "user_id", message: "Optional message" }
   ```

2. **View Chat Requests**
   - Pending requests appear at the top of the Chat screen
   - Accept or reject requests

3. **Start Chatting**
   - Accepted requests create a new chat
   - Click on a chat to open the conversation screen
   - Type and send messages

## Styling
Components use the theme context for colors:
- Supports dark/light themes
- Uses theme.text, theme.background, theme.textSecondary

## API Functions Added
- `getJson(path, headers)` - GET requests
- `patchJson(path, body, headers)` - PATCH requests
- Both added to `lib/api.ts` and exported from `app/utils/api.ts`

## Next Steps (Optional Enhancements)
1. Add WebSocket support for real-time messaging without polling
2. Add file/image sharing in chats
3. Add typing indicators
4. Add message reactions
5. Add search functionality in chat list
6. Add push notifications for new messages
7. Add read receipts and "last seen" status

