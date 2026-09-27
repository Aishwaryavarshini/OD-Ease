// Auto-generated from 2026-2027 EEE MENTOR LIST.xlsx

export interface MasterStudent {
  registerNumber: string;
  name: string;
  gender: string;
  year: string;
  department: string;
  mentorName: string;
  mentorEmail: string;
  ccName?: string;
  ccEmail?: string;
  coCcName?: string;
  coCcEmail?: string;
  studentEmail?: string;
}

export interface MasterStaff {
  email: string;
  name: string;
  role: string;
  department: string;
  year?: string;
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


export const MASTER_STUDENTS: MasterStudent[] = [
  {
    "registerNumber": "814725105001",
    "name": "AAKASH N",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105002",
    "name": "ABDUL RAHMAN H",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105003",
    "name": "AMUTHAN R",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105004",
    "name": "ARAVINDHAN S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105005",
    "name": "AZAHR AHMED A",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105006",
    "name": "CHIRANJEEVI J S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105013",
    "name": "GOKUL KRISHNAN K",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105014",
    "name": "HARIHARAN V",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105015",
    "name": "HARIS KRISHNA M J",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105021",
    "name": "JERLIN SHARON G X",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105026",
    "name": "KEERTHANA S(7.5%)",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105049",
    "name": "SUJITHA C S",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105051",
    "name": "THANISHKA S",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105052",
    "name": "UJIN J A",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105053",
    "name": "VANDHANA C",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105059",
    "name": "YAZHINI A",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr. M. P. Flower Queen",
    "mentorEmail": "flowerqueen.mp@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105007",
    "name": "DHIVYA K",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105008",
    "name": "DIYAA DHARSHINI K",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105010",
    "name": "GAYATHRI A (7.5%)",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105011",
    "name": "GAYATHRI G S",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105017",
    "name": "JANANI M",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105027",
    "name": "KEERTHIGA K (7.5)",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105035",
    "name": "NEYA S",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105038",
    "name": "POOJA N",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105041",
    "name": "ROSHINI S",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105043",
    "name": "SANDHIYA R",
    "gender": "F",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105020",
    "name": "JEEVANANTHAM A",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105022",
    "name": "JOSHWA V",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105025",
    "name": "KAVIYARASU S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105028",
    "name": "MADHU VARSAN M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105029",
    "name": "MAHESWARAN S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105030",
    "name": "MANICHELVAN M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.A.Revathy",
    "mentorEmail": "revathy.a@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105031",
    "name": "MOHAMED ASHIQ M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105032",
    "name": "MOHAMED FARHAN M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105033",
    "name": "MUKESH M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105034",
    "name": "MUKTHAR AHAMED K M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105036",
    "name": "NIRMAL KUMAR R",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105037",
    "name": "POJAPRASATH M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105039",
    "name": "RANJITH S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105040",
    "name": "RIDHWAN AHAMED M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105042",
    "name": "SAKTHI SHANMUGAM R",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105009",
    "name": "ELAVARASAN T",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105012",
    "name": "GODWIN A",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105023",
    "name": "KAARTHIGAISELVAN PON",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105044",
    "name": "SANTHOSH R",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105045",
    "name": "SARAN C",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105046",
    "name": "SRIDHAR S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105047",
    "name": "SUBASH B",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Mr. J. Subramaniyan",
    "mentorEmail": "subramaniyan.j@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105048",
    "name": "SUBHAHARI J",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105050",
    "name": "SUTHARSON R",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105054",
    "name": "VARUN G",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105055",
    "name": "VIJAY M",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105056",
    "name": "VISHAL B",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105057",
    "name": "VISHNU VARMA J",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105058",
    "name": "VISHNURAM B K",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105016",
    "name": "HARISHWARAN S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105018",
    "name": "JAYANTH S S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814725105019",
    "name": "JEEVA R",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "Lateral Entry-01",
    "name": "BHUBESHWARAN S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "Lateral Entry-02",
    "name": "EZHIL KUMARAN S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "Lateral Entry-03",
    "name": "KEERRTHIVASAN A",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "Lateral Entry-04",
    "name": "SURYAKARAN S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "Lateral Entry-05",
    "name": "VISHAL S",
    "gender": "M",
    "year": "II Year",
    "department": "EEE",
    "mentorName": "Dr.V.Ashokkumar",
    "mentorEmail": "ashokkumar.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105002",
    "name": "ABDUR RAHMAN A",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105003",
    "name": "AJAY D",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105004",
    "name": "AKASH S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105005",
    "name": "ANSA SARAH A",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105010",
    "name": "DEEPIKA S",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105011",
    "name": "DHANUSHREE S",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105018",
    "name": "HARINI S",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105021",
    "name": "JENCY REBACA A",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105025",
    "name": "KAVIPRIYA R",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105026",
    "name": "KIRUBA S",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105038",
    "name": "SADHANA V",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105031",
    "name": "NETHRA K",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105034",
    "name": "PARIMALA V",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105035",
    "name": "RAJASRI N",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105037",
    "name": "ROSHINI J",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105041",
    "name": "SAMRUTHA R",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105048",
    "name": "SIVASANTHIYA S",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105051",
    "name": "SWATHY SRI S",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105054",
    "name": "VIMALA VARSHINI M",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105058",
    "name": "YUVASHREE S",
    "gender": "Female",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. D. F. Jingle Jabha",
    "mentorEmail": "jinglejabha.df@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105006",
    "name": "ARULMURUGAN S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105007",
    "name": "ARUNAGIRI S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105008",
    "name": "BALAHARISH S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105012",
    "name": "DHARANI PRASANTH V",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105013",
    "name": "DHINATHAYALAN E",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105014",
    "name": "FRANKLIN G",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105015",
    "name": "GEORGE ANTONY RAJ M",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105016",
    "name": "GOKUL G",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105017",
    "name": "HARIHARAN M",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105019",
    "name": "HEMMANATH S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105020",
    "name": "JAGADHEESWARAN S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105022",
    "name": "JOSHUA HAMILTON A",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105023",
    "name": "JOSHVA D",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105024",
    "name": "KASIRAGAVAN A",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105028",
    "name": "MOHAMMED ARSHAD B",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105029",
    "name": "MONISHVARAN S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105030",
    "name": "NANTHAKISHORE J",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105032",
    "name": "NIKEDHAN G",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105033",
    "name": "NORBERT NIYAHSTON I",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105039",
    "name": "SAKTHIKANNAN R",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R .Santhoshkumar",
    "mentorEmail": "santhoshkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105040",
    "name": "SAKTHIPRIYAN R",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105042",
    "name": "SANJAYKUMAR K",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105043",
    "name": "SANTHOSH N",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105044",
    "name": "SANTHOSH KUMAR M",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105046",
    "name": "SELVARAGAVAN S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105047",
    "name": "SIVANANTHAM M S",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105049",
    "name": "SRI HARI",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105052",
    "name": "TAMILAZGHAN P",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105053",
    "name": "UNNIKRISHNAN V",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105055",
    "name": "VINISH R",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105056",
    "name": "VISHAL V",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105057",
    "name": "VISHNU PRIYAN M",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105301",
    "name": "NITHISHKUMAR.V",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814724105302",
    "name": "VEERASELVAN.G",
    "gender": "Male",
    "year": "III Year",
    "department": "EEE",
    "mentorName": "Dr. R. Sathishkumar",
    "mentorEmail": "sathishkumar.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105003",
    "name": "AISHWARYAVARSHINI J",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105008",
    "name": "DEVADHARSHINI C",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105010",
    "name": "DHARSHINI R",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105019",
    "name": "KARTHIGA J",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105023",
    "name": "KIRUBALAKSHMI V",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105029",
    "name": "MOUNIKA.M",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105031",
    "name": "NIKKHISHA V B",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105036",
    "name": "RITHIKA RAMESH",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105037",
    "name": "SAHANA T",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105042",
    "name": "SARUMITRA S",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105046",
    "name": "SOUNDARYA P",
    "gender": "Female",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105001",
    "name": "ABDUL AZEEZ A K",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105002",
    "name": "AHAMED ABDHUL ARHAM A",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105004",
    "name": "ALEX S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105005",
    "name": "ARUN PRASAD U",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105006",
    "name": "BARATH S G",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105007",
    "name": "DEEPAN S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105009",
    "name": "DHARSHAN A",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105011",
    "name": "DHAYANITHI K",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Dr. R. Meenal",
    "mentorEmail": "meenal.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105012",
    "name": "DHAYANITHI S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105013",
    "name": "DIKSHITH P",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105014",
    "name": "GOKUL V",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105044",
    "name": "SIBU C F",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105045",
    "name": "SOMNATH N",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105047",
    "name": "SRIRAM R S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105048",
    "name": "SUDHARSAN M",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105049",
    "name": "SUDHIR V",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105050",
    "name": "TRILOKE M",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105051",
    "name": "VASANTHA KUMAR R",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105052",
    "name": "YUVANESH M",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105301",
    "name": "DHARMARAJAN S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105302",
    "name": "DINESHKUMAR S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105303",
    "name": "KRISHNAN S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105304",
    "name": "PRAVEEN J",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105305",
    "name": "SHERRWIN ANTONY S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105306",
    "name": "VEYDANT D",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105015",
    "name": "HARIHARAN B",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105016",
    "name": "HARISARAN R D",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105017",
    "name": "IRUDHAYA KELVIN B",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. R. Bharanidharan",
    "mentorEmail": "bharanidharan.r@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105018",
    "name": "JUDE VICTOR A",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105020",
    "name": "KARTHIKEYAN R",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105021",
    "name": "KAVIARASU R",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105022",
    "name": "KIRTHIK ROSEN G",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105024",
    "name": "MANIKANDAN G",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105025",
    "name": "MOHAMED FAHIM S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105026",
    "name": "MOHAMED JASEEN J",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105027",
    "name": "MOHAMED SHAH S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105028",
    "name": "MOHANAPRASANTH R",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105030",
    "name": "NAVEEN A",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105032",
    "name": "NITHISHVAR MURUGANANDHAM",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105033",
    "name": "RAMANATHAN S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105035",
    "name": "RICKEY DONALD J",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105038",
    "name": "SANGEETH RAAGAV A",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105039",
    "name": "SANJAY R",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105040",
    "name": "SANJAY S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105041",
    "name": "SANTHOSH S",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  },
  {
    "registerNumber": "814723105043",
    "name": "SATHISHKUMAR K",
    "gender": "Male",
    "year": "IV Year",
    "department": "EEE",
    "mentorName": "Mr. V. Vengatesan",
    "mentorEmail": "vengatesan.v@trp.srmtrichy.edu.in"
  }
];

export const MASTER_CC_MAPPINGS: YearCCMapping[] = [
  {
    "year": "III Year",
    "department": "EEE",
    "cc": {
      "name": "Dr. R. Sathishkumar",
      "email": "sathishkumar.r@trp.srmtrichy.edu.in"
    },
    "coCc": {
      "name": "Dr. D. F. Jingle Jabha",
      "email": "jinglejabha.df@trp.srmtrichy.edu.in"
    }
  },
  {
    "year": "IV Year",
    "department": "EEE",
    "cc": {
      "name": "Mr. V. Vengatesan",
      "email": "vengatesan.v@trp.srmtrichy.edu.in"
    },
    "coCc": {
      "name": "Mr. R. Bharanidharan",
      "email": "bharanidharan.r@trp.srmtrichy.edu.in"
    }
  }
];

export const MASTER_MENTORS: Record<string, MasterMentor> = {
  "flowerqueen.mp@trp.srmtrichy.edu.in": {
    "name": "Dr. M. P. Flower Queen",
    "email": "flowerqueen.mp@trp.srmtrichy.edu.in",
    "studentCount": 16
  },
  "revathy.a@trp.srmtrichy.edu.in": {
    "name": "Dr.A.Revathy",
    "email": "revathy.a@trp.srmtrichy.edu.in",
    "studentCount": 16
  },
  "subramaniyan.j@trp.srmtrichy.edu.in": {
    "name": "Mr. J. Subramaniyan",
    "email": "subramaniyan.j@trp.srmtrichy.edu.in",
    "studentCount": 16
  },
  "ashokkumar.v@trp.srmtrichy.edu.in": {
    "name": "Dr.V.Ashokkumar",
    "email": "ashokkumar.v@trp.srmtrichy.edu.in",
    "studentCount": 15
  },
  "jinglejabha.df@trp.srmtrichy.edu.in": {
    "name": "Dr. D. F. Jingle Jabha",
    "email": "jinglejabha.df@trp.srmtrichy.edu.in",
    "studentCount": 20
  },
  "santhoshkumar.r@trp.srmtrichy.edu.in": {
    "name": "Dr. R .Santhoshkumar",
    "email": "santhoshkumar.r@trp.srmtrichy.edu.in",
    "studentCount": 20
  },
  "sathishkumar.r@trp.srmtrichy.edu.in": {
    "name": "Dr. R. Sathishkumar",
    "email": "sathishkumar.r@trp.srmtrichy.edu.in",
    "studentCount": 14
  },
  "meenal.r@trp.srmtrichy.edu.in": {
    "name": "Dr. R. Meenal",
    "email": "meenal.r@trp.srmtrichy.edu.in",
    "studentCount": 19
  },
  "bharanidharan.r@trp.srmtrichy.edu.in": {
    "name": "Mr. R. Bharanidharan",
    "email": "bharanidharan.r@trp.srmtrichy.edu.in",
    "studentCount": 20
  },
  "vengatesan.v@trp.srmtrichy.edu.in": {
    "name": "Mr. V. Vengatesan",
    "email": "vengatesan.v@trp.srmtrichy.edu.in",
    "studentCount": 18
  }
};
