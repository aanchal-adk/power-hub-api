import mongoose from "mongoose";

const connectDb = async () => {
    try {
        if (process.env.DB_CONNECTION_STRING) {
            const connection = await mongoose.connect(process.env.DB_CONNECTION_STRING);
            console.log("DB Connection established! ");

        } else {
            throw new Error("DB connection string not defined in .env");
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }

        process.exit(1);
    }
}

export default connectDb;
