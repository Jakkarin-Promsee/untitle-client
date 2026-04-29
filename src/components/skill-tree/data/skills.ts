export type SkillStatus = "mastered" | "in-progress" | "available" | "locked";

export type Skill = {
  id: string;
  code: string;
  name: string;
  branch: "PUSH" | "PULL" | "CORE" | "LEGS";
  tier: number;
  status: SkillStatus;
  progress?: number;
  xp: number;
  hold?: string;
  description: string;
  requires?: string[];
  callsign: string;
};

export const skills: Skill[] = [
  {
    id: "pushup",
    code: "P-01",
    name: "Push-Up Mastery",
    branch: "PUSH",
    tier: 0,
    status: "mastered",
    xp: 150,
    hold: "50 reps",
    callsign: "PUSH",
    description:
      "Foundation pressing chain calibrated. Shoulder & triceps recruitment locked in.",
  },
  {
    id: "dip",
    code: "P-02",
    name: "Dip Evolution",
    branch: "PUSH",
    tier: 1,
    status: "in-progress",
    progress: 64,
    xp: 250,
    hold: "12s lockout",
    callsign: "DIP",
    description:
      "Decrypting motor unit recruitment for vertical pressing chain. Neural drive at 64%.",
  },
  {
    id: "hspu",
    code: "P-03",
    name: "Handstand Push-Up",
    branch: "PUSH",
    tier: 2,
    status: "available",
    xp: 500,
    hold: "5 strict reps",
    callsign: "HSPU",
    description:
      "Inverted vertical press protocol. Requires shoulder stability and full-body line.",
  },
  {
    id: "planche",
    code: "P-04",
    name: "Planche Lean",
    branch: "PUSH",
    tier: 3,
    status: "locked",
    xp: 800,
    requires: ["hspu"],
    callsign: "PLNCH",
    description:
      "Anterior chain loading at maximum lean angle. Locked until HSPU mastery.",
  },

  {
    id: "pullup",
    code: "L-01",
    name: "Pull-Up Mastery",
    branch: "PULL",
    tier: 0,
    status: "mastered",
    xp: 150,
    hold: "20 reps",
    callsign: "PULL",
    description:
      "Vertical pulling protocol stable. Lats and biceps fully online.",
  },
  {
    id: "muscleup",
    code: "L-02",
    name: "Muscle-Up",
    branch: "PULL",
    tier: 1,
    status: "available",
    xp: 400,
    hold: "3 strict reps",
    callsign: "M-UP",
    description:
      "Transition protocol. Explosive pull into vertical press. Awaiting deployment.",
  },
  {
    id: "frontlever",
    code: "L-03",
    name: "Front Lever",
    branch: "PULL",
    tier: 2,
    status: "locked",
    xp: 700,
    requires: ["muscleup"],
    callsign: "F-LVR",
    description: "Horizontal hold facing the sky. Max lat tension protocol.",
  },

  {
    id: "lsit",
    code: "C-01",
    name: "L-Sit Hold",
    branch: "CORE",
    tier: 0,
    status: "available",
    xp: 200,
    hold: "20s",
    callsign: "L-SIT",
    description:
      "Compressive core protocol. Hip flexor and quad isometric load.",
  },
  {
    id: "vsit",
    code: "C-02",
    name: "V-Sit",
    branch: "CORE",
    tier: 1,
    status: "locked",
    xp: 450,
    requires: ["lsit"],
    callsign: "V-SIT",
    description:
      "Advanced compression. Legs above horizontal. Requires deep flexibility.",
  },

  {
    id: "squat",
    code: "G-01",
    name: "Pistol Squat",
    branch: "LEGS",
    tier: 0,
    status: "in-progress",
    progress: 30,
    xp: 300,
    hold: "5 each leg",
    callsign: "PSTL",
    description:
      "Unilateral lower body protocol. Balance and strength calibration.",
  },
  {
    id: "shrimp",
    code: "G-02",
    name: "Shrimp Squat",
    branch: "LEGS",
    tier: 1,
    status: "locked",
    xp: 550,
    requires: ["squat"],
    callsign: "SHRMP",
    description:
      "Asymmetric loading variant. Posterior chain recruitment elevated.",
  },
];

export const branches = [
  {
    id: "PUSH" as const,
    label: "Pushing Chain",
    code: "AXIS-P",
    parts: ["chest", "frontDelt", "triceps"],
  },
  {
    id: "PULL" as const,
    label: "Pulling Chain",
    code: "AXIS-L",
    parts: ["lats", "rearDelt", "biceps", "forearm"],
  },
  {
    id: "CORE" as const,
    label: "Core Compression",
    code: "AXIS-C",
    parts: ["abs", "obliques", "hipFlexor"],
  },
  {
    id: "LEGS" as const,
    label: "Lower Body",
    code: "AXIS-G",
    parts: ["quads", "hamstring", "glutes", "calves"],
  },
];

export type BranchId = (typeof branches)[number]["id"];

/** Returns mastery percentage 0-100 for a branch (mastered = 100, in-progress contributes its progress, others 0). */
export function branchProgress(id: BranchId): number {
  const list = skills.filter((s) => s.branch === id);
  if (list.length === 0) return 0;
  const total = list.reduce((acc, s) => {
    if (s.status === "mastered") return acc + 100;
    if (s.status === "in-progress") return acc + (s.progress ?? 0);
    return acc;
  }, 0);
  return Math.round(total / list.length);
}
