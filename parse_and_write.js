import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'excel_parsed.json'), 'utf-8'))['MENTOR'];

let students = [];
let mentorsMap = {};

d.forEach((row) => {
  if (!row || row.length === 0) return;

  if (typeof row[0] === 'number') {
    let yearCode = String(row[1] || '').trim();
    let regNo = String(row[2] || '').trim();
    let name = '';
    let gender = '';
    let mentorName = '';
    let mentorEmail = '';

    let year = 'II Year';
    if (yearCode === 'III') year = 'III Year';
    if (yearCode === 'IV') year = 'IV Year';

    if (yearCode === 'II') {
      gender = String(row[3] || '').trim();
      name = String(row[4] || '').trim();
      mentorName = String(row[5] || '').trim();
      mentorEmail = String(row[6] || '').trim().toLowerCase();
    } else if (yearCode === 'III' || yearCode === 'IV') {
      name = String(row[3] || '').trim();
      gender = String(row[4] || '').trim();
      mentorName = String(row[5] || '').trim();
      mentorEmail = String(row[6] || '').trim().toLowerCase();
    }

    if (regNo && name) {
      students.push({
        registerNumber: regNo,
        name,
        gender,
        year,
        department: 'EEE',
        mentorName,
        mentorEmail
      });

      if (mentorEmail) {
        if (!mentorsMap[mentorEmail]) {
          mentorsMap[mentorEmail] = { name: mentorName, email: mentorEmail, studentCount: 0 };
        }
        mentorsMap[mentorEmail].studentCount++;
      }
    }
  }
});

const ccData = [
  {
    year: 'III Year',
    department: 'EEE',
    cc: { name: 'Dr. R. Sathishkumar', email: 'sathishkumar.r@trp.srmtrichy.edu.in' },
    coCc: { name: 'Dr. D. F. Jingle Jabha', email: 'jinglejabha.df@trp.srmtrichy.edu.in' }
  },
  {
    year: 'IV Year',
    department: 'EEE',
    cc: { name: 'Mr. V. Vengatesan', email: 'vengatesan.v@trp.srmtrichy.edu.in' },
    coCc: { name: 'Mr. R. Bharanidharan', email: 'bharanidharan.r@trp.srmtrichy.edu.in' }
  }
];

const targetDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const tsContent = `// Auto-generated from 2026-2027 EEE MENTOR LIST.xlsx

export interface MasterStudent {
  registerNumber: string;
  name: string;
  gender: string;
  year: string;
  department: string;
  mentorName: string;
  mentorEmail: string;
}

export interface YearCCMapping {
  year: string;
  department: string;
  cc: { name: string; email: string };
  coCc: { name: string; email: string };
}

export interface MasterMentor {
  name: string;
  email: string;
  studentCount: number;
}

export const MASTER_STUDENTS: MasterStudent[] = ${JSON.stringify(students, null, 2)};

export const MASTER_CC_MAPPINGS: YearCCMapping[] = ${JSON.stringify(ccData, null, 2)};

export const MASTER_MENTORS: Record<string, MasterMentor> = ${JSON.stringify(mentorsMap, null, 2)};
`;

fs.writeFileSync(path.join(targetDir, 'masterData.ts'), tsContent, 'utf-8');
console.log('SUCCESS WRITE masterData.ts with', students.length, 'students!');
