// scripts/run-cron.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

import { AssignmentCronService } from "../modules/projects/services/AssignmentCronService";

dotenv.config();

(async () => {
    try {
        // 1. Connect to MongoDB
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/freelancer-platform";
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");

        // 2. Run cron once
        const cronService = new AssignmentCronService();
        await cronService.runOnce();  // your helper that calls cronRotateExpired
        console.log("✅ Cron ran successfully");

        // 3. Close DB connection
        await mongoose.disconnect();
        console.log("✅ Disconnected");
        process.exit(0);
    } catch (err) {
        console.error("❌ Cron failed", err);
        process.exit(1);
    }
})();