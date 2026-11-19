"use client";

import { useState } from "react";

const DIRECTIONS = [
  "North", "Northeast", "East", "Southeast",
  "South", "Southwest", "West", "Northwest",
] as const;

interface Props {
  // If editing an existing property, pass initial values
  initial?: Partial<Record<string, string>>;
}

export default function VastuFormFields({ initial = {} }: Props) {
  const [values, setValues] = useState({
    facing: initial.vastu_facing ?? "",
    entrance: initial.vastu_entrance ?? "",
    hall: initial.vastu_hall ?? "",
    masterBedroom: initial.vastu_master_bedroom ?? "",
    kitchen: initial.vastu_kitchen ?? "",
    toilet: initial.vastu_toilet ?? "",
  });

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const field = (label: string, key: keyof typeof values, required = true) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <select
        name={`vastu_${key}`}
        value={values[key]}
        onChange={(e) => handleChange(key, e.target.value)}
        required={required}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
      >
        <option value="" disabled>Select direction</option>
        {DIRECTIONS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">Vastu Details</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select the directions for each room. The Vastu score will be calculated automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Facing Direction", "facing")}
        {field("Main Entrance", "entrance")}
        {field("Hall / Living Room", "hall")}
        {field("Master Bedroom", "masterBedroom")}
        {field("Kitchen", "kitchen")}
        {field("Toilet", "toilet")}
      </div>
    </div>
  );
}