import { AssignmentRotationService } from "./AssignmentRotationService";
import cron from 'node-cron';


export class AssignmentCronService {
    private assignmentRotation = new AssignmentRotationService();


    boot() {
        // run every minute
        cron.schedule('* * * * *', async () => {
            try { await this.assignmentRotation.cronRotateExpired(); } catch (e) { console.error('cron error', e); }
        });
    }

    async runOnce() {
        await this.assignmentRotation.cronRotateExpired();
    }
}