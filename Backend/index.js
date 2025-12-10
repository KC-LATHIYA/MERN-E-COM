import app from "./app.js";
import db from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT

db().then(() => {
    app.listen(PORT, () => {
        console.log(`⚙️  Server is running at port : ${PORT}`);
    })
}).catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});