# Student Event Registration System - Implementation Guide

## Overview
This document describes the complete implementation of the student profile completion and event registration system.

## Key Features Implemented

### 1. **Profile Completion Flow**
- After login, students are required to complete their profile before accessing the full dashboard
- Profile completion is mandatory and stored in the database with a `profileComplete` flag
- A modal form appears on StudentDashboard if profile is incomplete

### 2. **Event Registration System**
- Students can browse and register for events created by admins
- Registration forms pre-fill with student profile data from the database
- Each registration is tracked and linked to the specific admin who created the event
- Registration data includes: name, email, phone, department, year, college, city, gender

### 3. **Admin-to-Student Relationship**
- Events are created by admins and linked to their user ID
- Registrations track which admin created the event
- Ensures students can only register for the correct admin's events

---

## Backend Changes

### Database Models

#### **User Model** ([backend/models/User.js](backend/models/User.js))
Added profile completion fields:
- `phone`: Student phone number
- `gender`: Student gender (M/F/Other)
- `address`: Residential address
- `city`: City of residence
- `state`: State/Province
- `zipcode`: Postal code
- `collegeName`: Name of the college
- `profileComplete`: Boolean flag to track profile completion status

#### **Registration Model** ([backend/models/Registration.js](backend/models/Registration.js))
Enhanced with complete registration form data:
- `event`: Reference to Event
- `user`: Reference to Student
- `admin`: Reference to Admin who created the event (NEW)
- `firstName`, `lastName`: Student name
- `email`, `phone`: Contact information
- `department`, `year`: Academic info
- `college`, `city`: Location info
- `gender`: Student gender
- `status`: Registration status (registered/attended/cancelled)

---

### API Endpoints

#### **User Profile Routes** ([backend/routes/authRoutes.js](backend/routes/authRoutes.js))

```
PUT  /api/auth/profile/update    - Update student profile
GET  /api/auth/profile           - Get student profile
GET  /api/auth/profile/check     - Check if profile is complete
```

#### **Registration Routes** ([backend/routes/registrationRoutes.js](backend/routes/registrationRoutes.js))

```
POST /api/registrations/register-event           - Register for an event
GET  /api/registrations/my-registrations         - Get student's registrations
GET  /api/registrations/event/:eventId           - Get registrations for specific event (Admin)
GET  /api/registrations/admin/all                - Get all registrations for admin's events
DELETE /api/registrations/cancel/:registrationId - Cancel a registration
```

### Controllers

#### **User Controller** ([backend/controllers/userController.js](backend/controllers/userController.js))
- `updateProfile()`: Update student profile and set profileComplete flag
- `getProfile()`: Fetch student profile
- `checkProfileComplete()`: Check if profile is complete

#### **Registration Controller** ([backend/controllers/registrationController.js](backend/controllers/registrationController.js))
- `registerForEvent()`: Create registration with admin reference
- `getMyRegistrations()`: Get student's registrations
- `getEventRegistrations()`: Get event registrations (Admin only)
- `getAdminRegistrations()`: Get all registrations for admin's events
- `cancelRegistration()`: Cancel a registration

---

## Frontend Changes

### New Components

#### **ProfileForm Component** ([frontend/src/components/ProfileForm.jsx](frontend/src/components/ProfileForm.jsx))
- Modal form for profile completion
- Fields: name, phone, department, year, gender, address, city, state, zipcode, collegeName
- Validates required fields
- Submits to `/api/auth/profile/update` endpoint
- Shows success message and closes after completion

#### **EventRegistrationForm Component** ([frontend/src/components/EventRegistrationForm.jsx](frontend/src/components/EventRegistrationForm.jsx))
- Registration form modal for events
- Pre-fills student data from their profile
- Automatically fetches and displays student information
- Submits to `/api/registrations/register-event` endpoint
- Links registration to the event's admin automatically

### Updated Pages

#### **StudentDashboard** ([frontend/src/pages/StudentDashboard.jsx](frontend/src/pages/StudentDashboard.jsx))
- Checks profile completion status on load
- Shows ProfileForm modal if profile is incomplete
- Fetches student registrations from API
- Displays registered events with details
- Fetches featured events from API
- Dynamic welcome message with student's first name

#### **Events Page** ([frontend/src/pages/Events.jsx](frontend/src/pages/Events.jsx))
- Fetches events from API instead of mock data
- Shows admin who created the event as organizer
- Tracks student's registrations in real-time
- Opens EventRegistrationForm on registration
- Pre-fills registration form with student data
- Updates registration status after successful registration

---

## Data Flow

### Registration Flow
```
1. Student logs in
   ↓
2. StudentDashboard checks profileComplete flag
   ↓
3. If incomplete → ProfileForm modal appears
   ↓
4. Student fills profile and submits
   ↓
5. Profile saved to DB with profileComplete = true
   ↓
6. StudentDashboard queries student registrations
   ↓
7. Fetches featured events from API
```

### Event Registration Flow
```
1. Student browses events on Events page
   ↓
2. Clicks "Register" button
   ↓
3. EventRegistrationForm opens
   ↓
4. Form pre-fills with student profile data from API
   ↓
5. Student submits registration form
   ↓
6. Registration created with:
   - Event ID
   - Student ID
   - Admin ID (from event.admin)
   - Form data
   ↓
7. Registration saved to DB
   ↓
8. Registration status updated on UI
   ↓
9. Student can view in "Your Registrations"
```

---
### Google Authentication (OAuth)

The application now supports signing in/up via Google. The backend uses `passport` and the
`passport-google-oauth20` strategy to create or lookup users by email.  On first OAuth
login a new `student` account is generated with a random password (not used).

#### Setup
1. Obtain a Google OAuth 2.0 Client ID/Secret from the Google Cloud Console.
2. Add the following variables to your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   API_URL=http://localhost:5000        # used by passport callback
   FRONTEND_URL=http://localhost:3000  # frontend redirect target
   ```
3. Run `npm install passport passport-google-oauth20` in the backend folder.

#### Flow
- Clicking the **Google** button on `/login` or `/register` navigates to `/api/auth/google`.
- Google redirects back to `/api/auth/google/callback` with the profile.
- Server generates a JWT token and redirects to the frontend `/login?token={token}`.
- Frontend detects `token` query parameter, stores it and automatically navigates
  to the appropriate dashboard.

---
## API Integration Points

### Environment Configuration
- Backend URL: `http://localhost:5000`
- Update in components if using different URL

### Authentication
- All requests include `Authorization: Bearer {token}` header
- Token obtained from login endpoint

---

## Security Features

1. **Profile Ownership**: Only students can update their own profiles
2. **Admin Verification**: Admins can only see registrations for events they created
3. **Registration Validation**: Prevents duplicate registrations
4. **Role-based Access**: Students can't access admin endpoints

---

## Future Enhancements

1. **Email Notifications**: Send confirmation emails on registration
2. **Registration Capacity Limits**: Enforce event capacity limits
3. **Attendance Tracking**: Mark students as attended
4. **Cancellation Policies**: Handle registration cancellations
5. **Payment Integration**: If events have ticket prices
6. **Rating & Reviews**: Students can rate events after attending

---

## Testing Checklist

- [ ] Student completes profile after login
- [ ] Profile data saved correctly in database
- [ ] Events page loads from API
- [ ] Student can register for events
- [ ] Registration form pre-fills with profile data
- [ ] Registration creates link to correct admin
- [ ] Student registrations visible on dashboard
- [ ] Cannot register twice for same event
- [ ] Can cancel registration
- [ ] Admin can view registrations for their events

---

## Troubleshooting

### Profile Form Not Showing
- Check `/api/auth/profile/check` endpoint
- Verify token is being sent
- Check browser console for errors

### Registration Form Not Pre-filling
- Ensure student profile exists in database
- Check `/api/auth/profile` endpoint
- Verify AuthContext has token

### Events Not Loading
- Check `/api/events/all` endpoint
- Verify events have image URLs
- Check admin references in events

### Registrations Not Saving
- Verify event has admin field populated
- Check registration payload includes all fields
- Look for validation errors in server logs

---

## API Example Calls

### Update Profile
```javascript
POST /api/auth/profile/update
{
  "name": "John Doe",
  "phone": "9876543210",
  "department": "Computer Science",
  "year": 3,
  "gender": "Male",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipcode": "10001",
  "collegeName": "University of XYZ"
}
```

### Register for Event
```javascript
POST /api/registrations/register-event
{
  "eventId": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "department": "Computer Science",
  "year": 3,
  "college": "University of XYZ",
  "city": "New York",
  "gender": "Male"
}
```

---

## File Summary

### Backend Files Modified/Created
- ✅ [backend/models/User.js](backend/models/User.js) - Updated with profile fields
- ✅ [backend/models/Registration.js](backend/models/Registration.js) - Updated with registration data
- ✅ [backend/controllers/userController.js](backend/controllers/userController.js) - NEW
- ✅ [backend/controllers/registrationController.js](backend/controllers/registrationController.js) - NEW
- ✅ [backend/routes/authRoutes.js](backend/routes/authRoutes.js) - Updated with profile routes
- ✅ [backend/routes/registrationRoutes.js](backend/routes/registrationRoutes.js) - NEW
- ✅ [backend/server.js](backend/server.js) - Updated to include new routes

### Frontend Files Modified/Created
- ✅ [frontend/src/components/ProfileForm.jsx](frontend/src/components/ProfileForm.jsx) - NEW
- ✅ [frontend/src/components/ProfileForm.css](frontend/src/components/ProfileForm.css) - NEW
- ✅ [frontend/src/components/EventRegistrationForm.jsx](frontend/src/components/EventRegistrationForm.jsx) - NEW
- ✅ [frontend/src/components/EventRegistrationForm.css](frontend/src/components/EventRegistrationForm.css) - NEW
- ✅ [frontend/src/pages/StudentDashboard.jsx](frontend/src/pages/StudentDashboard.jsx) - Updated
- ✅ [frontend/src/pages/Events.jsx](frontend/src/pages/Events.jsx) - Updated

---

## Deployment Instructions

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   node server.js
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database**: Ensure MongoDB is running and connected

4. **Environment Variables**: Set JWT_SECRET and database URL in .env

---
