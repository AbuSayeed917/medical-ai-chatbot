const mongoose = require('mongoose');
const MedicalKnowledge = require('../../backend/models/MedicalKnowledge');

const medicalData = [
  // Symptoms
  {
    term: "fever",
    category: "symptom",
    definition: "An elevated body temperature above the normal range, typically above 100.4°F (38°C).",
    description: "Fever is a common symptom that indicates the body's immune response to infection, inflammation, or other medical conditions. It's characterized by an increase in body temperature regulated by the hypothalamus.",
    synonyms: ["pyrexia", "hyperthermia", "elevated temperature"],
    relatedTerms: ["chills", "sweating", "infection", "inflammation"],
    severity: "medium",
    commonCauses: [
      "Viral infections (common cold, flu)",
      "Bacterial infections",
      "Inflammatory conditions",
      "Heat exhaustion",
      "Certain medications",
      "Autoimmune disorders"
    ],
    symptoms: [
      "Body temperature above 100.4°F (38°C)",
      "Chills and shivering",
      "Sweating",
      "Headache",
      "Muscle aches",
      "Fatigue",
      "Dehydration"
    ],
    treatments: [
      "Rest and increased fluid intake",
      "Acetaminophen or ibuprofen",
      "Cool compresses",
      "Light clothing",
      "Treat underlying cause"
    ],
    prevention: [
      "Good hygiene practices",
      "Regular handwashing",
      "Vaccination",
      "Avoid close contact with sick individuals"
    ],
    whenToSeeDoctor: "Seek medical attention if fever exceeds 103°F (39.4°C), persists for more than 3 days, or is accompanied by severe symptoms like difficulty breathing, chest pain, or altered mental status.",
    medicalSpecialty: ["Internal Medicine", "Family Medicine", "Pediatrics"],
    ageGroup: ["All ages"],
    isVerified: true
  },
  {
    term: "headache",
    category: "symptom",
    definition: "Pain or discomfort in the head, scalp, or neck area.",
    description: "Headaches are one of the most common medical complaints, ranging from mild discomfort to severe, debilitating pain. They can be primary (not caused by another condition) or secondary (resulting from an underlying medical issue).",
    synonyms: ["cephalgia", "head pain"],
    relatedTerms: ["migraine", "tension headache", "cluster headache", "stress"],
    severity: "low",
    commonCauses: [
      "Tension and stress",
      "Dehydration",
      "Lack of sleep",
      "Eye strain",
      "Sinus congestion",
      "Medication overuse",
      "Hormonal changes"
    ],
    symptoms: [
      "Pain in head, scalp, or neck",
      "Pressure sensation",
      "Throbbing or pulsating pain",
      "Sensitivity to light or sound",
      "Nausea (in some cases)"
    ],
    treatments: [
      "Over-the-counter pain relievers",
      "Rest in quiet, dark room",
      "Apply cold or warm compress",
      "Adequate hydration",
      "Stress management techniques",
      "Regular sleep schedule"
    ],
    prevention: [
      "Maintain regular sleep schedule",
      "Stay hydrated",
      "Manage stress",
      "Avoid known triggers",
      "Regular exercise",
      "Balanced diet"
    ],
    whenToSeeDoctor: "Seek immediate medical attention for sudden, severe headaches, headaches with fever and neck stiffness, or headaches following head injury.",
    medicalSpecialty: ["Neurology", "Family Medicine"],
    ageGroup: ["All ages"],
    isVerified: true
  },

  // Diseases
  {
    term: "hypertension",
    category: "disease",
    definition: "A chronic medical condition characterized by persistently elevated blood pressure in the arteries.",
    description: "Hypertension, commonly known as high blood pressure, is often called the 'silent killer' because it typically has no symptoms but can lead to serious cardiovascular complications if left untreated.",
    synonyms: ["high blood pressure"],
    relatedTerms: ["cardiovascular disease", "stroke", "heart attack", "kidney disease"],
    severity: "high",
    commonCauses: [
      "Genetics",
      "Age",
      "Obesity",
      "Sedentary lifestyle",
      "High sodium intake",
      "Excessive alcohol consumption",
      "Smoking",
      "Chronic stress"
    ],
    symptoms: [
      "Usually asymptomatic",
      "Headaches (in severe cases)",
      "Dizziness",
      "Nosebleeds",
      "Shortness of breath"
    ],
    treatments: [
      "Lifestyle modifications",
      "ACE inhibitors",
      "Beta-blockers",
      "Diuretics",
      "Calcium channel blockers",
      "Regular monitoring"
    ],
    prevention: [
      "Regular exercise",
      "Healthy diet (DASH diet)",
      "Weight management",
      "Limit sodium intake",
      "Moderate alcohol consumption",
      "Stress management",
      "No smoking"
    ],
    whenToSeeDoctor: "Regular monitoring is essential. Seek immediate care if blood pressure is severely elevated (>180/120) or if experiencing symptoms like chest pain or difficulty breathing.",
    medicalSpecialty: ["Cardiology", "Internal Medicine"],
    ageGroup: ["Adults"],
    isVerified: true
  },
  {
    term: "diabetes mellitus",
    category: "disease",
    definition: "A group of metabolic disorders characterized by high blood glucose levels due to insulin deficiency or resistance.",
    description: "Diabetes mellitus is a chronic condition affecting how the body processes glucose. There are several types, with Type 1 and Type 2 being most common, each requiring different management approaches.",
    synonyms: ["diabetes"],
    relatedTerms: ["insulin", "glucose", "blood sugar", "pancreas", "metabolism"],
    severity: "high",
    commonCauses: [
      "Autoimmune destruction of pancreatic cells (Type 1)",
      "Insulin resistance (Type 2)",
      "Genetics",
      "Obesity",
      "Sedentary lifestyle",
      "Age"
    ],
    symptoms: [
      "Increased thirst and urination",
      "Unexplained weight loss",
      "Fatigue",
      "Blurred vision",
      "Slow-healing wounds",
      "Frequent infections"
    ],
    treatments: [
      "Insulin therapy (Type 1, sometimes Type 2)",
      "Oral medications (Type 2)",
      "Blood glucose monitoring",
      "Dietary management",
      "Regular exercise",
      "Regular medical check-ups"
    ],
    prevention: [
      "Healthy weight maintenance",
      "Regular physical activity",
      "Balanced diet",
      "Limit processed foods",
      "Regular health screenings"
    ],
    whenToSeeDoctor: "Seek immediate care for symptoms of diabetic ketoacidosis or severe hypoglycemia. Regular monitoring and management with healthcare providers is essential.",
    medicalSpecialty: ["Endocrinology", "Internal Medicine"],
    ageGroup: ["All ages"],
    isVerified: true
  },

  // Anatomy
  {
    term: "heart",
    category: "anatomy",
    definition: "A muscular organ that pumps blood throughout the body via the circulatory system.",
    description: "The heart is a four-chambered organ located in the thoracic cavity. It consists of two atria and two ventricles, and is responsible for maintaining circulation of blood, oxygen, and nutrients throughout the body.",
    synonyms: ["cardiac muscle", "myocardium"],
    relatedTerms: ["cardiovascular system", "blood circulation", "cardiac cycle", "atrium", "ventricle"],
    commonCauses: [],
    symptoms: [],
    treatments: [],
    prevention: [],
    medicalSpecialty: ["Cardiology", "Cardiovascular Surgery", "Anatomy"],
    ageGroup: ["All ages"],
    isVerified: true
  },
  {
    term: "lungs",
    category: "anatomy",
    definition: "Paired respiratory organs responsible for gas exchange between the air and blood.",
    description: "The lungs are spongy, air-filled organs located on either side of the chest. They facilitate the exchange of oxygen and carbon dioxide through millions of tiny air sacs called alveoli.",
    synonyms: ["pulmonary organs"],
    relatedTerms: ["respiratory system", "breathing", "oxygen", "carbon dioxide", "alveoli", "bronchi"],
    medicalSpecialty: ["Pulmonology", "Respiratory Medicine", "Anatomy"],
    ageGroup: ["All ages"],
    isVerified: true
  },

  // Medications
  {
    term: "acetaminophen",
    category: "medication",
    definition: "An over-the-counter analgesic and antipyretic medication used to treat pain and reduce fever.",
    description: "Acetaminophen is one of the most commonly used medications for pain relief and fever reduction. It works by blocking pain signals in the brain and affecting the brain's temperature regulation center.",
    synonyms: ["paracetamol", "tylenol"],
    relatedTerms: ["analgesic", "antipyretic", "pain relief", "fever reducer"],
    commonCauses: [],
    symptoms: [],
    treatments: [
      "Pain relief",
      "Fever reduction",
      "Safe when used as directed",
      "Can be used with other medications (consult healthcare provider)"
    ],
    prevention: [
      "Follow dosing instructions",
      "Do not exceed maximum daily dose",
      "Avoid alcohol when taking",
      "Check other medications for acetaminophen content"
    ],
    whenToSeeDoctor: "Consult healthcare provider if pain or fever persists, or if experiencing signs of liver problems.",
    medicalSpecialty: ["Pharmacy", "Internal Medicine"],
    ageGroup: ["All ages"],
    isVerified: true
  }
];

const seedMedicalKnowledge = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-chatbot');
    
    console.log('Clearing existing medical knowledge...');
    await MedicalKnowledge.deleteMany({});
    
    console.log('Seeding medical knowledge...');
    await MedicalKnowledge.insertMany(medicalData);
    
    console.log(`Successfully seeded ${medicalData.length} medical knowledge entries`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding medical knowledge:', error);
    process.exit(1);
  }
};

module.exports = { seedMedicalKnowledge, medicalData };