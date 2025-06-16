import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});