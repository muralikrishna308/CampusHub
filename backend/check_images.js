const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

async function checkEvents() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const events = await Event.find({}, 'title image');
        console.log('Events:', events);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkEvents();
