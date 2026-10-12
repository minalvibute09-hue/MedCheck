// Clinical Drug-Drug & Condition Interaction Safety Checker
// Designed to flag high-risk pharmacology conflicts for patient safety

const interactionRules = [
  {
    drugs: ["Atorvastatin", "Azithromycin"],
    severity: "Moderate Alert",
    title: "Statin + Macrolide Interaction Caution",
    description: "Azithromycin can inhibit CYP3A4 enzymes that metabolize statins, mildly increasing circulating Atorvastatin levels and risk of muscle soreness (myopathy).",
    recommendation: "Ensure doctor knows both prescriptions; report any unexplained muscle aching, tenderness, or weakness immediately."
  },
  {
    drugs: ["Metformin", "Glimepiride"],
    severity: "Precaution",
    title: "Dual Hypoglycemia Watch",
    description: "Glimepiride stimulates pancreatic insulin release while Metformin increases insulin sensitivity. Combined, they effectively drop sugar but carry risk of low blood sugar (hypoglycemia) if a meal is delayed.",
    recommendation: "Always eat meals on time after taking this tablet. Keep glucose candy accessible."
  },
  {
    drugs: ["Telmisartan", "Potassium"],
    severity: "Moderate Alert",
    title: "Hyperkalemia Watch",
    description: "Telmisartan is an Angiotensin Receptor Blocker (ARB) which can reduce potassium excretion through kidneys.",
    recommendation: "Avoid heavy potassium supplements or salt substitutes containing potassium chloride unless advised by nephrologist."
  },
  {
    drugs: ["NSAID", "Telmisartan"],
    severity: "High Alert",
    title: "Blood Pressure Med + Painkiller Conflict",
    description: "Frequent use of over-the-counter painkillers (like Ibuprofen, Diclofenac) can reduce the blood pressure lowering effect of Telmisartan and put strain on kidney filtration.",
    recommendation: "Prefer Paracetamol for mild pain/fever; consult doctor before taking anti-inflammatory pain relievers."
  }
];

export function checkDrugInteractions(medicationList) {
  if (!medicationList || medicationList.length === 0) return [];
  
  const medNames = medicationList.map(m => (m.name + " " + (m.generic || "")).toLowerCase());
  const detectedAlerts = [];

  for (const rule of interactionRules) {
    const matchCount = rule.drugs.filter(drug => 
      medNames.some(m => m.includes(drug.toLowerCase()))
    ).length;

    // Check if both or all required drugs are present
    if (matchCount >= rule.drugs.length) {
      detectedAlerts.push(rule);
    }
  }

  return detectedAlerts;
}
