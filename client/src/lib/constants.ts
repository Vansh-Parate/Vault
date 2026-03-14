import type { CategoryField } from '../types';

export const CATEGORY_FIELDS: Record<string, CategoryField[]> = {
  IDENTITY: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'idType', label: 'ID Type', type: 'select', options: ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'Voter ID', 'Other'] },
    { name: 'idNumber', label: 'Document Number', type: 'text', required: true },
    { name: 'issuingAuthority', label: 'Issuing Authority', type: 'text' },
    { name: 'issuedDate', label: 'Issue Date', type: 'date' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { name: 'document', label: 'Upload Document', type: 'file' },
  ],
  EDUCATION: [
    { name: 'institution', label: 'Institution Name', type: 'text', required: true },
    { name: 'degree', label: 'Degree / Certificate', type: 'text', required: true },
    { name: 'fieldOfStudy', label: 'Field of Study', type: 'text' },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'graduationDate', label: 'Graduation Date', type: 'date' },
    { name: 'grade', label: 'Grade / GPA', type: 'text' },
    { name: 'document', label: 'Upload Certificate', type: 'file' },
  ],
  EMPLOYMENT: [
    { name: 'company', label: 'Company Name', type: 'text', required: true },
    { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
    { name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'] },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'description', label: 'Role Description', type: 'textarea' },
    { name: 'document', label: 'Upload Letter', type: 'file' },
  ],
  FINANCIAL: [
    { name: 'institution', label: 'Institution Name', type: 'text', required: true },
    { name: 'accountType', label: 'Account Type', type: 'select', options: ['Savings', 'Current', 'Salary', 'NRI', 'Other'] },
    { name: 'incomeRange', label: 'Income Range', type: 'select', options: ['< ₹3L', '₹3L–₹6L', '₹6L–₹12L', '₹12L–₹25L', '> ₹25L'] },
    { name: 'creditScore', label: 'Credit Score', type: 'number' },
    { name: 'document', label: 'Upload Statement', type: 'file' },
  ],
  HEALTHCARE: [
    { name: 'provider', label: 'Healthcare Provider', type: 'text', required: true },
    { name: 'recordType', label: 'Record Type', type: 'select', options: ['Prescription', 'Lab Report', 'Diagnosis', 'Insurance', 'Vaccination', 'Other'] },
    { name: 'date', label: 'Record Date', type: 'date' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    { name: 'document', label: 'Upload Record', type: 'file' },
  ],
  SKILLS: [
    { name: 'certName', label: 'Certification Name', type: 'text', required: true },
    { name: 'issuingBody', label: 'Issuing Body', type: 'text', required: true },
    { name: 'credentialId', label: 'Credential ID', type: 'text' },
    { name: 'issuedDate', label: 'Issue Date', type: 'date' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
    { name: 'document', label: 'Upload Certificate', type: 'file' },
  ],
  GOVERNMENT: [
    { name: 'documentType', label: 'Document Type', type: 'select', options: ['Tax Return', 'Trade License', 'GST Certificate', 'Birth Certificate', 'Other'] },
    { name: 'issuingAuthority', label: 'Issuing Authority', type: 'text' },
    { name: 'documentNumber', label: 'Document Number', type: 'text', required: true },
    { name: 'issuedDate', label: 'Issue Date', type: 'date' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { name: 'document', label: 'Upload Document', type: 'file' },
  ],
};

export const CATEGORY_ICONS: Record<string, string> = {
  IDENTITY: 'Fingerprint',
  EDUCATION: 'GraduationCap',
  EMPLOYMENT: 'Briefcase',
  FINANCIAL: 'Banknote',
  HEALTHCARE: 'HeartPulse',
  SKILLS: 'Award',
  GOVERNMENT: 'Landmark',
};

export const CATEGORY_LABELS: Record<string, string> = {
  IDENTITY: 'Identity',
  EDUCATION: 'Education',
  EMPLOYMENT: 'Employment',
  FINANCIAL: 'Financial',
  HEALTHCARE: 'Healthcare',
  SKILLS: 'Skills & Certifications',
  GOVERNMENT: 'Government',
};

export const CATEGORY_EXAMPLES: Record<string, string> = {
  IDENTITY: 'Aadhaar, PAN, Passport, Driving License',
  EDUCATION: 'Degrees, Diplomas, Transcripts',
  EMPLOYMENT: 'Offer Letters, Experience Certificates',
  FINANCIAL: 'Bank Statements, Income Proof',
  HEALTHCARE: 'Prescriptions, Lab Reports, Vaccination',
  SKILLS: 'AWS, Google Cloud, Coursera Certificates',
  GOVERNMENT: 'Tax Returns, GST Certificates',
};

export const CATEGORIES = [
  'IDENTITY', 'EDUCATION', 'EMPLOYMENT', 'FINANCIAL',
  'HEALTHCARE', 'SKILLS', 'GOVERNMENT',
] as const;
