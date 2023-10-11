const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    mongoDbUrl: process.env.MONGO_DB_URL,
    tokenSecretKey: process.env.TOKEN_SECRET_KEY,
    port: process.env.PORT,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
}