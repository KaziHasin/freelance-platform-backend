import ProjectAssignment, {
  IProjectAssignment,
} from "../models/ProjectAssignment";

export class ProjectAssignmentRepository {
  async create(data: Partial<IProjectAssignment>) {
    return ProjectAssignment.create(data);
  }
  async findByProjectId(projectId: string) {
    return ProjectAssignment.find({ projectId });
  }
  async updateStatus(id: string, status: string) {
    return ProjectAssignment.findByIdAndUpdate(id, { status }, { new: true });
  }
}
