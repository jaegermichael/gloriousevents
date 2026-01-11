export const roleToDayMapping: Record<string, { day: number; date: string; description: string }> = {
  CEO: { day: 1, date: "January 26, 2026", description: "Leadership & AI Strategy" },
  Executive: { day: 1, date: "January 26, 2026", description: "Leadership & AI Strategy" },
  CTO: { day: 2, date: "January 27, 2026", description: "Technical AI Implementation" },
  Developer: { day: 2, date: "January 27, 2026", description: "Technical AI Implementation" },
  Engineer: { day: 2, date: "January 27, 2026", description: "Technical AI Implementation" },
  Manager: { day: 3, date: "January 28, 2026", description: "AI Management & Operations" },
  "Product Manager": { day: 3, date: "January 28, 2026", description: "AI Management & Operations" },
  Student: { day: 4, date: "January 29, 2026", description: "AI Education & Learning" },
  Academic: { day: 4, date: "January 29, 2026", description: "AI Education & Learning" },
  Entrepreneur: { day: 5, date: "January 30, 2026", description: "AI Business Innovation" },
  "Startup Founder": { day: 5, date: "January 30, 2026", description: "AI Business Innovation" },
  Other: { day: 1, date: "January 26, 2026", description: "General Session" },
}

export function getAssignedDay(role: string): { day: number; date: string; description: string } {
  // Try exact match first
  if (roleToDayMapping[role]) {
    return roleToDayMapping[role]
  }

  // Try partial match (case insensitive)
  const lowerRole = role.toLowerCase()
  for (const [key, value] of Object.entries(roleToDayMapping)) {
    if (lowerRole.includes(key.toLowerCase())) {
      return value
    }
  }

  // Default to day 1
  return roleToDayMapping["Other"]
}

export const roleOptions = Object.keys(roleToDayMapping)
