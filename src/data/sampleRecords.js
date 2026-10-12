// Realistic Medical Records Dataset for MedCheck Hackathon Demo

export const sampleRecords = [
  {
    id: "rec-rx-001",
    title: "Prescription: Diabetes & Hypertension",
    type: "prescription",
    doctorName: "Dr. Rajesh Sharma, MD (Internal Med)",
    doctorReg: "MCI-48291",
    facility: "Max Super Speciality Hospital, New Delhi",
    date: "2024-03-12",
    scanType: "Doctor Prescription (Digital/Physical)",
    rawOcrText: `MAX SUPER SPECIALITY HOSPITAL
1, Press Enclave Road, Saket, New Delhi - 110017
Dr. Rajesh Sharma, MD, DM (Cardio/Med) | Reg: MCI-48291
Date: 12-Mar-2024
Patient: Rahul Kumar Sharma | Age: 36 Yrs | Sex: Male
Weight: 78 kg | BP: 142/90 mmHg | Pulse: 78 bpm

Rx:
1. Tab. Glycomet-GP 1 Forte (Metformin 1000mg + Glimepiride 1mg)
   1 tab twice daily (1-0-1) - After meals - 30 days
2. Tab. Telma-40 (Telmisartan 40mg)
   1 tab daily (1-0-0) - Morning after breakfast - 30 days
3. Tab. Atorva-10 (Atorvastatin 10mg)
   1 tab at night (0-0-1) - Post dinner - 30 days
4. Tab. Neurobion Forte (B-Complex + B12)
   1 tab daily (0-1-0) - 30 days

Advice:
- Restrict salt intake (<5g/day)
- 45 min brisk walking daily
- Avoid simple sugars & refined carbs
- Repeat HbA1c, Lipid Profile, Serum Creatinine in 3 months
- Review in OPD after 3 months or SOS if dizziness occurs`,
    diagnoses: [
      { name: "Type 2 Diabetes Mellitus", icd10: "E11.9", snomedCode: "44054006", severity: "Moderate" },
      { name: "Essential Hypertension (Stage 1)", icd10: "I10", snomedCode: "59621000", severity: "Moderate" },
      { name: "Mixed Dyslipidemia", icd10: "E78.2", snomedCode: "370992007", severity: "Mild" }
    ],
    medications: [
      {
        name: "Metformin + Glimepiride (Glycomet-GP 1)",
        generic: "Metformin 1000mg + Glimepiride 1mg",
        dosage: "1000mg / 1mg",
        frequency: "1-0-1 (Twice Daily)",
        timing: "Immediately After Meals",
        duration: "30 Days",
        purpose: "Lowers blood glucose by increasing insulin sensitivity & secretion",
        sideEffects: "Mild nausea, risk of low blood sugar (hypoglycemia) if meal skipped",
        snomedCode: "372567009"
      },
      {
        name: "Telmisartan (Telma 40)",
        generic: "Telmisartan",
        dosage: "40mg",
        frequency: "1-0-0 (Once Daily)",
        timing: "Morning after breakfast",
        duration: "30 Days",
        purpose: "Relaxes blood vessels and lowers blood pressure to protect heart & kidneys",
        sideEffects: "Dizziness on standing quickly; stay hydrated",
        snomedCode: "386864001"
      },
      {
        name: "Atorvastatin (Atorva 10)",
        generic: "Atorvastatin Calcium",
        dosage: "10mg",
        frequency: "0-0-1 (Once Daily)",
        timing: "Night before bed",
        duration: "30 Days",
        purpose: "Reduces bad cholesterol (LDL) and prevents arterial plaque buildup",
        sideEffects: "Occasional mild muscle soreness",
        snomedCode: "387584000"
      },
      {
        name: "Neurobion Forte",
        generic: "Vitamin B-Complex + B12",
        dosage: "Standard",
        frequency: "0-1-0 (Once Daily)",
        timing: "After lunch",
        duration: "30 Days",
        purpose: "Nerve health support (often co-prescribed with long-term Metformin)",
        sideEffects: "Well tolerated",
        snomedCode: "261271004"
      }
    ],
    vitals: {
      bp: "142/90 mmHg",
      systolic: 142,
      diastolic: 90,
      weight: "78 kg",
      pulse: "78 bpm"
    },
    labValues: [],
    plainSummary: {
      en: "This prescription shows you are being managed for Type 2 Diabetes and mildly elevated Blood Pressure (142/90 mmHg). Dr. Sharma prescribed Metformin with Glimepiride to help control your blood sugar, Telmisartan to protect your blood vessels and kidneys, and a low-dose Statin to keep your cholesterol healthy. Take your sugar medicine right after meals to avoid stomach upset or sudden sugar drops.",
      hi: "इस पर्चे से पता चलता है कि आपका टाइप 2 डायबिटीज और बढ़े हुए ब्लड प्रेशर (142/90 mmHg) का इलाज चल रहा है। डॉ. शर्मा ने शुगर नियंत्रित करने के लिए मेटफ़ॉर्मिन+ग्लिमेपिराइड, बीपी सामान्य रखने और गुर्दे की सुरक्षा के लिए टेलमिसार्टन, और कोलेस्ट्रॉल के लिए एटोरवास्टेटिन लिखी है। कृपया शुगर की दवा भोजन के तुरंत बाद लें ताकि कमजोरी या चक्कर न आएं।",
      te: "ఈ ప్రిస్క్రిప్షన్ మీరు టైప్ 2 డయాబెటిస్ మరియు కొద్దిగా ఎక్కువ రక్తపోటు (142/90 mmHg) కోసం చికిత్స పొందుతున్నారని చూపిస్తుంది. డాక్టర్ మీ రక్తంలో చక్కెరను నియంత్రించడానికి మెట్‌ఫార్మిన్, గుండె మరియు మూత్రపిండాలను రక్షించడానికి టెల్మిసార్టాన్ సూచించారు. భోజనం చేసిన వెంటనే షుగర్ మందు తీసుకోండి.",
      ta: "இந்த மருந்துச்சீட்டு நீங்கள் வகை 2 நீரிழிவு மற்றும் லேசான உயர் இரத்த அழுத்தத்திற்கு (142/90 mmHg) சிகிச்சை பெறுவதைக் காட்டுகிறது. மருத்துவர் சர்க்கரையைக் கட்டுப்படுத்தவும், இரத்த அழுத்தத்தைக் குறைத்து சிறுநீரகத்தைப் பாதுகாக்கவும் மருந்துகளை பரிந்துரைத்துள்ளார். உணவுக்குப் பிறகு சர்க்கரை மாத்திரையை எடுத்துக் கொள்ளுங்கள்.",
      mr: "हे प्रिस्क्रिप्शन दर्शवते की तुमच्यावर टाईप 2 मधुमेह आणि वाढलेल्या रक्तदाबासाठी (142/90 mmHg) उपचार सुरू आहेत. डॉ. शर्मा यांनी रक्तातील साखर नियंत्रित करण्यासाठी मेटफॉर्मिन, आणि रक्तदाब नियंत्रणासाठी टेलमिसार्टन लिहून दिले आहे. जेवणानंतर लगेच औषध घ्या.",
      bn: "এই প্রেসক্রিপশনটি নির্দেশ করে যে আপনি টাইপ ২ ডায়াবেটিস এবং সামান্য উচ্চ রক্তচাপের (১৪২/৯০ mmHg) চিকিৎসা নিচ্ছেন। রক্তে শর্করা নিয়ন্ত্রণের জন্য মেটফর্মিন এবং রক্তচাপ নিয়ন্ত্রণের জন্য টেলমিসারটান দেওয়া হয়েছে। খাবারের ঠিক পরে চিনির ওষুধ সেবন করুন।"
    },
    abnormalFindings: [
      {
        parameter: "Blood Pressure",
        observed: "142/90 mmHg",
        normalRange: "< 120/80 mmHg",
        severity: "Elevated",
        explanation: "Your systolic and diastolic pressures are above optimal range. Regular medication and reducing salt intake are key."
      }
    ],
    lifestyleTips: [
      "Keep dietary sodium under 5 grams (about 1 teaspoon of salt per day).",
      "Do at least 45 minutes of brisk walking 5 days a week.",
      "Replace white rice/refined flour with high-fiber grains like oats, brown rice, or millets (ragi, jowar).",
      "Always carry hard candies or glucose tabs when travelling in case you experience low sugar symptoms."
    ],
    doctorQuestions: [
      "Should I check my fasting and post-meal sugar with a home glucometer weekly?",
      "Are there specific symptoms of low sugar (hypoglycemia) I and my family should recognize?",
      "Can I take Telmisartan in the morning if I feel slightly dizzy upon waking?"
    ]
  },
  {
    id: "rec-lab-002",
    title: "Lab Report: Comprehensive Metabolic & Lipid Panel",
    type: "lab_report",
    doctorName: "Dr. Sunita Rao, MD (Biochem)",
    doctorReg: "KMC-77182",
    facility: "Metropolis Healthcare Diagnostic Labs",
    date: "2024-03-10",
    scanType: "Diagnostic Blood Report",
    rawOcrText: `METROPOLIS HEALTHCARE LTD.
Accredited by NABL & CAP
Patient Name: Rahul Kumar Sharma | Age: 36 Y | Sex: M
Sample Collected: 10-Mar-2024 07:30 AM | Reported: 10-Mar-2024 06:15 PM

BIOCHEMISTRY & METABOLIC PANEL
Test Name                     Result     Unit       Biological Ref Range     Status
Fasting Blood Sugar (FBS)     148.0      mg/dL      70.0 - 99.0              HIGH
HbA1c (Glycated Hemoglobin)   8.2        %          < 5.7 (Normal)           HIGH
                                                    5.7 - 6.4 (Prediabetes)
                                                    > 6.5 (Diabetes)
Estimated Avg Glucose (eAG)   189.0      mg/dL      90 - 120                 HIGH

LIPID PROFILE
Total Cholesterol             228.0      mg/dL      < 200.0                  HIGH
Serum Triglycerides           242.0      mg/dL      < 150.0                  HIGH
HDL Cholesterol (Good)        38.0       mg/dL      > 40.0                   LOW
LDL Cholesterol (Calculated)  141.6      mg/dL      < 100.0                  HIGH
VLDL Cholesterol              48.4       mg/dL      < 30.0                   HIGH

RENAL FUNCTION TEST (KIDNEY)
Serum Creatinine              1.08       mg/dL      0.70 - 1.20              NORMAL
Blood Urea Nitrogen (BUN)     18.2       mg/dL      7.0 - 20.0               NORMAL
eGFR (CKD-EPI)                89         mL/min     > 90.0                   BORDERLINE

LIVER FUNCTION (HEPATIC)
SGOT / AST                    28.0       U/L        < 40.0                   NORMAL
SGPT / ALT                    46.0       U/L        < 41.0                   BORDERLINE`,
    diagnoses: [
      { name: "Uncontrolled Hyperglycemia", icd10: "R73.9", snomedCode: "80394007", severity: "High" },
      { name: "Atherogenic Dyslipidemia", icd10: "E78.5", snomedCode: "370992007", severity: "High" }
    ],
    medications: [],
    vitals: {},
    labValues: [
      {
        testName: "HbA1c (Glycated Hemoglobin)",
        value: "8.2",
        unit: "%",
        referenceRange: "< 5.7 %",
        status: "High",
        loincCode: "4548-4",
        plainExplanation: "HbA1c reflects your average blood sugar over the last 90 days. A reading of 8.2% indicates that sugar has been consistently elevated above the recommended diabetic goal of 7.0%."
      },
      {
        testName: "Fasting Blood Sugar",
        value: "148.0",
        unit: "mg/dL",
        referenceRange: "70 - 99 mg/dL",
        status: "High",
        loincCode: "1558-6",
        plainExplanation: "Your morning fasting glucose is 148 mg/dL, which is 49 points above the upper normal limit, showing that liver glucose release during sleep is heightened."
      },
      {
        testName: "Serum Triglycerides",
        value: "242.0",
        unit: "mg/dL",
        referenceRange: "< 150 mg/dL",
        status: "High",
        loincCode: "2571-8",
        plainExplanation: "Triglycerides are blood fats linked to carbohydrate intake and insulin resistance. 242 mg/dL increases vascular risk; dietary cutbacks in refined sugar and alcohol help lower this."
      },
      {
        testName: "Total Cholesterol",
        value: "228.0",
        unit: "mg/dL",
        referenceRange: "< 200 mg/dL",
        status: "High",
        loincCode: "2093-3",
        plainExplanation: "Elevated total blood cholesterol. Lifestyle changes and statin therapy (prescribed by Dr. Sharma) are directly targeted at this."
      },
      {
        testName: "HDL Cholesterol ('Good')",
        value: "38.0",
        unit: "mg/dL",
        referenceRange: "> 40 mg/dL",
        status: "Low",
        loincCode: "2085-9",
        plainExplanation: "HDL helps sweep excess bad cholesterol out of the arteries. Aerobic exercise, walnuts, and healthy fats (flaxseed, olive oil) help raise HDL."
      },
      {
        testName: "Serum Creatinine",
        value: "1.08",
        unit: "mg/dL",
        referenceRange: "0.7 - 1.2 mg/dL",
        status: "Normal",
        loincCode: "2160-0",
        plainExplanation: "Reassuring news: your kidney filtration baseline is within the normal healthy range."
      }
    ],
    plainSummary: {
      en: "This lab report indicates that your blood sugar and blood lipids (fats) require active management. Your HbA1c is 8.2% (target is under 7.0%), meaning your blood sugar has run high over the past 3 months. Your Triglycerides (242) and Total Cholesterol (228) are also elevated. Fortunately, your kidney function (Creatinine 1.08) remains completely healthy. The medications recently prescribed by your doctor are well-suited to bring these values back into target.",
      hi: "यह लैब रिपोर्ट बताती है कि आपकी ब्लड शुगर और रक्त में वसा (कोलेस्ट्रॉल व ट्राइग्लिसराइड्स) सामान्य से अधिक हैं। आपका HbA1c 8.2% है (सामान्य लक्ष्य 7% से कम होता है), जिसका अर्थ है कि पिछले 3 महीनों में शुगर अधिक रही है। ट्राइग्लिसराइड्स (242) भी बढ़े हुए हैं। अच्छी बात यह है कि आपके गुर्दे (क्रिएटिनिन 1.08) पूरी तरह स्वस्थ काम कर रहे हैं।",
      te: "ఈ ల్యాబ్ రిపోర్ట్ మీ రక్తంలో చక్కెర మరియు కొవ్వుల స్థాయిలు ఎక్కువగా ఉన్నాయని సూచిస్తుంది. మీ HbA1c 8.2% గా ఉంది (లక్ష్యం 7% కంటే తక్కువ). అయితే, మీ కిడ్నీల పనితీరు (క్రియాటినిన్ 1.08) పూర్తిగా సాధారణంగా ఉండటం ఊరటనిచ్చే విషయం.",
      ta: "இந்த ஆய்வக அறிக்கை உங்கள் இரத்த சர்க்கரை மற்றும் கொழுப்பு அளவுகள் அதிகமாக இருப்பதைக் காட்டுகிறது. உங்கள் HbA1c 8.2% ஆக உள்ளது. நல்ல விஷயமாக, உங்கள் சிறுநீரக செயல்பாடு (கிரியேட்டினின் 1.08) முற்றிலும் சீராக உள்ளது.",
      mr: "हा लॅब अहवाल दर्शवतो की तुमची रक्तातील साखर आणि कोलेस्टेरॉल सामान्यपेक्षा जास्त आहे. तुमचा HbA1c 8.2% आहे (लक्ष्य 7% खाली असावे). दिलासा देणारी बाब म्हणजे तुमची किडनी पूर्णपणे निरोगी आहे.",
      bn: "এই ল্যাব রিপোর্টটি নির্দেশ করে যে আপনার রক্তে শর্করা এবং কোলেস্টেরল বেশি রয়েছে। আপনার HbA1c ৮.২%। তবে স্বস্তির বিষয় হলো আপনার কিডনির কার্যক্ষমতা (Creatinine 1.08) সম্পূর্ণ স্বাভাবিক রয়েছে।"
    },
    abnormalFindings: [
      { parameter: "HbA1c", observed: "8.2%", normalRange: "< 5.7% (Diabetic target: < 7.0%)", severity: "High", explanation: "Reflects higher average glucose levels over the prior 12 weeks." },
      { parameter: "Triglycerides", observed: "242 mg/dL", normalRange: "< 150 mg/dL", severity: "High", explanation: "Elevated circulating blood fats that respond very well to cutting sweets, sodas, and maida." },
      { parameter: "LDL ('Bad' Cholesterol)", observed: "141.6 mg/dL", normalRange: "< 100 mg/dL", severity: "High", explanation: "Higher risk for artery deposition; doctor has already initiated statin therapy." }
    ],
    lifestyleTips: [
      "Avoid sweetened beverages, fruit juices with added sugar, and sweets.",
      "Incorporate 30g of raw nuts (walnuts, almonds) into your mid-morning snack.",
      "Stay well hydrated with 2.5 - 3 Liters of water daily.",
      "Schedule your repeat lipid & HbA1c profile after 90 days of consistent therapy."
    ],
    doctorQuestions: [
      "Given my HbA1c is 8.2%, should we review my carbohydrate portions per meal?",
      "Will the newly prescribed Atorvastatin be sufficient to bring LDL below 100 mg/dL, or do I need additional dietary adjustments?",
      "Should I perform microalbuminuria urine test to monitor early kidney filtration?"
    ]
  },
  {
    id: "rec-dis-003",
    title: "Discharge Summary: Acute Bronchitis",
    type: "discharge_summary",
    doctorName: "Dr. Arvind Nathan, DNB (Pulmonology)",
    doctorReg: "KMC-61023",
    facility: "Apollo Hospitals, Bannerghatta Road, Bengaluru",
    date: "2024-01-22",
    scanType: "Hospital Inpatient Discharge Summary",
    rawOcrText: `APOLLO HOSPITALS ENTERPRISE LTD.
154/11, Bannerghatta Main Rd, Bengaluru, Karnataka 560076
DISCHARGE SUMMARY & ADVICE
Patient: Rahul Kumar Sharma | Age/Gender: 36/M | UHID: APL-982144
Admission Date: 20-Jan-2024 | Discharge Date: 22-Jan-2024
Consultant: Dr. Arvind Nathan, DNB, FCCP (Pulmonology)

FINAL DIAGNOSIS:
Acute Infective Bronchitis with Mild Reactive Airway Bronchospasm.
No evidence of focal consolidation / Pneumonia on Chest X-Ray.

CLINICAL COURSE:
Presented with 4-day history of dry cough progressing to productive cough, low grade fever (100.4°F), and nocturnal wheeze.
Vitals at admission: SpO2 96% on room air, HR 92/min, RR 22/min.
Treated with bronchodilator nebulizations (Duolin + Budecort) and supportive IV fluids.
Symptoms significantly improved. Lungs clear to auscultation on discharge. SpO2 99%.

MEDICATIONS AT DISCHARGE:
1. Tab. Azithromycin 500 mg - 1 tab once daily after lunch for 3 more days (Total 5 days).
2. Budesonide Inhaler 200 mcg - 2 puffs twice daily with spacer for 14 days, then taper.
3. Tab. Levocetirizine 5 mg - 1 tab at bedtime for 7 days.
4. Tab. Paracetamol 650 mg - 1 tab SOS (only if body temperature exceeds 100°F).
5. Steam inhalation with saline twice daily.

FOLLOW-UP & RED FLAGS:
Follow up in Pulmonology OPD in 10 days.
Seek IMMEDIATE emergency care if:
- SpO2 drops below 94%
- Severe difficulty breathing or inability to speak in full sentences
- High spiking fever > 102°F not resolving with Paracetamol`,
    diagnoses: [
      { name: "Acute Infective Bronchitis", icd10: "J20.9", snomedCode: "10509002", severity: "Resolved" },
      { name: "Reactive Airway Bronchospasm", icd10: "J98.01", snomedCode: "263731006", severity: "Mild" }
    ],
    medications: [
      {
        name: "Azithromycin 500mg",
        generic: "Azithromycin",
        dosage: "500mg",
        frequency: "1-0-0 (Once daily)",
        timing: "After lunch",
        duration: "3 days remaining",
        purpose: "Antibiotic course to eradicate bacterial chest infection",
        sideEffects: "Mild stomach rumble; complete the full course even if feeling better",
        snomedCode: "387531004"
      },
      {
        name: "Budesonide Inhaler 200mcg",
        generic: "Budesonide",
        dosage: "200mcg (2 puffs)",
        frequency: "Twice daily",
        timing: "Morning and evening with spacer",
        duration: "14 days",
        purpose: "Inhaled anti-inflammatory steroid to soothe airway bronchial lining",
        sideEffects: "Rinse mouth with water after inhaling to prevent hoarseness or oral thrush",
        snomedCode: "387494007"
      },
      {
        name: "Levocetirizine 5mg",
        generic: "Levocetirizine Dihydrochloride",
        dosage: "5mg",
        frequency: "0-0-1 (Bedtime)",
        timing: "Night",
        duration: "7 days",
        purpose: "Reduces post-nasal drip, sneezing, and airway allergic triggers",
        sideEffects: "Mild drowsiness",
        snomedCode: "386847000"
      }
    ],
    vitals: {
      spo2: "99% on room air",
      pulse: "76 bpm",
      temp: "98.4°F"
    },
    labValues: [
      {
        testName: "Oxygen Saturation (SpO2)",
        value: "99",
        unit: "%",
        referenceRange: "95 - 100 %",
        status: "Normal",
        loincCode: "59408-5",
        plainExplanation: "Oxygen saturation in your blood has returned to a completely normal and healthy 99%."
      }
    ],
    plainSummary: {
      en: "This discharge summary confirms you recovered from Acute Bronchitis (chest infection with airway inflammation). Your oxygen levels improved back to 99%. Finish the remaining 3 days of your Azithromycin antibiotic to avoid recurring bacteria. Use the Budesonide inhaler twice daily for airway healing, and always rinse your mouth with water right after using the inhaler.",
      hi: "यह डिस्चार्ज सारांश पुष्टि करता है कि आप एक्यूट ब्रोंकाइटिस (फेफड़ों में संक्रमण और खांसी) से ठीक हो चुके हैं। आपका ऑक्सीजन स्तर सामान्य (99%) हो गया है। कृपया एज़िथ्रोमाइसिन एंटीबायोटिक का बचा हुआ 3 दिनों का कोर्स पूरा करें। इनहेलर के इस्तेमाल के बाद हमेशा सादे पानी से कुल्ला जरूर करें।",
      te: "ఈ డిశ్చార్జ్ సారాంశం మీరు బ్రోన్కైటిస్ (ఛాతీ ఇన్ఫెక్షన్) నుండి కోలుకున్నారని చూపిస్తుంది. మీ ఆక్సిజన్ స్థాయి 99% కి మెరుగుపడింది. అజిత్రోమైసిన్ యాంటీబయాటిక్ కోర్సును పూర్తిగా పూర్తి చేయండి. ఇన్హేలర్ ఉపయోగించిన తర్వాత నోటిని నీటితో పుక్కిలించండి.",
      ta: "இந்த டிஸ்சார்ஜ் சுருக்கம் நீங்கள் மூச்சுக்குழாய் அழற்சியில் இருந்து குணமடைந்துவிட்டீர்கள் என்பதை உறுதிப்படுத்துகிறது. உங்கள் ஆக்ஸிஜன் அளவு 99% ஆக சீரடைந்துள்ளது. ஆண்டிபயாடிக் மருந்துகளை முழுமையாக முடிக்கவும்.",
      mr: "हा डिस्चार्ज सारांश पुष्टी करतो की तुम्ही ब्रॉन्कायटिसमधून बरे झाला आहात. तुमची ऑक्सिजन पातळी 99% वर आली आहे. अँटीबायोटिक्सचा उर्वरित कोर्स पूर्ण करा आणि इनहेलर वापरल्यानंतर नेहमी चूळ भरा.",
      bn: "এই ডিসচার্জ সামারি নিশ্চিত করে যে আপনি ব্রঙ্কাইটিস সংক্রমণ থেকে সুস্থ হয়েছেন। আপনার অক্সিজেনের মাত্রা ৯৯% এ ফিরে এসেছে। অ্যান্টিবায়োটিকের সম্পূর্ণ কোর্স সম্পন্ন করুন।"
    },
    abnormalFindings: [],
    lifestyleTips: [
      "Always gargle or rinse your mouth with water after using steroid inhalers.",
      "Avoid cold beverages and dusty environments for the next 2 weeks.",
      "Stay in well-ventilated rooms and practice diaphragmatic breathing."
    ],
    doctorQuestions: [
      "Can I stop the inhaler immediately after 14 days or do I need to reduce to 1 puff daily first?",
      "Do I need an annual influenza or pneumococcal vaccine given my reactive airway episode?"
    ]
  },
  {
    id: "rec-bilingual-004",
    title: "Bilingual Handwritten Clinic Rx (Hindi-English)",
    type: "bilingual_prescription",
    doctorName: "Dr. Amit Verma, MBBS, MD (Gen Med)",
    doctorReg: "UPMC-39108",
    facility: "Sanjeevani Arogya Clinic, Varanasi",
    date: "2023-11-05",
    scanType: "Handwritten Bilingual Physical Prescription",
    rawOcrText: `संजीवनी आरोग्य केंद्र / SANJEEVANI HEALTH CLINIC
डॉ. अमित वर्मा (M.D. Gen Med) | Reg: UPMC-39108
दिनांक / Date: 05/11/2023
रोगी / Patient: राहुल शर्मा (Rahul Sharma) | आयु: 35 | भार: 79 kg
बीपी / BP: 146/94 mmHg

शिकायत / Chief Complaint: सिरदर्द, अत्यधिक प्यास (Excess thirst), थकान (Fatigue)

दवाइयां / Rx:
1. Tab. Metformin 500 mg
   सुबह-शाम भोजन के बाद (1-0-1 After food) - 30 दिन
2. Tab. Amlodipine 5 mg
   सुबह नाश्ते से पहले खाली पेट (1-0-0 Morning empty stomach) - 30 दिन
3. Tab. Pan-D (Pantoprazole + Domperidone)
   सुबह खाली पेट 1 गोली (Empty stomach) - 7 दिन
4. जांच कराएं / Advised Tests:
   HbA1c, Fasting Blood Sugar, Lipid Profile
   नमक कम खाएं (Low salt), 30 मिनट टहलें (30 min walk)`,
    diagnoses: [
      { name: "Suspected Diabetes Mellitus (मधुमेह)", icd10: "E11.9", snomedCode: "44054006", severity: "Initial" },
      { name: "Uncontrolled Blood Pressure (उच्च रक्तचाप)", icd10: "I10", snomedCode: "59621000", severity: "Moderate" }
    ],
    medications: [
      {
        name: "Metformin 500mg",
        generic: "Metformin Hydrochloride",
        dosage: "500mg",
        frequency: "1-0-1 (सुबह-शाम)",
        timing: "भोजन के बाद (After Food)",
        duration: "30 Days",
        purpose: "Initial blood sugar management",
        sideEffects: "Temporary stomach fullness",
        snomedCode: "372567009"
      },
      {
        name: "Amlodipine 5mg",
        generic: "Amlodipine Besylate",
        dosage: "5mg",
        frequency: "1-0-0 (सुबह)",
        timing: "नाश्ते से पहले (Before Breakfast)",
        duration: "30 Days",
        purpose: "Calcium channel blocker to reduce elevated arterial pressure",
        sideEffects: "Rare ankle swelling",
        snomedCode: "386864001"
      },
      {
        name: "Pan-D",
        generic: "Pantoprazole 40mg + Domperidone 30mg",
        dosage: "Standard",
        frequency: "1-0-0 (सुबह खाली पेट)",
        timing: "Empty Stomach",
        duration: "7 Days",
        purpose: "Relieves acidity and nausea",
        sideEffects: "Well tolerated",
        snomedCode: "324316009"
      }
    ],
    vitals: {
      bp: "146/94 mmHg",
      systolic: 146,
      diastolic: 94,
      weight: "79 kg"
    },
    labValues: [],
    plainSummary: {
      en: "This historical prescription from November 2023 was the first consultation where Dr. Verma flagged high blood pressure (146/94 mmHg) and initiated Metformin 500mg with Amlodipine 5mg. The bilingual doctor notes instructed taking Metformin after meals and Amlodipine on an empty stomach in the morning.",
      hi: "नवंबर 2023 की यह पुरानी पर्ची आपकी पहली जांच थी जब डॉ. वर्मा ने उच्च रक्तचाप (146/94 mmHg) और प्रारंभिक शुगर के लक्षण पहचाने थे। उन्होंने मेटफ़ॉर्मिन 500mg (भोजन के बाद) और एम्लोडिपिन 5mg (सुबह खाली पेट) शुरू करने की सलाह दी थी।",
      te: "నవంబర్ 2023 నాటి ఈ ప్రిస్క్రిప్షన్‌లో డాక్టర్ వర్మ అధిక రక్తపోటు (146/94 mmHg) మరియు మధుమేహం లక్షణాలను గుర్తించి ప్రారంభ మందులను సూచించారు.",
      ta: "நவம்பர் 2023 தேதியிட்ட இந்த பழைய மருந்துச்சீட்டில் மருத்துவர் உயர் இரத்த அழுத்தம் மற்றும் சர்க்கரை நோய்க்கான ஆரம்ப சிகிச்சையைத் தொடங்கினார்.",
      mr: "नोव्हेंबर 2023 मधील हे जुने प्रिस्क्रिप्शन दर्शवते की त्यावेळी डॉ. वर्मा यांनी उच्च रक्तदाब आणि मधुमेहाची लक्षणे ओळखून औषधे सुरू केली होती.",
      bn: "নভেম্বর ২০২৩-এর এই পুরোনো প্রেসক্রিপশনটিতে ডাক্তার ভার্মা প্রথমবার উচ্চ রক্তচাপ এবং প্রাথমিক ডায়াবেটিসের লক্ষণ চিহ্নিত করেছিলেন।"
    },
    abnormalFindings: [
      { parameter: "Blood Pressure", observed: "146/94 mmHg", normalRange: "< 120/80 mmHg", severity: "Stage 2 Elevation", explanation: "High pressure noted at initial clinic visit." }
    ],
    lifestyleTips: [
      "Strictly reduce pickle, papad, and added table salt.",
      "Daily 30 minutes light morning walk."
    ],
    doctorQuestions: [
      "How frequently should I monitor blood pressure at home?"
    ]
  }
];

// Historical Biometric & Lab Trend Data for Recharts Visualization
export const historicalBiomarkers = [
  {
    date: "Nov 2023",
    fullDate: "2023-11-05",
    hba1c: null,
    fastingGlucose: 165,
    systolicBp: 146,
    diastolicBp: 94,
    totalCholesterol: 245,
    triglycerides: 260,
    source: "Sanjeevani Clinic Visit"
  },
  {
    date: "Jan 2024",
    fullDate: "2024-01-20",
    hba1c: null,
    fastingGlucose: null,
    systolicBp: 138,
    diastolicBp: 88,
    totalCholesterol: null,
    triglycerides: null,
    source: "Apollo Hospital Admission"
  },
  {
    date: "Mar 2024 (Lab)",
    fullDate: "2024-03-10",
    hba1c: 8.2,
    fastingGlucose: 148,
    systolicBp: null,
    diastolicBp: null,
    totalCholesterol: 228,
    triglycerides: 242,
    source: "Metropolis Lab Report"
  },
  {
    date: "Mar 2024 (Rx)",
    fullDate: "2024-03-12",
    hba1c: 8.2,
    fastingGlucose: 148,
    systolicBp: 142,
    diastolicBp: 90,
    totalCholesterol: 228,
    triglycerides: 242,
    source: "Max Healthcare Consultation"
  }
];
