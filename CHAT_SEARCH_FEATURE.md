# Chat Search Feature - Complete Guide

## Overview
The chat feature now includes **two types of search**:
1. **Search for Users** - Find new users to chat with
2. **Search Existing Chats** - Filter your current conversations

## How to Use the Search Features

### 1. Search for New Users to Chat With

**Step 1: Access User Search**
- Open the Chat screen
- Click the **"+ New Chat"** button at the top right

**Step 2: Search for Users**
- Enter a search query (name or email)
- Press "Search" or hit Enter
- You'll see a list of matching users

**Step 3: Send a Chat Request**
- Click on any user from the search results
- A modal will pop up asking for an optional message
- Enter your message (or leave it empty)
- Click **"Send Request"**

**What Happens:**
- The other user receives a chat request
- They can accept or reject it
- Once accepted, a new chat is created

### 2. Search Within Your Chats

**How to Use:**
1. Open the Chat screen
2. You'll see a search box with a 🔍 icon at the top
3. Type to search among your existing chats

**What You Can Search For:**
- User names (case-insensitive)
- Email addresses
- Last message content

**Example Searches:**
- Type "alice" to find chats with Alice
- Type "bob" to find Bob's chat
- Type "hello" to find chats with "hello" in the last message

## API Endpoints Added

### User Search Endpoint
```
GET /api/users/search?q={query}
```
- Searches for users by name or email
- Returns up to 20 results
- Excludes current user

### Get User by ID
```
GET /api/users/:userId
```
- Get specific user details

### Get All Users
```
GET /api/users
```
- Get list of all users (for testing)

## Components Created

### Frontend Components:

1. **UserSearch.tsx** - Screen for searching and finding users
   - Search input field
   - User results list
   - Send request modal

2. **SendChatRequest.tsx** - Modal for sending chat requests
   - Optional message input
   - Character counter (200 max)
   - Send/Cancel buttons

3. **Updated ChatList** - Now supports filtering
   - Real-time search filtering
   - Search by user name, email, or message content

### Backend Components:

1. **userController.js** - Business logic for:
   - Searching users by name/email
   - Getting user by ID
   - Listing all users

2. **userRoutes.js** - API routes for user operations
   - All routes require authentication
   - Routes mounted at `/api/users`

## Testing the Search Feature

### Prerequisites:
1. Make sure backend is running on port 5000
2. You need at least one user account (run the demo seed if needed)
3. You should be logged in

### Test Scenarios:

#### Scenario 1: Search for Specific User
1. Go to Chat screen
2. Click "+ New Chat"
3. Search for "alice" or "bob"
4. Select the user
5. Send a request with a message
6. Verify the other account receives the request

#### Scenario 2: Search Within Chats
1. Go to Chat screen
2. You should see your existing chats
3. Type in the search box at the top
4. Watch the list filter in real-time
5. Clear the search to see all chats again

#### Scenario 3: Backend API Test
```bash
# Search for users
curl -X GET "http://localhost:5000/api/users/search?q=alice" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get user by ID
curl -X GET "http://localhost:5000/api/users/{userId}" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get all users
curl -X GET "http://localhost:5000/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Features Included

✅ **User Search**
- Search by name or email
- Case-insensitive search
- Results limited to 20
- Excludes current user

✅ **Chat Request Modal**
- Optional message field
- Character limit (200)
- Loading states
- Error handling

✅ **Chat List Search**
- Real-time filtering
- Search by user name
- Search by email
- Search by message content
- Clear search to reset

✅ **UI/UX**
- Search icon indicator
- Loading states
- Error alerts
- Empty state messages
- Smooth transitions

## Known Limitations

1. **Authentication Required** - All search endpoints require auth token
2. **Limited Results** - Search returns max 20 users
3. **Real-time Updates** - Polling-based (every 5 seconds)
4. **No Advanced Filters** - Basic text search only

## Future Enhancements

🔮 **Planned Features:**
- Advanced search filters (category, skills)
- Search history
- Recent contacts
- Suggestions (recommended users)
- Voice search
- Full-text search in message history

## Troubleshooting

**Issue: No users found in search**
- Make sure there are other users in the database
- Check if search query is spelled correctly
- Verify authentication is working

**Issue: Search not working**
- Check backend is running
- Verify API endpoint is mounted
- Check browser/device console for errors
- Ensure auth token is being sent

**Issue: Cannot send request**
- Check if chat already exists
- Verify user ID is valid
- Check for existing pending requests

## Code Locations

### Frontend:
- `app/screens/Chats/index.tsx` - Main chat dashboard with search
- `app/screens/Chats/UserSearch.tsx` - User search screen
- `app/screens/Chats/SendChatRequest.tsx` - Request modal

### Backend:
- `Backend/controllers/userController.js` - User search logic
- `Backend/routes/userRoutes.js` - User API routes
- `Backend/server.js` - Routes mounting

## Summary

The chat search feature is now fully functional! You can:
- ✅ Search for new users to chat with
- ✅ Send chat requests with optional messages
- ✅ Search within your existing chats
- ✅ Filter chats by name, email, or message content

Happy chatting! 🎉

