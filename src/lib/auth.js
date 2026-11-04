import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from '@better-auth/mongo-adapter';

const globalForMongo = globalThis;
const client = globalForMongo._mongoClient ?? new MongoClient(process.env.MONGO_URL);
if (process.env.NODE_ENV !== 'production') {
    globalForMongo._mongoClient = client;
}

const db = client.db('market-price');

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ['google', 'github'],
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});
