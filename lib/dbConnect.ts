import  mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default class DBConnect {
    private isConnected = false   ;

    constructor() {
        this.isConnected = false;
    }

    async connect() {
        if (this.isConnected) {
            console.log("Already connected to the database");
            return;
        }
        if(!process.env.MONGO_URI) {
            throw new Error(`Missing MongoDB connection string in environment variables ${process.env.MONGO_URI}`);
        }
        try {
            console.log("MONGO_URI BEING USED:", process.env.MONGO_URI);
            const db = await mongoose.connect(process.env.MONGO_URI as string);
            this.isConnected = true;


            console.log("Connected to the database: ", db.connection.name);

        }catch (err: any)
        {
            // Log full error for debugging
            console.error("Error connecting to the database: ", err);

            // Detect MongoDB authentication error and rethrow a clearer error
            const isAuthError = err && (err.code === 13 || (err.name === 'MongoServerError' && /auth|authentication|requires authentication/i.test(err.message)));
            if (isAuthError) {
                const authErr = new Error('MongoAuthError: authentication failed for MongoDB. Check MONGO_URI credentials and authSource.');
                (authErr as any).code = 13;
                throw authErr;
            }

            throw err;
        }
    }

}
