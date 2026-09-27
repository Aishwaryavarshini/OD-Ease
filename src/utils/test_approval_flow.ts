import { calculateODStatus } from '../context/ODContext';
import { ODStatus } from '../types';

export const runApprovalFlowTests = () => {
  console.log('--- RUNNING OD APPROVAL FLOW VERIFICATION (CASES 1 - 9) ---');

  const assertEqual = (caseName: string, actual: ODStatus, expected: ODStatus) => {
    if (actual === expected) {
      console.log(`[PASS] ${caseName}: "${actual}" === "${expected}"`);
    } else {
      console.error(`[FAIL] ${caseName}: Got "${actual}", Expected "${expected}"`);
      throw new Error(`Test failed for ${caseName}`);
    }
  };

  // Case 1: Normal Complete Flow
  assertEqual('Case 1 - Step 1 (Applied)', calculateODStatus({}), 'Pending Mentor Approval');
  assertEqual('Case 1 - Step 2 (Mentor Approved)', calculateODStatus({ mentor: true }), 'Pending CC/Co-CC Approval');
  assertEqual('Case 1 - Step 3 (CC Approved)', calculateODStatus({ mentor: true, cc: true }), 'Pending Overall OD In-charge Approval');
  assertEqual('Case 1 - Step 4 (Overall OD Approved)', calculateODStatus({ mentor: true, cc: true, odIncharge: true }), 'Approved');

  // Case 2: CC/Co-CC Bypasses Mentor Pending
  assertEqual('Case 2 - Step 1 (Applied)', calculateODStatus({}), 'Pending Mentor Approval');
  assertEqual('Case 2 - Step 2 (CC Approved while Mentor Pending)', calculateODStatus({ cc: true }), 'Pending Overall OD In-charge Approval');
  assertEqual('Case 2 - Step 3 (Overall OD Approved)', calculateODStatus({ cc: true, odIncharge: true }), 'Approved');

  // Case 3: Overall OD Bypasses Both Lower Stages
  assertEqual('Case 3 - Step 1 (Applied)', calculateODStatus({}), 'Pending Mentor Approval');
  assertEqual('Case 3 - Step 2 (Overall OD Direct Approved)', calculateODStatus({ odIncharge: true }), 'Approved');

  // Case 4: Mentor Approved, CC/Co-CC Still Pending
  assertEqual('Case 4 - Step 1 (Mentor Approved)', calculateODStatus({ mentor: true }), 'Pending CC/Co-CC Approval');
  assertEqual('Case 4 - Step 2 (Overall OD Approved while CC Pending)', calculateODStatus({ mentor: true, odIncharge: true }), 'Approved');

  // Case 5: Mentor Rejects, Overall OD Overrides
  assertEqual('Case 5 - Step 1 (Mentor Rejected)', calculateODStatus({ mentor: false }), 'Pending Overall OD In-charge Approval');
  assertEqual('Case 5 - Step 2 (Overall OD Approved Override)', calculateODStatus({ mentor: false, odIncharge: true }), 'Approved');

  // Case 6: Mentor Rejects, Overall OD Also Rejects
  assertEqual('Case 6 - Step 1 (Mentor Rejected)', calculateODStatus({ mentor: false }), 'Pending Overall OD In-charge Approval');
  assertEqual('Case 6 - Step 2 (Overall OD Rejected)', calculateODStatus({ mentor: false, odIncharge: false }), 'Rejected');

  // Case 7: CC/Co-CC Rejects, Overall OD Overrides
  assertEqual('Case 7 - Step 1 (CC Rejected)', calculateODStatus({ mentor: true, cc: false }), 'Pending Overall OD In-charge Approval');
  assertEqual('Case 7 - Step 2 (Overall OD Approved Override)', calculateODStatus({ mentor: true, cc: false, odIncharge: true }), 'Approved');

  // Case 8: CC/Co-CC Rejects, Overall OD Rejects
  assertEqual('Case 8 - Step 1 (CC Rejected)', calculateODStatus({ mentor: true, cc: false }), 'Pending Overall OD In-charge Approval');
  assertEqual('Case 8 - Step 2 (Overall OD Rejected)', calculateODStatus({ mentor: true, cc: false, odIncharge: false }), 'Rejected');

  // Case 9: Normal Flow, Final Overall OD Rejection
  assertEqual('Case 9 - Step 1 (CC Approved)', calculateODStatus({ mentor: true, cc: true }), 'Pending Overall OD In-charge Approval');
  assertEqual('Case 9 - Step 2 (Overall OD Rejected)', calculateODStatus({ mentor: true, cc: true, odIncharge: false }), 'Rejected');

  console.log('--- ALL 9 CASES VERIFIED SUCCESSFULLY ---');
};
