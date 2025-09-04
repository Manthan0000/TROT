# TROT – Room of talent (Backend MVP)

Minimal Express + MongoDB + Cloudinary backend.

Quick start:
- Node 18+
- Install: npm install
- Run dev: npm run dev

Env (optional; defaults are embedded from your message):
- PORT=4000
- MONGODB_URI
- JWT_SECRET, JWT_EXPIRES_IN=7d
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER=trot

API base: http://localhost:4000

Auth
- POST /api/auth/register { email, password, name }
- POST /api/auth/login { email, password }

Profile (Bearer token)
- GET /api/profile/me
- PUT /api/profile/me { name, bio, skillsTeach[], skillsLearn[] }
- POST /api/profile/me/avatar (multipart field: avatar)

Skills
- POST /api/skills (auth) { name, description, level, priceCredits }
- GET /api/skills?q=term
- DELETE /api/skills/:id (auth)

Matchmaking (auth)
- GET /api/match/suggestions

Requests (auth)
- POST /api/requests { skillId }
- POST /api/requests/:id/accept
- POST /api/requests/:id/reject
- GET /api/requests

Chat (auth)
- GET /api/chat/:otherUserId
- POST /api/chat/:otherUserId { text }

# TROT