const dotenv = require('dotenv');

// getting all ENV variables before starting another processes
dotenv.config();

module.exports = {
    mongoDbUrl: process.env.MONGO_DB_URL,
    tokenSecretKey: process.env.TOKEN_SECRET_KEY,
    port: process.env.PORT,
    razorpayAPIKey: process.env.RAZORPAY_API_KEY,
    razorpayAPISecret: process.env.RAZORPAY_APT_SECRET,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    smsapikey: process.env.SMS_API_KEY,
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    type: process.env.SERVICE_ACC_TYPE,
    project_id: process.env.SERVICE_ACC_PROJECT_ID,
    private_key_id: process.env.SERVICE_ACC_PRIVATE_KEY_ID,
    private_key: process.env.SERVICE_ACC_PRIVATE_KEY,
    client_email: process.env.SERVICE_ACC_CLIENT_EMAIL,
    client_id: process.env.SERVICE_ACC_CLIENT_ID,
    auth_uri: process.env.SERVICE_ACC_AUTH_URI,
    token_uri: process.env.SERVICE_ACC_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.SERVICE_ACC_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.SERVICE_ACC_CLIENT_CERT_URL,
    universe_domain: process.env.SERVICE_ACC_UNIVERSE_DOMAIN
}