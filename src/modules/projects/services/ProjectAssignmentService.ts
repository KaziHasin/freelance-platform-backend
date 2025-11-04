import { ProjectAssignmentRepository } from "../repositories/ProjectAssignmentRepository";

export class ProjectAssignmentService {
  private assignmentRepo = new ProjectAssignmentRepository();

  async assignDeveloper(data: any) {
    // TODO: Add rotation and assignment logic
    return this.assignmentRepo.create(data);
  }
  async getAssignmentsByProject(projectId: string) {
    return this.assignmentRepo.findByProjectId(projectId);
  }
  async updateAssignmentStatus(id: string, status: string) {
    return this.assignmentRepo.updateStatus(id, status);
  }
}
