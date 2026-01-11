import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "SCHOOL_MANAGEMENT_SYSTEM",
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error) => {
        console.error("Error occurred while connecting to database:", error);
        // Exit so the process fails fast and a process manager (or nodemon) can restart or show the error
        process.exit(1);
    });
};

