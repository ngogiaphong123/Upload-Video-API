import mongoose from 'mongoose'
import logger from './logger'
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/youtube-clone'

export async function connectToDB() {
    try {
        await mongoose.connect(DB_URL)
        logger.info("Connected to database")
    }
    catch (err) {
        logger.error(err, "Failed to connect to database")
        process.exit(1)
    }
}

export async function disconnectFromDB() {
    await mongoose.connection.close()
    logger.info("Disconnected from database")
    return;
}