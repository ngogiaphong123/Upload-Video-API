import express from 'express';
import { connectToDB, disconnectFromDB } from './utils/database';
import logger from './utils/logger';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CORS_ORIGIN } from './constant';
import helmet from 'helmet';
import userRoute from './modules/user/user.route';
import authRoute from './modules/auth/auth.route';
import deserializeUser from './middleware/deserializeUser';
const app = express();
//? Middle wares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin : CORS_ORIGIN,
    credentials : true
}))
app.use(helmet());
app.use(deserializeUser);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute)
const PORT = process.env.PORT || 3001
const server = app.listen(PORT, async () => {
    await connectToDB();
    logger.info(`Listening on port ${PORT}`);
})

const signals = ["SIGTERM", "SIGINT"]

function gracefulShutdown(signal: string) {
    process.on(signal , async () => {
        logger.info(`Server closed by ${signal}`)
        server.close()
        await disconnectFromDB();
        process.exit(0)
    })
}
for(let i = 0 ; i < signals.length; i++) {
    gracefulShutdown(signals[i])
}