import { createClient } from 'redis';

export const redis = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});

export const connectRedis = async () => {
    try {
        await redis.connect();
        console.log('Redis has connected!')
    } catch (error) {
        console.log('Redis has not conntected')
    }
}

