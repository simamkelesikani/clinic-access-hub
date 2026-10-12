export const TRIAGE_LEVELS = ['Urgent', 'Routine', 'Preventive'];
export const CATEGORIES = ['General practice', 'Vaccinations', 'Mental health', 'Chronic care', "Women's health"];

export const SERVICES = [
  { id: 'gp', name: 'General consultation', category: 'General practice', triage: 'Routine', minutes: 20,
    description: 'Assessment and treatment of common illnesses with a doctor.' },
  { id: 'urgent', name: 'Same-day urgent care', category: 'General practice', triage: 'Urgent', minutes: 30,
    description: 'For injuries and sudden illness that cannot wait. Walk-in or booked.' },
  { id: 'vax-child', name: 'Childhood vaccinations', category: 'Vaccinations', triage: 'Preventive', minutes: 15,
    description: 'Routine immunisations with a clinic nurse.' },
  { id: 'vax-flu', name: 'Seasonal flu vaccine', category: 'Vaccinations', triage: 'Preventive', minutes: 10,
    description: 'Annual influenza vaccination for adults and teenagers.' },
  { id: 'counselling', name: 'Counselling session', category: 'Mental health', triage: 'Routine', minutes: 50,
    description: 'Confidential support with a registered counsellor.' },
  { id: 'crisis', name: 'Mental health urgent assessment', category: 'Mental health', triage: 'Urgent', minutes: 45,
    description: 'Same-day assessment when you or someone you know is struggling to cope.' },
  { id: 'chronic', name: 'Chronic condition review', category: 'Chronic care', triage: 'Routine', minutes: 30,
    description: 'Ongoing review for asthma, diabetes and hypertension.' },
  { id: 'family-planning', name: 'Family planning consultation', category: "Women's health", triage: 'Routine', minutes: 25,
    description: 'Contraception advice and women\'s health screening.' },
];

export const PRACTITIONERS = [
  { id: 'naidoo', name: 'Dr. A. Naidoo', role: 'General practitioner', next: 'Today 14:30' },
  { id: 'khumalo', name: 'Sr. T. Khumalo', role: 'Nurse (vaccinations)', next: 'Tomorrow 09:00' },
  { id: 'petersen', name: 'Dr. L. Petersen', role: 'Counsellor', next: 'Thursday 11:15' },
];

/* Simulated "latest" availability returned when the user presses refresh. */
export const REFRESHED_PRACTITIONERS = [
  { id: 'naidoo', name: 'Dr. A. Naidoo', role: 'General practitioner', next: 'Today 13:45' },
  { id: 'khumalo', name: 'Sr. T. Khumalo', role: 'Nurse (vaccinations)', next: 'Tomorrow 08:30' },
  { id: 'petersen', name: 'Dr. L. Petersen', role: 'Counsellor', next: 'Wednesday 15:00' },
];
