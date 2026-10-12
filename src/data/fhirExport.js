// ABDM FHIR R4 Compliant Exporter
// Produces standard HL7 FHIR Release 4 Document Bundle mapped to Indian ABDM profiles

export function generateFhirBundle(patient, record) {
  const timestamp = new Date().toISOString();
  const bundleId = `abdm-bundle-${Date.now()}`;
  const compositionId = `comp-${Math.floor(Math.random() * 10000)}`;

  // Construct Patient Resource
  const patientResource = {
    resourceType: "Patient",
    id: "patient-rahul-sharma",
    meta: {
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"]
    },
    identifier: [
      {
        type: {
          coding: [
            {
              system: "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code",
              code: "ABHA",
              display: "Ayushman Bharat Health Account Number"
            }
          ]
        },
        system: "https://healthid.ndhm.gov.in",
        value: patient?.abhaNumber || "14-8291-0392-1940"
      },
      {
        type: {
          coding: [
            {
              system: "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code",
              code: "ABHA-Address",
              display: "ABHA Address"
            }
          ]
        },
        system: "https://abdm.gov.in/abha-address",
        value: patient?.abhaAddress || "rahul.sharma@abdm"
      }
    ],
    name: [
      {
        text: patient?.fullName || "Rahul Kumar Sharma",
        family: "Sharma",
        given: ["Rahul", "Kumar"]
      }
    ],
    gender: (patient?.gender || "male").toLowerCase(),
    birthDate: "1988-08-14",
    telecom: [
      {
        system: "phone",
        value: patient?.mobile || "+919876543210"
      }
    ],
    address: [
      {
        line: [patient?.address || "Bellandur"],
        city: patient?.district || "Bengaluru",
        state: patient?.state || "Karnataka",
        country: "IND"
      }
    ]
  };

  // Practitioner Resource
  const practitionerResource = {
    resourceType: "Practitioner",
    id: "practitioner-1",
    meta: {
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Practitioner"]
    },
    identifier: [
      {
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "MD",
              display: "Medical License number"
            }
          ]
        },
        system: "https://nmc.org.in",
        value: record?.doctorReg || "KMC-48291"
      }
    ],
    name: [
      {
        text: record?.doctorName || "Dr. Rajesh Sharma, MD"
      }
    ]
  };

  // Condition Resources (Diagnoses)
  const conditionResources = (record?.diagnoses || []).map((diag, idx) => ({
    resourceType: "Condition",
    id: `condition-${idx + 1}`,
    meta: {
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Condition"]
    },
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
          code: "active",
          display: "Active"
        }
      ]
    },
    verificationStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
          code: "confirmed",
          display: "Confirmed"
        }
      ]
    },
    code: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: diag.snomedCode || "44054006",
          display: diag.name
        }
      ],
      text: diag.name
    },
    subject: {
      reference: `Patient/${patientResource.id}`,
      display: patient?.fullName || "Rahul Kumar Sharma"
    },
    recordedDate: record?.date || "2024-03-12"
  }));

  // MedicationStatement Resources
  const medicationResources = (record?.medications || []).map((med, idx) => ({
    resourceType: "MedicationStatement",
    id: `medication-${idx + 1}`,
    meta: {
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/MedicationStatement"]
    },
    status: "active",
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: med.snomedCode || "372567009",
          display: med.name
        }
      ],
      text: `${med.name} ${med.dosage}`
    },
    subject: {
      reference: `Patient/${patientResource.id}`
    },
    dosage: [
      {
        text: `${med.frequency} - ${med.instructions}`,
        timing: {
          code: {
            text: med.frequency
          }
        },
        route: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "260548002",
              display: "Oral"
            }
          ]
        }
      }
    ]
  }));

  // Observation Resources (Lab Tests & Vitals)
  const observationResources = (record?.labValues || []).map((lab, idx) => ({
    resourceType: "Observation",
    id: `observation-${idx + 1}`,
    meta: {
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Observation"]
    },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "laboratory",
            display: "Laboratory"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: lab.loincCode || "4548-4",
          display: lab.testName
        }
      ],
      text: lab.testName
    },
    subject: {
      reference: `Patient/${patientResource.id}`
    },
    effectiveDateTime: record?.date || "2024-03-12",
    valueQuantity: {
      value: parseFloat(lab.value) || 0,
      unit: lab.unit,
      system: "http://unitsofmeasure.org"
    },
    referenceRange: [
      {
        text: lab.referenceRange
      }
    ],
    interpretation: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
            code: lab.status === 'High' ? 'H' : lab.status === 'Low' ? 'L' : 'N',
            display: lab.status
          }
        ]
      }
    ]
  }));

  // Assemble full FHIR Document Bundle
  const entries = [
    { fullUrl: `urn:uuid:${patientResource.id}`, resource: patientResource },
    { fullUrl: `urn:uuid:${practitionerResource.id}`, resource: practitionerResource },
    ...conditionResources.map(c => ({ fullUrl: `urn:uuid:${c.id}`, resource: c })),
    ...medicationResources.map(m => ({ fullUrl: `urn:uuid:${m.id}`, resource: m })),
    ...observationResources.map(o => ({ fullUrl: `urn:uuid:${o.id}`, resource: o }))
  ];

  return {
    resourceType: "Bundle",
    id: bundleId,
    meta: {
      versionId: "1",
      lastUpdated: timestamp,
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"]
    },
    identifier: {
      system: "https://abdm.gov.in/bundles",
      value: bundleId
    },
    type: "document",
    timestamp: timestamp,
    entry: entries
  };
}
