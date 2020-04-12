import {
  PatientEntry,
  Patient,
  Procedure,
  Observation,
  MedicationStatement,
  Immunization,
  Goal,
  FamilyMemberHistory,
  DiagnosticReport,
  Device,
  Condition,
  CarePlan,
  AllergyIntolerance,
} from "./_types/_patientData";

// Maps each of the resources to a normalized format, since I was not sure which information
// was required, the resulting maps are a bit biased and based on my own opions of what should be shown

const mapPatientResources = (entry: { resource: PatientEntry }[]) => {
  return entry.map(({ resource }) => {
    switch (resource.resourceType) {
      case "Patient":
        return mapPatientEntry(resource as Patient);
      case "Procedure":
        return mapProcedureEntry(resource as Procedure);
      case "Observation":
        return mapObservationEntry(resource as Observation);
      case "MedicationStatement":
        return mapMedicationStatmentEntry(resource as MedicationStatement);
      case "Immunization":
        return mapImmunizationEntry(resource as Immunization);
      case "Goal":
        return mapGoalEntry(resource as Goal);
      case "FamilyMemberHistory":
        return mapFamilyMemberHistoryEntry(resource as FamilyMemberHistory);
      case "DiagnosticReport":
        return mapDiagnosticReportEntry(resource as DiagnosticReport);
      case "Device":
        return mapDeviceEntry(resource as Device);
      case "Condition":
        return mapConditionEntry(resource as Condition);
      case "CarePlan":
        return mapCarePlanEntry(resource as CarePlan);
      case "AllergyIntolerance":
        return mapAllergyIntoleranceEntry(resource as AllergyIntolerance);
      default:
        throw Error("Unknown Resource Type");
    }
  });
};

const mapPatientEntry = ({
  resourceType: type,
  name,
  gender,
  birthDate,
  address,
  deceasedBoolean: deceased,
  telecom: [{ value: telecom }],
  maritalStatus: { text: maritalStatus },
}: Patient) => {
  const { line, city, state, country, postalCode } = address[0];
  const patientAddressString = `${line}, ${city}, ${state}, ${country}, ${postalCode}`;

  return {
    type: "Patient",
    details: {
      name: name[0].text,
      gender,
      birthDate,
      deceased: deceased ? "Yes" : "No",
      maritalStatus,
      telecom,
      address: patientAddressString,
    },
  };
};

const mapProcedureEntry = ({
  resourceType: type,
  status,
  code: { text: procedure },
  notPerformed,
  performedDateTime: performedOn,
}: Procedure) => {
  return {
    type,
    details: {
      status,
      performed: notPerformed ? "Not Performed" : "Performed",
      performedOn,
      procedure,
    },
  };
};

const mapObservationEntry = ({
  code: { text: observation },
  valueString,
  status,
  comments,
  resourceType: type,
  interpretation,
  category,
  valueQuantity,
  performer,
}: Observation) => {
  return {
    type,
    details: {
      status,
      observation: `${
        valueQuantity ? valueQuantity.value + " " + valueQuantity.unit : ""
      } ${observation}`,
      comments,
      valueString,
      category: category.text,
      performer: performer?.map((p) => p.display),
      interpertation: interpretation?.text,
    },
  };
};

const mapMedicationStatmentEntry = ({
  resourceType: type,
  status,
  dosage,
  medicationCodeableConcept: { text: medicationCodeableConcept },
  effectivePeriod: { start, end },
  informationSource: { display: informationSource },
}: MedicationStatement) => {
  return {
    type,
    details: {
      status,
      directions: dosage.map(
        ({ quantityQuantity, text, route, asNeededBoolean }) =>
          `${quantityQuantity.value} ${quantityQuantity.unit} - ${text} : ${
            "via " + route.text
          } ${asNeededBoolean ? " - As Needed" : ""}`
      ),
      start,
      end,
      medicationCodeableConcept,
      informationSource,
    },
  };
};

const mapImmunizationEntry = ({
  resourceType: type,
  wasNotGiven,
  lotNumber,
  reported,
  route,
  status,
  date,
  vaccineCode: { text: vaccine },
  site,
}: Immunization) => {
  return {
    type,
    details: {
      administered: wasNotGiven ? "No" : "Yes",
      lotNumber,
      reported,
      status,
      vaccine,
      date,
      siteAdministered: site?.text,
      route: route?.text,
    },
  };
};

const mapGoalEntry = ({
  note: [{ text }],
  addresses: [{ display: addresses }],
  author: { display: author },
  resourceType: type,
  description,
  category: [{ text: category }],
  startDate,
  status,
}: Goal) => {
  return {
    type,
    author,
    status,
    startDate,
    category,
    description,
    addresses,
    text,
  };
};

const mapFamilyMemberHistoryEntry = ({
  resourceType: type,
  name,
  relationship: { text: relationship },
  condition,
}: FamilyMemberHistory) => {
  return {
    type,
    details: {
      name,
      relationship,
      conditions: condition?.map((c) => c.code.text),
    },
  };
};

const mapDiagnosticReportEntry = ({
  status,
  resourceType: type,
  issued,
  performer: { display: performer },
  result,
  code: { text: code },
}: DiagnosticReport) => {
  return {
    type,
    details: {
      status,
      issued,
      performer,
      results: result?.map((r) => r.display),
      code,
    },
  };
};

const mapDeviceEntry = ({
  resourceType: type,
  type: { text: deviceType },
  model,
  expiry,
  id,
  status,
}: Device) => {
  return {
    type,
    details: {
      deviceType,
      model,
      expiry,
      id,
      status,
    },
  };
};

const mapConditionEntry = ({
  resourceType: type,
  severity,
  code: { text: condition },
  verificationStatus,
  clinicalStatus,
  onsetDateTime,
  asserter: { display: assertedBy },
  dateRecorded,
  category: { text: category },
}: Condition) => {
  return {
    type,
    details: {
      severity: severity?.text,
      condition,
      verificationStatus,
      clinicalStatus,
      onsetDateTime,
      dateRecorded,
      assertedBy,
      category,
    },
  };
};

const mapCarePlanEntry = ({
  resourceType: type,
  addresses,
  goal,
  activity,
  status,
  category: [{ text: cat }],
}: CarePlan) => {
  return {
    type,
    details: {
      addresses: addresses.map((a) => a.display) + " ",
      goals: goal.map((g) => g.display + " "),
      activities: activity.map(
        ({
          detail: {
            code: { text },
            prohibited,
            category: { text: category },
          },
        }) =>
          `${category} : ${text} - ${
            prohibited ? "Is Prohibited" : "Is Not Prohibited"
          }`
      ),
      status,
      category: cat,
    },
  };
};

const mapAllergyIntoleranceEntry = ({
  resourceType: type,
  criticality,
  onset,
  status,
  recordedDate,
  recorder: { display: recorder },
  reaction,
  substance: { text: AllergicTo },
}: AllergyIntolerance) => {
  return {
    type,
    details: {
      AllergicTo,
      criticality,
      onset,
      status,
      recordedDate,
      recorder,
      reactions: reaction.map(
        (r) =>
          `${r.manifestation[0].text} ${
            r.note?.text ? " - Notes : " + r.note.text : ""
          }`
      ),
    },
  };
};

export default mapPatientResources;
