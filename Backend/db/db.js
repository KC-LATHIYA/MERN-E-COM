import mongoose from "mongoose";

const db = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
            .then(() => {
                console.log("Data Base Connected Successfully");
            });
    } catch (error) {
        console.log("MONGODB Connection Failed", error);
        process.exit(1);
    }
}

export default db