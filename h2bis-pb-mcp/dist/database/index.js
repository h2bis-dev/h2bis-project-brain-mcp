import mongoose from 'mongoose';
import { config } from '../config/index.js';
export async function connectDB() {
    try {
        await mongoose.connect(config.mongoUri, { dbName: config.dbName });
        console.error('✅ Connected to MongoDB');
    }
    catch (error) {
        console.error('❌ MongoDB error:', error.message);
        process.exit(1);
    }
}
export async function disconnectDB() {
    await mongoose.disconnect();
}
export { mongoose };
//# sourceMappingURL=index.js.map