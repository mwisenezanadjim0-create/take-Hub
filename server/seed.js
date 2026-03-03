require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/take-hub';

const seedAdmin = {
    name: 'Admin Take Hub',
    email: 'admin@takehub.com',
    password: 'adminpassword123',
    role: 'admin'
};

const seedCourses = [
    {
        title: 'Full Stack Development',
        description: 'Master HTML, CSS, JavaScript, and Node.js to build powerful web applications.',
        category: 'development',
        level: 'beginner',
        instructor: 'Alex Doe',
        price: 150000,
        duration: '12 weeks'
    },
    {
        title: 'Digital Marketing Mastery',
        description: 'Learn SEO, SEM, and social media advertising for business growth.',
        category: 'business',
        level: 'intermediate',
        instructor: 'Jane Smith',
        price: 75000,
        duration: '8 weeks'
    },
    {
        title: 'UI/UX Design Concepts',
        description: 'Design beautiful and intuitive user interfaces for mobile and web apps.',
        category: 'multimedia',
        level: 'beginner',
        instructor: 'Mike Brown',
        price: 90000,
        duration: '6 weeks'
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Seeding DB...');

        // Clear Existing
        await Course.deleteMany();
        await User.deleteMany();

        // Seed Courses
        await Course.insertMany(seedCourses);

        // Seed Admin (Model Middleware handles hashing)
        const admin = new User(seedAdmin);
        await admin.save();

        console.log('✅ Seeding Complete');
        console.log('🔑 Admin email: admin@takehub.com');
        console.log('🔑 Admin password: adminpassword123');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
}

seed();
