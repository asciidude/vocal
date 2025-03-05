import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from '$env/static/private';

/**
 * Mongoose connection codes:
 * 0 - disconnected
 * 1 - connected
 * 2 - connecting
 * 3 - disconnecting
 */

export const mongoConnection = {
    connection_code: 0
}

export const connect = async () => {
    if(mongoConnection.connection_code === 1) {
        console.log('A connection has already been established to MongoDB.');
        return;
    }

    if(mongoose.connections.length > 0) {
        mongoConnection.connection_code = mongoose.connections[0].readyState;

        if(mongoConnection.connection_code === 1) {
            // Exit to avoid reconnection
            console.log('A connection has already been established to MongoDB.');
            return;
        }

        await mongoose.disconnect(); // Disconnect if not already connected
    }

    await mongoose.connect(MONGO_URI);
    mongoConnection.connection_code = 1;
    console.log('A connection has been established to MongoDB.');
}

export const disconnect = async() => {
    if (NODE_ENV === 'development') return; // Don't disconnect in development mode - causes performance issues
    if(mongoConnection.connection_code === 0) return;

    await mongoose.disconnect();
    mongoConnection.connection_code = 0;
    console.log('The MongoDB connection has been severed.')
}