require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function run() {
    if (!uri) {
        console.error('No URI found in .env');
        return;
    }

    const client = new MongoClient(uri);

    try {
        console.log('Attempting to connect to:', uri.replace(/:[^:@/]+@/, ':****@'));
        await client.connect();
        console.log('✅ Port 1: Successfully connected to Atlas!');

        // Check databases
        const databasesList = await client.db().admin().listDatabases();
        console.log('Databases:');
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    } catch (e) {
        console.error('❌ Connection test failed:');
        console.error(e);
    } finally {
        await client.close();
    }
}

run();
