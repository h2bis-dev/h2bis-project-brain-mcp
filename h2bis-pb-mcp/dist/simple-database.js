import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/use_case_db';
export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.error('✅ Connected to MongoDB:', MONGODB_URI);
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}
export async function disconnectDB() {
    await mongoose.disconnect();
    console.error('✅ Disconnected from MongoDB');
}
export { mongoose };
//# sourceMappingURL=simple-database.js.map