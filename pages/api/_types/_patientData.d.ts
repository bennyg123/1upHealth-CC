export interface PatientDataResponse {
  type: string;
  total: number;
  entry: { resource: PatientEntry }[];
  link: { relation: string; url: string };
}

export type PatientEntry =
  | Patient
  | Procedure
  | Observation
  | MedicationStatement
  | Immunization
  | Goal
  | FamilyMemberHistory
  | DiagnosticReport
  | Device
  | Condition
  | CarePlan
  | AllergyIntolerance;

export interface Patient {
  identifier: TelecomElement[];
  extension: Extension[];
  address: Address[];
  gender: string;
  active: boolean;
  birthDate: Date;
  careProvider: InformationSource[];
  deceasedBoolean: boolean;
  meta: Meta;
  name: NameElement[];
  telecom: TelecomElement[];
  id: string;
  communication: Communication[];
  maritalStatus: MaritalStatus;
  resourceType: string;
}

export interface AllergyIntolerance {
  identifier: ObservationIdentifier[];
  recorder: InformationSource;
  reaction: Reaction[];
  recordedDate: Date;
  substance: MaritalStatus;
  criticality: string;
  onset: Date;
  meta: Meta;
  patient: Subject;
  id: string;
  resourceType: string;
  status: string;
  note?: Severity;
}

export interface Procedure {
  identifier: TelecomElement[];
  code: MaritalStatus;
  subject: Subject;
  notPerformed: boolean;
  meta: Meta;
  id: string;
  performedDateTime: Date;
  resourceType: string;
  status: ClinicalStatusEnum;
}

export interface Address {
  country: string;
  city: string;
  use: Use;
  line: string[];
  postalCode: string;
  state: string;
  period?: Period;
}

export interface Period {
  start: Date;
  end?: Date;
}

export enum Use {
  Home = "home",
  Mobile = "mobile",
  Official = "official",
  Temp = "temp",
  Usual = "usual",
  Work = "work",
}

export interface InformationSource {
  reference: string;
  display: string;
}

export interface Communication {
  language: MaritalStatus;
  preferred: boolean;
}

export interface MaritalStatus {
  coding?: Coding[];
  text: string;
}

export interface Coding {
  system: string;
  code: string;
  display: string;
}

export interface Extension {
  valueCodeableConcept: MaritalStatus;
  url: string;
}

export interface TelecomElement {
  system: string;
  use?: Use;
  value: string;
  period?: Period;
  type?: MaritalStatus;
}

export interface Meta {
  lastUpdated: Date;
  versionID: string;
}

export interface NameElement {
  given: string[];
  use: Use;
  text: string;
  family: string[];
}

export enum ClinicalStatusEnum {
  Active = "active",
  Completed = "completed",
}

export interface Subject {
  reference: Reference;
}

export enum Reference {
  PatientF8Fedcd9E6E5 = "Patient/f8fedcd9e6e5",
}

export interface Observation {
  identifier: ObservationIdentifier[];
  code: MaritalStatus;
  subject: Subject;
  valueString?: string;
  effectiveDateTime?: Date;
  meta: Meta;
  id: string;
  category: MaritalStatus;
  resourceType: ObservationResourceType;
  status: ObservationStatus;
  comments?: string;
  referenceRange?: ReferenceRange[];
  issued?: Date;
  valueQuantity?: ValueQuantity;
  performer?: InformationSource[];
  component?: Component[];
  valueRatio?: ValueRatio;
  interpretation?: MaritalStatus;
  valueCodeableConcept?: MaritalStatus;
}

export interface Component {
  code: MaritalStatus;
  valueQuantity: ValueQuantity;
}

export interface ValueQuantity {
  unit?: string;
  code?: string;
  system?: string;
  value: number;
}

export interface ObservationIdentifier {
  system: System;
  value: string;
}

export enum System {
  HTTPSOpenICEpicCOM = "https:open-ic.epic.com",
}

export interface ReferenceRange {
  high?: ValueQuantity;
  low?: ValueQuantity;
  text: string;
}

export enum ObservationResourceType {
  Observation = "Observation",
}

export enum ObservationStatus {
  Amended = "amended",
  Final = "final",
  Preliminary = "preliminary",
  Registered = "registered",
  Unknown = "unknown",
}

export interface ValueRatio {
  numerator: Ator;
  denominator: Ator;
}

export interface Ator {
  value: number;
}

export interface MedicationStatement {
  dosage: Dosage[];
  identifier: TelecomElement[];
  effectivePeriod: Period;
  medicationCodeableConcept: MaritalStatus;
  informationSource: InformationSource;
  meta: Meta;
  patient: Subject;
  id: string;
  resourceType: MedicationStatementResourceType;
  status: ClinicalStatusEnum;
}

export interface Dosage {
  route: MaritalStatus;
  method: MaritalStatus;
  timing: Timing;
  quantityQuantity: ValueQuantity;
  asNeededBoolean: boolean;
  text: string;
}

export interface Timing {
  repeat: Repeat;
}

export interface Repeat {
  period: number;
  periodUnits: PeriodUnits;
  boundsPeriod: Period;
  frequency: number;
}

export enum PeriodUnits {
  D = "d",
  H = "h",
}

export enum MedicationStatementResourceType {
  MedicationStatement = "MedicationStatement",
}

export interface Immunization {
  date: Date;
  identifier: ObservationIdentifier[];
  lotNumber?: string;
  wasNotGiven: boolean;
  meta: Meta;
  patient: Subject;
  reported: boolean;
  id: string;
  vaccineCode: MaritalStatus;
  resourceType: string;
  status: ClinicalStatusEnum;
  site?: MaritalStatus;
  route?: MaritalStatus;
}

export interface Goal {
  identifier: ObservationIdentifier[];
  note: Severity[];
  addresses: InformationSource[];
  author: InformationSource;
  subject: Subject;
  description: string;
  meta: Meta;
  id: string;
  category: MaritalStatus[];
  startDate: Date;
  resourceType: string;
  status: string;
}

export interface Severity {
  text: string;
}

export interface FamilyMemberHistory {
  date: Date;
  identifier: TelecomElement[];
  condition?: ConditionElement[];
  deceasedBoolean: boolean;
  meta: Meta;
  patient: Subject;
  name: NameEnum;
  id: string;
  relationship: MaritalStatus;
  resourceType: FamilyMemberHistoryResourceType;
  status: FamilyMemberHistoryStatus;
}

export interface ConditionElement {
  code: Severity;
  note?: Severity;
}

export enum NameEnum {
  Athena = "Athena",
  Hera = "Hera",
  Zeus = "Zeus",
}

export enum FamilyMemberHistoryResourceType {
  FamilyMemberHistory = "FamilyMemberHistory",
}

export enum FamilyMemberHistoryStatus {
  Final = "final",
  Partial = "partial",
  Registered = "registered",
}

export interface DiagnosticReport {
  identifier: TelecomElement[];
  code: MaritalStatus;
  performer: InformationSource;
  subject: Subject;
  result?: InformationSource[];
  effectiveDateTime: Date;
  meta: Meta;
  id: string;
  issued: Date;
  resourceType: DiagnosticReportResourceType;
  status: FamilyMemberHistoryStatus;
}

export enum DiagnosticReportResourceType {
  DiagnosticReport = "DiagnosticReport",
}

export interface Device {
  identifier: TelecomElement[];
  type: MaritalStatus;
  meta: Meta;
  patient: Subject;
  model: string;
  expiry: Date;
  id: string;
  udi: string;
  resourceType: string;
  status: string;
}

export interface Condition {
  severity?: Severity;
  identifier: ObservationIdentifier[];
  code: MaritalStatus;
  verificationStatus: string;
  clinicalStatus: ClinicalStatusEnum;
  onsetDateTime: Date;
  asserter: InformationSource;
  dateRecorded: Date;
  meta: Meta;
  patient: Subject;
  id: string;
  category: MaritalStatus;
  resourceType: string;
}

export interface CarePlan {
  identifier: ObservationIdentifier[];
  addresses: InformationSource[];
  goal: InformationSource[];
  activity: Activity[];
  subject: Subject;
  meta: Meta;
  id: string;
  category: MaritalStatus[];
  resourceType: string;
  status: ClinicalStatusEnum;
}

export interface Activity {
  detail: Detail;
}

export interface Detail {
  code: Severity;
  prohibited: boolean;
  category: MaritalStatus;
}

export interface Reaction {
  manifestation: Severity[];
  certainty: string;
  onset: Date;
  note?: Severity;
}
