export type Direction =
  | "North" | "Northeast" | "East" | "Southeast"
  | "South" | "Southwest" | "West" | "Northwest";

export interface VastuInput {
  facing: Direction;
  entrance: Direction;
  hall: Direction;
  masterBedroom: Direction;
  kitchen: Direction;
  toilet: Direction;
}

export interface VastuResult {
  vastu_score: number;
  vastu_label: string;
  vastu_facing: Direction;
  vastu_entrance: Direction;
  vastu_hall: Direction;
  vastu_master_bedroom: Direction;
  vastu_kitchen: Direction;
  vastu_toilet: Direction;
  vastu_positives: string[];
  vastu_doshas: string[];
}

// --- Ideal directions (based on standard Vastu guidelines) ---
const IDEAL: Record<keyof Omit<VastuInput, "facing">, Direction[]> = {
  entrance: ["North", "East", "Northeast"],
  hall: ["North", "Northeast", "East"],
  masterBedroom: ["Southwest", "South", "West"], // SW is best; S/W acceptable
  kitchen: ["Southeast", "Northwest"],           // SE is ideal; NW is alternative
  toilet: ["West", "Northwest", "South"],        // West/NW preferred; avoid NE
};

// Rooms that are highly sensitive to direction
const HIGH_RISK: (keyof Omit<VastuInput, "facing">)[] = ["kitchen", "toilet"];

const LABEL_FOR: Record<keyof Omit<VastuInput, "facing">, string> = {
  entrance: "Main Entrance",
  hall: "Hall",
  masterBedroom: "Master Bedroom",
  kitchen: "Kitchen",
  toilet: "Toilet",
};

/**
 * Computes a Vastu score (0–5) and generates positives/doshas arrays.
 *
 * Weighting:
 * - Entrance: 1.0
 * - Hall: 0.8
 * - Master Bedroom: 0.8
 * - Kitchen: 0.8
 * - Toilet: 0.6
 * Total possible: 4.0 → normalized to 5.0 by multiplying by 1.25
 */
export function computeVastu(input: VastuInput): VastuResult {
  let rawScore = 0;
  const positives: string[] = [];
  const doshas: string[] = [];

  const checks: { key: keyof typeof IDEAL; weight: number }[] = [
    { key: "entrance", weight: 1.0 },
    { key: "hall", weight: 0.8 },
    { key: "masterBedroom", weight: 0.8 },
    { key: "kitchen", weight: 0.8 },
    { key: "toilet", weight: 0.6 },
  ];

  for (const { key, weight } of checks) {
    const value = input[key];
    const ideal = IDEAL[key];

    if (ideal.includes(value)) {
      rawScore += weight;
      positives.push(`${LABEL_FOR[key]} in ${value}`);
    } else {
      // Determine severity for the dosha message
      const isSevere =
        HIGH_RISK.includes(key) &&
        ((key === "kitchen" && value === "Northeast") ||
          (key === "toilet" && value === "Northeast"));

      const idealText = ideal.join("/");
      const severity = isSevere ? "severe dosha" : "minor remedy required";

      doshas.push(
        `${LABEL_FOR[key]} in ${value} (${idealText} is ideal; ${severity})`
      );
    }
  }

  // Normalize rawScore (max 4.0) to 0–5 scale
  const score = Math.min(5, +(rawScore * 1.25).toFixed(1));

  // Derive label
  let label: string;
  if (score >= 4.5) label = "Perfect Alignment";
  else if (score >= 3.5) label = "Highly Compliant";
  else if (score >= 2.5) label = "Average";
  else if (score >= 1.5) label = "Needs Remedies";
  else label = "Major Doshas";

  // If no positives, ensure doshas aren’t empty
  if (positives.length === 0 && doshas.length === 0) {
    doshas.push("No directional data provided.");
  }

  return {
    vastu_score: score,
    vastu_label: label,
    vastu_facing: input.facing,
    vastu_entrance: input.entrance,
    vastu_hall: input.hall,
    vastu_master_bedroom: input.masterBedroom,
    vastu_kitchen: input.kitchen,
    vastu_toilet: input.toilet,
    vastu_positives: positives,
    vastu_doshas: doshas,
  };
}