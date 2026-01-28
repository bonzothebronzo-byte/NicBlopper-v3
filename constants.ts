// Pharmacokinetic Estimations
// Based on adult male 65kg
// Bioavailability (F): 0.55 (55% absorbed from gum)
// Volume of Distribution (Vd): ~3 L/kg * 65kg = 195 L
// Elimination Half-life (t1/2): ~120 minutes
// Absorption peak time: ~30-45 minutes

export const PHARMA = {
  BIOAVAILABILITY: 0.55,
  VOLUME_DISTRIBUTION_L: 195,
  HALF_LIFE_MINUTES: 120,
  TIME_TO_PEAK_MINUTES: 35, // Approximate
  MAX_DAILY_DOSE_MG: 40,
};

// Derived constants
export const KE = Math.log(2) / PHARMA.HALF_LIFE_MINUTES; // Elimination rate constant
// Simplified KA approximation based on Tmax = ln(Ka/Ke) / (Ka - Ke)
// For Tmax = 35 and Ke = 0.00577, Ka is approx 0.05
export const KA = 0.05; 

export const UI_CONSTANTS = {
  SPIT_OUT_TIME_MIN: 31,
  NEXT_DOSE_TIME_MIN: 55,
};