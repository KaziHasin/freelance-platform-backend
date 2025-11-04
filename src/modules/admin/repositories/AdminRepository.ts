import { Client } from "../../clients/models/Client";
import { Developer } from "../../developers/models/Developer";
import { Package } from "../../packages/models/Package";
import { Project } from "../../projects/models/Project";
import { Subscription } from "../../subscriptions/models/Subscription";

export class AdminRepository {
    async getDashboard() {
        const activeClients = await Client.countDocuments({ "verification.status": "APPROVED" });
        const activeDevs = await Developer.countDocuments({ "verification.status": "APPROVED" });
        const fresherDevs = await Developer.countDocuments({ level: "FRESHER" });
        const intermediateDevs = await Developer.countDocuments({ level: "INTERMEDIATE" });
        const expertDevs = await Developer.countDocuments({ level: "EXPERT" });
        const projects = await Project.countDocuments();
        const revenue = await Subscription.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        return { activeClients, activeDevs, fresherDevs, intermediateDevs, expertDevs, projects, revenue: revenue[0]?.total || 0 };
    }

}
