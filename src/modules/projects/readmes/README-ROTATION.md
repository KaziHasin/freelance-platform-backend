
# NOTES ON THE ROTATION ALGO & DSA

 Data structures: Use Mongo queries with sorting as a persistent priority queue.

Key order: assignedCount ASC, lastAssignedAt ASC, _id ASC — This approximates Round-Robin with Load-Balancing.  
• Bucketing by level: EXPERT → MID → FRESHER, or respect preferredLevel if provided.  
• 15-minute auto-rotation: node-cron checks PENDING assignments older than 15 minutes, marks them EXPIRED, then calls assignOrRotate() to move to the next best candidate.  
• Fairness: Each time a developer is assigned (even if they later reject/timeout), their assignedCount increments and lastAssignedAt updates, gradually pushing them back in the order so others get a chance — classic fair queue behavior.  
• Avoid repeats: triedDeveloperIds keeps history per project to skip already tried devs.  
• Scale: Add compound indexes on { isActive, level, skillIds, assignedCount, lastAssignedAt }.  
• Multi-instance: Keep all rotation state in Mongo. Cron can run on one worker pod only (e.g., via a leader election or a dedicated worker process).  

## SAMPLE REQUESTS

### 1) Resolve skills for tag input
**POST** `/api/v1/skills/resolve`

Request:
```json
{ "tags": ["AI", "Full Stack", "Project Manager"] }
```

Response:
```json
{ "skillIds": ["66f...", "66a...", "66b..."] }
```

### 2) Create project (+ immediate first assignment)

**POST** /api/v1/projects

Request
```json
{
  "title": "Build recommendation engine",
  "description": "Cold-start friendly",
  "skills": ["AI", "Full Stack"],
  "preferredLevel": "EXPERT",
  "createdByClientId": "64f0c0..."
}
```

## 3) Developer responds

**POST** /api/v1/projects/:id/respond

Request (accept):
```json
{ "developerId": "64f...", "accept": true }
```


Response:
```json
{ "status": "accepted", "assignment": { ... } }
```


Request (reject):
```json
{ "developerId": "64f...", "accept": false }
```


Response:
```json
{ "status": "rejected", "nextAssignment": { ... } }
```