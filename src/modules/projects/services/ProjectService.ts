import { ProjectRepository } from "../repositories/ProjectRepository";
import { AssignmentRotationService } from "./AssignmentRotationService";
import { SkillService } from "./SkillService";
import { SubscriptionRepository } from "@/modules/subscriptions/repositories/SubscriptionRepository";
import { Types } from "mongoose";

export class ProjectService {

  constructor(
    private projectRepo = new ProjectRepository(),
    private skillService = new SkillService(),
    private subscriptionRepo = new SubscriptionRepository(),
    private assignmentRotation = new AssignmentRotationService()
  ) { }


  async createProject(data: any, file?: Express.Multer.File) {

    const clientId = data.clientId;
    const subscription = await this.subscriptionRepo.getActiveSubscription(clientId as Types.ObjectId);

    if (!subscription) {
      throw new Error("You do not have an active subscription.");
    }

    const pkg = subscription.packageId as any;

    if (subscription.isTrial) {
      const projectCount = await this.projectRepo.count({
        clientId,
        createdAt: {
          $gte: subscription.startDate,
          $lte: subscription.endDate || new Date()
        }
      });
      if (projectCount >= 1) {
        throw new Error("Free trial users can only post 1 project.");
      }
    }

    if (pkg.projectsPerMonth !== null) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const projectCount = await this.projectRepo.count({
        clientId,
        createdAt: { $gte: startOfMonth }
      });

      if (projectCount >= pkg.projectsPerMonth) {
        throw new Error(`Your package allows only ${pkg.projectsPerMonth} projects per month.`);
      }
    }
    const requiredSkillIds = await this.skillService.resolveSkillIds(data.requiredSkillIds);

    if (file) {
      data.agreementFileUrl = `/uploads/${file.filename}`;
    }
    const toCreate = { ...data, requiredSkillIds };

    const project = await this.projectRepo.create(toCreate);

    const assignment = await this.assignmentRotation.assignOrRotate((project._id as Types.ObjectId).toString(), requiredSkillIds, data.preferredLevel);
    return { project, assignment };
  }

  async getProject(id: string) {
    return this.projectRepo.findById(id);
  }

  async listProjects(q?: string, page = 1, limit = 20) {
    const filter = q
      ? {
        $or: [
          { title: new RegExp(q, "i") },
          { description: new RegExp(q, "i") },
        ],
      }
      : {};
    const [items, total] = await Promise.all([
      this.projectRepo.find(filter, page, limit),
      this.projectRepo.count(filter),
    ]);
    return { items, total, page, limit };
  }

  async updateProject(id: string, data: any) {
    return this.projectRepo.update(id, data);
  }

  async deleteProject(id: string) {
    return this.projectRepo.delete(id);
  }
}
