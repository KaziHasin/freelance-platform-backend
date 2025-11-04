import { AdminRepository } from "../repositories/AdminRepository";

export class AdminService {
    private repo = new AdminRepository();

    async getDashboard() {
        return this.repo.getDashboard();
    }

}
