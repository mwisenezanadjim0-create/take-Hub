require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
    if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
        console.error('❌ Error: MONGODB_URI is not configured correctly in .env');
        process.exit(1);
    }

    try {
        console.log('⏳ Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to Atlas');

        const email = 'saidabi@gmail.com';
        const existing = await User.findOne({ email });

        if (existing) {
            console.log(`ℹ️ User ${email} already exists.`);
            process.exit(0);
        }

        const admin = new User({
            name: 'MUGABO Said',
            email: email,
            password: 'AdminPassword123!',
            role: 'admin'
        });

        await admin.save();
        console.log('🚀 Final Admin account created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: AdminPassword123!`);
        console.log('⚠️ Please change this password after your first login.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:');
        console.error(err);
        process.exit(1);
    }
}

seed();
