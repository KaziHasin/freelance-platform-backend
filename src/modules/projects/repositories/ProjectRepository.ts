import { Project } from "../models/Project";
import type { IProject } from "../models/Project";
import { FilterQuery } from "mongoose";

export class ProjectRepository {
  create(data: Partial<IProject>) {
    return Project.create(data);
  }
  findById(id: string) {
    return Project.findById(id);
  }
  find(filter: FilterQuery<IProject>, page = 1, limit = 20) {
    return Project.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }
  count(filter: FilterQuery<IProject>) {
    return Project.countDocuments(filter);
  }
  update(id: string, data: Partial<IProject>) {
    return Project.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id: string) {
    return Project.findByIdAndDelete(id);
  }
}
