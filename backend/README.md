# CampusEventHub – Module 1 : User & College Admin Authentication 
(User Management & Database Setup)
---
## ✅ Implemented Features

- **User Schema** (Student / College Admin / Super Admin)
- **AdminLog Schema** (Admin action tracking)
- **MongoDB Connection** using Mongoose
---

## 📌 Database Schema

### Users Collection
Stores all platform users with role-based access support.

| Field       | Type   | Description |
|------------|--------|-------------|
| `name`     | String | Full name of the user |
| `email`    | String | Unique email address |
| `password` | String | Hashed authentication password |
| `college`  | String | Associated college/institution |
| `role`     | String | `student` / `college_admin` / `super_admin` |
---

### AdminLogs Collection
Tracks administrative actions performed within the platform.

| Field       | Type     | Description |
|------------|----------|-------------|
| `action`   | String   | Description of admin activity |
| `user_id`  | ObjectId | Reference to the admin user (`Users` collection) |
| `timestamp`| Date     | Time of log entry creation |
---
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/campuseventhub
   PORT=5000
   ```
3. Run server:
   ```bash
   npm run dev
   ```
## Technologies
- Node.js, Express.js
- MongoDB, Mongoose
