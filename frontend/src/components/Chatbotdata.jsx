
/* Quick Reply chips */
export const QUICK_REPLIES = [
  { label: "🏠 What is this?", query: "what is campuseventhub" },
  { label: "📅 Browse Events", query: "how to browse events" },
  { label: "✅ How to Register", query: "how to register for an event" },
  { label: "🏛️ Admin Features", query: "what can admin do" },
  { label: "⭐ Give Feedback", query: "how to give feedback" },
  { label: "🔐 Login / SignUp", query: "how to login" },
  { label: "📊 Analytics", query: "admin analytics dashboard" },
  { label: "🔔 Notifications", query: "real time notifications" },
];

/*SYNONYM MAP*/
export const SYNONYMS = {
  "signup": "register", "sign-up": "register", "enroll": "register",
  "enrol": "register", "join": "register", "book": "register",
  "slot": "register", "apply": "register", "applying": "register",
  "booking": "register", "enrolling": "register",
  "signin": "login", "sign-in": "login", "log-in": "login",
  "logon": "login", "access": "login",
  "fest": "event", "programme": "event", "program": "event",
  "hackathon": "event", "workshop": "event", "competition": "event",
  "contest": "event", "tournament": "event", "meet": "event",
  "search": "browse", "find": "browse", "explore": "browse",
  "discover": "browse", "look": "browse", "see": "browse",
  "show": "browse", "list": "browse", "view": "browse",
  "review": "feedback", "rate": "feedback", "rating": "feedback",
  "comment": "feedback", "opinion": "feedback",
  "organiser": "admin", "organizer": "admin", "coordinator": "admin",
  "teacher": "admin", "faculty": "admin", "manager": "admin",
  "withdraw": "cancel", "remove": "cancel", "unregister": "cancel", "drop": "cancel",
  "alert": "notification", "notify": "notification", "remind": "notification",
  "update": "notification", "inform": "notification",
  "profile": "account", "user": "account",
  "pwd": "password", "pass": "password", "forgot": "password", "reset": "password",
  "university": "college", "institution": "college", "campus": "college", "school": "college",
};

/* QUESTION-ANSWER DATABASE*/
export const qaList = [

  /* GREETINGS */
  {
    keywords: ["hi", "hello", "hey", "hii", "heyy", "yo", "sup", "howdy", "namaste", "greet"],
    answer: "Hey! 👋 I'm Hub Scout. Ask me anything about events, registrations, or the platform. Or just pick a quick question below!",
  },
  {
    keywords: ["good morning", "good afternoon", "good evening", "good night", "gm", "gn"],
    answer: "Hey, hope your day's going well! 🌟 What can I help you with today?",
  },
  {
    keywords: ["how are you", "how r u", "hows it going", "whats up", "howru", "how you doing"],
    answer: "All good, thanks for asking! 😄 What would you like to know?",
  },
  {
    keywords: ["who are you", "what are you", "your name", "introduce yourself", "about you", "tell me about yourself"],
    answer: "I'm Hub Scout 🤖 — the AI assistant for CampusEventHub. I help with events, registrations, admin stuff, and more. Just ask!",
  },
  {
    keywords: ["thank", "thanks", "thx", "ty", "thank you", "thankyou", "thnk"],
    answer: "You're welcome! 😊 Anything else I can help with?",
  },
  {
    keywords: ["bye", "goodbye", "see you", "see ya", "cya", "later", "gtg", "take care"],
    answer: "See you! 👋 Don't forget to check out new events on CampusEventHub. 🎉",
  },
  {
    keywords: ["help", "help me", "assist", "guide", "support", "stuck", "confused", "lost"],
    answer: "Sure, I'm here! 😊 Ask me about events, registration, admin tools, login, or feedback — or tap a quick-reply chip below.",
  },
  {
    keywords: ["joke", "funny", "laugh", "humor", "lol"],
    answer: "Why did the hackathon dev go broke? Because he used up all his cache! 😄\n\nNow, back to exploring events?",
  },
  {
    keywords: ["bored", "boring", "nothing to do", "free", "free time"],
    answer: "Bored? There are 340+ events live right now — hackathons, sports, cultural fests, gaming! Head to the Events section. 🎉",
  },
  {
    keywords: ["are you human", "are you real", "are you bot", "are you ai", "robot"],
    answer: "AI assistant here 🤖 — not human, but I know this platform inside out. Ask away! 😊",
  },
  {
    keywords: ["wow", "amazing", "awesome", "great", "cool", "nice", "excellent", "fantastic", "brilliant", "perfect"],
    answer: "Glad to hear that! 😄 Anything else I can help with?",
  },

  /* PLATFORM OVERVIEW  */
  {
    keywords: ["what is campuseventhub", "about platform", "about this site", "about this app", "what does this do", "campuseventhub", "campus event hub", "this platform", "explain platform", "platform overview", "overview"],
    answer: "CampusEventHub is India's inter-college event platform 🇮🇳 — students discover & register for events across 120+ colleges, and admins create & manage them. All free, forever! 🚀",
  },
  {
    keywords: ["how many colleges", "colleges supported", "partner colleges", "how many universities", "colleges list"],
    answer: "We're connected to 120+ partner colleges across India! 🏫 Any college can join as an admin partner.",
  },
  {
    keywords: ["types of events", "kind of events", "what events", "event types", "event categories", "categories"],
    answer: "We host all kinds of events 🎊\n• 💻 Tech (Hackathons, AI Summits)\n• 🏆 Sports\n• 🎭 Cultural\n• 🎮 Gaming (PUBG, Valorant)\n• 📚 Workshops & Seminars",
  },
  {
    keywords: ["is it free", "free", "cost", "pricing", "paid", "charges", "fees", "money"],
    answer: "Completely free for students! 🎉 Account, browsing, registration — no hidden fees, no subscriptions.",
  },
  {
    keywords: ["how does it work", "how it works", "working", "explain", "process", "workflow"],
    answer: "Simple 4-step flow 🚀\n1. Sign up — free, takes < 1 min\n2. Browse events from 120+ colleges\n3. Register — instant slot hold\n4. Attend & rate the event ⭐",
  },

  /*AUTHENTICATION*/
  {
    keywords: ["login", "log in", "sign in", "signin", "how to login", "how to sign in", "access account", "enter account"],
    answer: "Click Sign In on the navbar → enter your email & password. Students land on the Events Dashboard; admins go to the Management Dashboard. No OTP delays! 🔐",
  },
  {
    keywords: ["register account", "create account", "sign up", "signup", "new account", "make account", "open account", "how to register account", "how to create account", "how to signup"],
    answer: "Hit Get Started → fill in your name, college email, password & college → pick your role (Student or Admin) → done! Takes under 60 seconds. ✨",
  },
  {
    keywords: ["forgot password", "forget password", "reset password", "change password", "password reset", "lost password", "password problem"],
    answer: "Login page → Forgot Password? → enter your email → click the link in your inbox → set a new password. 🔑 (Check spam if you don't see it!)",
  },
  {
    keywords: ["login problem", "cant login", "cannot login", "login issue", "login error", "not able to login", "login failed", "wrong password"],
    answer: "Quick checklist 🛠️\n• Email spelled right?\n• Caps Lock off?\n• Try clearing cache (Ctrl+Shift+Delete)\n• Use Forgot Password to reset\n\nStill stuck? Email team@campuseventhub.com 📧",
  },
  {
    keywords: ["role", "roles", "student role", "admin role", "types of users", "rbac", "role based", "role access", "permissions", "user types", "who can"],
    answer: "Three main roles:\n🎓 Student — browse, register, feedback\n🏛️ Admin — create & manage events, approve participants, view analytics\n Super Admin — manage admins, view all analytics, platform settings\n\nAccess is auto-assigned on sign-up.",
  },

  /* EVENT BROWSING */
  {
    keywords: ["browse events", "find events", "search events", "discover events", "how to browse", "see events", "show events", "view events", "explore events", "look for events", "events list"],
    answer: "Log in → Events → use filters:\n📁 Category · 🏫 College · 📅 Date · 🔍 Keyword\n\nCombine any filter for precise results! Over 340 events listed right now. 🔍",
  },
  {
    keywords: ["filter events", "how to filter", "event filter", "narrow down", "sort events"],
    answer: "Filter by Category, College, Date range (Today / This Week / Month), Status (Open / Full / Closed), or keyword. Results update instantly! 🎯",
  },
  {
    keywords: ["event details", "event information", "event info", "more about event", "click on event", "see event details", "event description", "event page"],
    answer: "Each event page shows: name, date & time, venue, organising college, live slot count, eligibility, rules, and past ratings. Just click any event card! 📋",
  },
  {
    keywords: ["upcoming events", "next events", "future events", "coming events", "events this week", "events this month", "events today"],
    answer: "Go to **Events** → filter by **Date: Upcoming / This Week / Next Month**. Over 340 active events are live — new ones added daily! 📅",
  },
  {
    keywords: ["hackathon", "hack", "coding contest", "code competition", "programming contest", "tech event", "technology event"],
    answer: "Filter by Category → Technology to find hackathons 💻\nUpcoming: National Hackathon 2026 (Mar 15) · AI Summit (May 5)\nMost have prize pools of ₹5L+! 🏆",
  },
  {
    keywords: ["sports", "sports meet", "football", "cricket", "basketball", "athletics", "sports event"],
    answer: "Filter by Category → Sports for football, cricket, basketball, athletics & more 🏆\nHighlight: Inter-College Sports Meet 2026— Apr 2, 15+ colleges!",
  },
  {
    keywords: ["cultural", "cultural fest", "dance", "music", "drama", "art", "cultural event"],
    answer: "Filter by Category → Cultural 🎭\nUpcoming: **Cultural Fest 2026** — Apr 20–23 — music, dance, drama, art exhibitions!",
  },

  /* REGISTRATION  */
  {
    keywords: ["register", "how to register", "register for event", "event registration", "join event", "sign up for event", "how register", "registration process", "how do i register", "can i register", "want to register", "book event", "apply event"],
    answer: "Browse → click an event → hit Register → your slot is instantly reserved ⏳\nStatus starts as **Pending** until admin approves. Once approved, you get a confirmation + Participant ID. 🎫\n\n*Register early — popular events fill fast!*",
  },
  {
    keywords: ["pending", "pending registration", "pending status", "what is pending", "registration pending", "waiting for approval", "approval pending"],
    answer: "Pending = your slot is held while admin reviews. Usually approved within 24 hrs. You'll get notified the moment it changes. Check My Registrations for live status! ⏳",
  },
  {
    keywords: ["rejected", "registration rejected", "why rejected", "not approved", "declined", "denied", "application rejected"],
    answer: "Common reasons for rejection ❌\n• Slots full\n• Eligibility mismatch\n• College restriction\n• Deadline passed\n\nDon't worry — there are 340+ events! Check eligibility before registering next time.",
  },
  {
    keywords: ["cancel registration", "withdraw registration", "unregister", "cancel event", "remove registration", "drop registration", "undo registration"],
    answer: "Dashboard → My Registrations → find the event → Cancel.\n\n⚠️ Some events block cancellation close to the date — check the cancellation policy first.",
  },
  {
    keywords: ["slot full", "event full", "no slots", "seats full", "capacity full", "registration closed", "slots available", "how many slots"],
    answer: "If an event is full, the Register button greys out. If someone cancels, a slot may reopen and you'll be notified. **Register early!** 🚀",
  },
  {
    keywords: ["approved", "registration approved", "confirmed", "got approved", "registration confirmed", "accepted"],
    answer: "You're in! 🎉 Dashboard shows **Approved**, you get an email confirmation, and your Participant ID / entry pass. Show up on time and enjoy! 🚀",
  },
  {
    keywords: ["can i register multiple events", "multiple registrations", "register two events", "many events"],
    answer: "Yes! Register for as many events as you like 🎊 — each tracked separately under **My Registrations**. Just watch for clashing dates! 📅",
  },

  /* ADMIN TOOLS */
  {
    keywords: ["admin", "admin features", "what can admin do", "admin tools", "admin panel", "admin dashboard", "college admin", "admin capabilities", "organizer tools"],
    answer: "Admins get a full management suite 🏛️\n• Create, edit & cancel events\n• Approve / reject participants\n• Download CSV attendance lists\n• View analytics (registrations, ratings, trends)",
  },
  {
    keywords: ["create event", "add event", "new event", "publish event", "how to create event", "make event", "organize event", "host event", "setup event"],
    answer: "Admin Dashboard → My Events → + Create Event → fill in name, category, date, venue, max participants & rules → Publish. Goes live instantly for all students! 🚀",
  },
  {
    keywords: ["edit event", "update event", "modify event", "change event", "update event details"],
    answer: "Admin Dashboard → My Events → Edit → change what you need → Save. Registered students are auto-notified when key details (date/venue) change. 🔔",
  },
  {
    keywords: ["delete event", "cancel event admin", "remove event", "take down event"],
    answer: "Admin Dashboard → My Events → Delete / Cancel Event → confirm. All participants are instantly notified. This can't be undone, so double-check! ⚠️",
  },
  {
    keywords: ["approve registration", "approve participant", "approve student", "accept registration", "participant approval"],
    answer: "Admin Dashboard → Participant Management→ review the pending list → Approve ✅ or Reject ❌. Students are notified instantly. Bulk-approve also available! 👍",
  },
  {
    keywords: ["download participant", "export participants", "participant list", "csv download", "attendance list", "download list"],
    answer: "Admin Dashboard → Participant Management → select event → Download CSV. Includes name, email, college, status, and registration date. 📥",
  },
  {
    keywords: ["analytics", "dashboard analytics", "event analytics", "statistics", "stats", "reports", "event report", "data", "insights"],
    answer: "Analytics shows 📊\n• Total registrations per event\n• College-wise breakdown\n• Average ratings over time\n• Feedback insights\n• Day-wise registration trends\n\nGreat for improving future events!",
  },

  /*  REAL-TIME UPDATES*/
  {
    keywords: ["real time", "notifications", "notification", "get notified", "alerts", "updates", "live updates", "instant notification"],
    answer: "You're notified automatically for 🔔\n• Registration approved / rejected\n• Event date or venue change\n• Event cancelled\n• Slots full\n• New matching events\n\nNo more missing events from scattered WhatsApp chats!",
  },
  {
    keywords: ["event cancelled", "cancel happening", "event called off", "event stopped"],
    answer: "If an admin cancels an event, all registered students get an instant notification and the dashboard updates to 'Cancelled' automatically. No manual announcements needed! 🚫",
  },
  {
    keywords: ["date changed", "event rescheduled", "reschedule", "new date", "event date change"],
    answer: "Admin changes the date → all registered students are notified immediately → new date appears on your dashboard → you can cancel if it doesn't suit you. 📅",
  },

  /*FEEDBACK & RATINGS */
  {
    keywords: ["feedback", "give feedback", "submit feedback", "rate event", "rate", "rating", "review", "star rating", "how to rate", "how to give feedback", "post event feedback"],
    answer: "My Events → Attended → click the event → give a star rating (1–5 ⭐) + write a comment. Your feedback helps admins improve and helps other students decide. 😊",
  },
  {
    keywords: ["comment", "ask question event", "event discussion", "community", "interact", "interact with event"],
    answer: "On any event page you can write comments, ask questions for future editions, and read feedback from past attendees. Great way to connect with the community! 💬",
  },
  {
    keywords: ["average rating", "how ratings work", "rating calculation", "how is rating calculated", "rating formula"],
    answer: "Simple average: Sum of all ratings ÷ Number of ratings. Admins see a full breakdown in Analytics. For example, 5 ratings of 4,5,4.5,3,5 → average 4.3 ⭐.",
  },

  /* SECURITY*/
  {
    keywords: ["security", "safe", "secure", "data safe", "data protection", "privacy", "is it safe", "my data safe"],
    answer: "Your data is protected 🔒\n• Passwords hashed with bcrypt\n• **JWT** tokens for every request\n• Role-based access control\n• SQL injection prevention\n• Email verification on signup\n\nWe never share your data with third parties.",
  },
  {
    keywords: ["jwt", "token", "authentication token", "how authentication works", "session"],
    answer: "We use JWT (JSON Web Tokens) 🔐 — generated on login, stored securely in your browser, verified on every protected API call, and expire automatically to keep you safe.",
  },

  /*CONTACT & SOCIAL*/
  {
    keywords: ["contact", "contact us", "email", "reach out", "get in touch", "support", "help desk", "customer support", "phone", "call"],
    answer: "Reach us at 📬\n📧 team@campuseventhub.com\n📞 +91 90675 43210\n📍 Bengaluru, India\n\nWe respond within **24 hours**!",
  },
  {
    keywords: ["social media", "instagram", "twitter", "linkedin", "github", "follow us", "social"],
    answer: "Find us on 📱\n📷 Instagram · 🐦 Twitter · 💼 LinkedIn · 🐙 GitHub\n\nAll @campuseventhub — tag us in event photos with **#CampusEventHub** to get featured! 🌟",
  },

  /* FUTURE FEATURES*/
  {
    keywords: ["future", "upcoming features", "new features", "what next", "roadmap", "future plans", "improvements", "coming soon"],
    answer: "Coming soon 🔮\n🔔 Push notifications · 💳 Paid events (Razorpay/Stripe) · 📱 QR Code entry · 💬 In-app chat · 📱 Mobile app · 🤖 AI recommendations · 🏆 Leaderboard",
  },
  {
    keywords: ["mobile app", "app", "android", "ios", "phone app"],
    answer: "A **CampusEventHub mobile app** is in development! 📱 Planned features: push notifications, QR entry passes, offline viewing, one-tap registration. Coming for Android & iOS! 🎉",
  },
  {
    keywords: ["payment", "pay", "paid event", "ticket", "entry fee", "razorpay", "stripe"],
    answer: "Paid event support is coming 💳 — Razorpay (India) and Stripe (international) with instant confirmations & refund management. For now, all events are **free to register!**",
  },
  {
    keywords: ["qr code", "qr", "attendance", "verify attendance", "check in", "entry pass"],
    answer: "QR Code check-in is coming 📱 — you'll get a unique QR after approval, scan it at the gate, and attendance is marked instantly. In development now!",
  },

  /*TECHNICAL*/
  {
    keywords: ["database", "how data stored", "data model", "schema", "tables", "database structure"],
    answer: "Key tables: Users, Events, Registrations, Feedback. Unique constraint on (user_id, event_id) prevents duplicate registrations. 🗄️",
  },
  {
    keywords: ["registration status", "status types", "statuses", "what are statuses"],
    answer: "3 registration statuses:\n⏳ Pending — awaiting admin review\n✅ Approve — confirmed, you're in!\n❌ Rejected — not accepted\n\nYou're notified instantly on any change.",
  },
  {
    keywords: ["api", "endpoint", "rest api", "backend api", "http method"],
    answer: "Key API endpoints ⚙️\n• POST /api/auth/register · /login\n• GET/POST /api/events\n• POST /api/registrations\n• PATCH /api/registrations/:id (approve/reject)\n• GET/POST /api/feedback/:eventId",
  },

  /* MISC*/
  {
    keywords: ["ravi", "mrs sharma", "example", "scenario", "real world", "use case"],
    answer: "Ravi (student) browses events, registers for hackathons & submits feedback. **Mrs. Sharma** (admin) creates events, approves 200+ applications & checks analytics. One platform, both sides sorted! 🚀",
  },
  {
    keywords: ["student", "student features", "student dashboard", "student can", "what can student do"],
    answer: "As a student you can 🎓\n• Discover events across 120+ colleges\n• Filter by category, date, college\n• Register in one click\n• Track status live\n• Rate & review events\n• Get real-time notifications",
  },
  {
    keywords: ["what can you do", "your features", "your capabilities", "chatbot features", "how can you help", "what do you know"],
    answer: "I'm Hub Scout 🤖 — I can answer questions on:\n🏠 Platform overview · 🔐 Login & accounts · 📅 Events · ✅ Registration · 🏛️ Admin tools · 🔔 Notifications · ⭐ Feedback · 🔒 Security · 🔮 Roadmap · ⚙️ Tech details\n\nJust ask naturally! 💬",
  },
];