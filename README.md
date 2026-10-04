<div align="center">

  <h1>OD Ease</h1>

  <h3>Digital On-Duty Management System</h3>

  <p>
    A centralized digital platform for managing student On-Duty applications,
    approvals, evidence verification, reporting, and academic administration.
  </p>

  <p>
    <strong>TRP Engineering College, Trichy</strong>
  </p>

  <br>

  <a href="https://srmtrp-od-ease.netlify.app/">
    <img src="https://img.shields.io/badge/Live%20Application-OD%20Ease-2563EB?style=for-the-badge" alt="Live Application">
  </a>

  <a href="https://github.com/Aishwaryavarshini/OD-Ease">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>

</div>

<hr>

<h2>About the Project</h2>

<p>
  <strong>OD Ease</strong> is a web-based On-Duty Management System designed
  to simplify and digitize the complete OD application and approval process
  in our educational institution.
</p>

<p>
  The system replaces manual paperwork and disconnected communication with
  a structured digital workflow connecting students, mentors, class
  coordinators, department authorities, and administrators.
</p>

<h2>Objectives</h2>

<ul>
  <li>Digitize the complete On-Duty application process.</li>
  <li>Reduce paperwork and manual verification.</li>
  <li>Provide structured multi-level approval workflows.</li>
  <li>Track OD applications in real time.</li>
  <li>Manage post-OD evidence submission and verification.</li>
  <li>Provide centralized reports and historical records.</li>
  <li>Improve transparency and accountability in OD management.</li>
</ul>

<h2>User Roles</h2>

<table>
  <thead>
    <tr>
      <th>Role</th>
      <th>Primary Responsibilities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Student</strong></td>
      <td>Apply for OD, track approval status, and submit required evidence.</td>
    </tr>
    <tr>
      <td><strong>Mentor</strong></td>
      <td>Review and approve or reject assigned student OD applications.</td>
    </tr>
    <tr>
      <td><strong>CC / Co-CC</strong></td>
      <td>Review applications after the mentor approval stage.</td>
    </tr>
    <tr>
      <td><strong>EEE Coordinator</strong></td>
      <td>Manage department-level OD workflow, approvals, evidence, reports, and records.</td>
    </tr>
    <tr>
      <td><strong>Sports Staff</strong></td>
      <td>Review and approve Sports-related OD applications before the normal approval workflow.</td>
    </tr>
    <tr>
      <td><strong>HOD</strong></td>
      <td>Manage department-level requests and administrative responsibilities.</td>
    </tr>
  </tbody>
</table>

<h2>OD Approval Workflow</h2>

<h3>Academic OD</h3>

<p align="center">
  <strong>Student</strong>
  &nbsp;→&nbsp;
  <strong>Mentor</strong>
  &nbsp;→&nbsp;
  <strong>CC / Co-CC</strong>
  &nbsp;→&nbsp;
  <strong>EEE Coordinator</strong>
</p>

<h3>Sports OD</h3>

<p align="center">
  <strong>Student</strong>
  &nbsp;→&nbsp;
  <strong>Sports Staff</strong>
  &nbsp;→&nbsp;
  <strong>Mentor</strong>
  &nbsp;→&nbsp;
  <strong>CC / Co-CC</strong>
  &nbsp;→&nbsp;
  <strong>HOD/Overall Coordinator</strong>
</p>

<h2>Key Features</h2>

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>OD Application</td>
      <td>Students can submit structured On-Duty applications digitally.</td>
    </tr>
    <tr>
      <td>Role-Based Access</td>
      <td>Each user receives access according to their assigned role and responsibilities.</td>
    </tr>
    <tr>
      <td>Multi-Level Approval</td>
      <td>Applications move through the appropriate approval hierarchy automatically.</td>
    </tr>
    <tr>
      <td>Sports Workflow</td>
      <td>Sports ODs include an additional Sports Staff verification stage.</td>
    </tr>
    <tr>
      <td>Evidence Management</td>
      <td>Approved ODs can proceed through post-event evidence submission and verification.</td>
    </tr>
    <tr>
      <td>Geotag Detection</td>
      <td>Evidence can be checked for location information from image metadata or visible GPS information.</td>
    </tr>
    <tr>
      <td>Deadline Management</td>
      <td>Evidence deadlines can be monitored and extended by the authorized coordinator.</td>
    </tr>
    <tr>
      <td>Dashboard</td>
      <td>Provides a focused view of applications submitted during the current day.</td>
    </tr>
    <tr>
      <td>Reports</td>
      <td>Provides active OD workflow information together with audit reporting.</td>
    </tr>
    <tr>
      <td>Excel Export</td>
      <td>OD report information can be exported for administrative use.</td>
    </tr>
    <tr>
      <td>Records</td>
      <td>Past OD applications are retained as historical records.</td>
    </tr>
  </tbody>
</table>

<h2>Evidence Management</h2>

<p>
  OD Ease provides a structured post-OD evidence workflow for approved
  applications.
</p>

<ul>
  <li>Evidence becomes available according to the OD completion timeline.</li>
  <li>Multiple evidence files can be submitted.</li>
  <li>Supported formats include JPG, JPEG, PNG, and PDF.</li>
  <li>Geotag information can be detected from image metadata.</li>
  <li>Visible GPS information in images can also be detected.</li>
  <li>Evidence deadlines can be extended by authorized personnel.</li>
  <li>Coordinators can review evidence and add remarks.</li>
  <li>Completed evidence records can be closed by the coordinator.</li>
</ul>

<h2>Dashboard & Reporting</h2>

<h3>Dashboard</h3>

<p>
  The Dashboard provides a focused view of OD applications submitted on
  the current day, along with existing action-priority sorting and status
  filtering.
</p>

<h3>Reports</h3>

<p>
  Reports provide the active OD request workflow together with the
  <strong>Audit Report</strong> and <strong>Excel Export</strong> functionality.
</p>

<h3>Records</h3>

<p>
  Historical and completed OD applications are maintained separately in
  the Records section.
</p>

<h2>Technology Stack</h2>

<table>
  <tbody>
    <tr>
      <td><strong>Frontend</strong></td>
      <td>React + TypeScript</td>
    </tr>
    <tr>
      <td><strong>Build Tool</strong></td>
      <td>Vite</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>Supabase PostgreSQL</td>
    </tr>
    <tr>
      <td><strong>Authentication</strong></td>
      <td>Supabase Authentication</td>
    </tr>
    <tr>
      <td><strong>Storage</strong></td>
      <td>Supabase Storage</td>
    </tr>
    <tr>
      <td><strong>Deployment</strong></td>
      <td>Netlify</td>
    </tr>
    <tr>
      <td><strong>OCR</strong></td>
      <td>Tesseract.js</td>
    </tr>
  </tbody>
</table>

<h2>System Architecture</h2>

<h2>Security & Access Control</h2>

<ul>
  <li>Role-based portal access.</li>
  <li>Supabase Authentication for user identity.</li>
  <li>Database-level Row Level Security.</li>
  <li>Department and relationship-based request visibility.</li>
  <li>Separate authorization for coordinator-level actions.</li>
</ul>

<h2>Deployment</h2>

<p>
  The application is deployed using Netlify and connected to the Supabase
  backend for authentication, database operations, and evidence management.
</p>

<p align="center">
  <a href="https://srmtrp-od-ease.netlify.app/">
    <strong>🌐 Open OD Ease</strong>
  </a>
</p>

<h2>Project Structure</h2>

<pre>
OD-Ease/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   └── ...
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── netlify.toml
</pre>

<h2>Local Development</h2>

<pre>
npm install
npm run dev
</pre>

<h2>Production Build</h2>

<pre>
npm run build
</pre>

<p>
  The production-ready files are generated inside the
  <code>dist/</code> directory.
</p>

<h2>Project Status</h2>

<p align="center">
  <strong>Production Ready</strong>
</p>

<p align="center">
  OD Ease is designed to provide a centralized, transparent, and
  paperless approach to institutional On-Duty management.
</p>

<hr>

<div align="center">

  <h3>OD Ease</h3>

  <p>
    <strong>Digitalizing On-Duty Management</strong>
  </p>

  <p>
    TRP Engineering College, Trichy
  </p>

</div>
