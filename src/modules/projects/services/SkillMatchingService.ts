import { DevLevel } from "@/common/types/enums";
import { DeveloperRepository } from "@/modules/developers/repositories/DeveloperRepository";


export class SkillMatchingService {
    private devRepo = new DeveloperRepository();


    async getOrderedCandidates(requiredSkillIds: string[], preferredLevel?: DevLevel, excludeIds: string[] = []) {
        // 1) Try preferred level if provided; else try all levels in order Expert→Mid→Fresher
        const levels = preferredLevel ? [preferredLevel] : [DevLevel.EXPERT, DevLevel.MID, DevLevel.FRESHER];


        for (const lvl of levels) {
            const list = await this.devRepo.candidates(requiredSkillIds, lvl, excludeIds);
            if (list.length) return list; // return first non-empty level bucket
        }


        // Fallback: any level
        return this.devRepo.candidates(requiredSkillIds, undefined, excludeIds);
    }
}