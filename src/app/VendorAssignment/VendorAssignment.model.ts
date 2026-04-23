// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorAssignment {
   VendorAssignmentID: number;
   VendorAssignment: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(VendorAssignment) {
    {
       this.VendorAssignmentID = VendorAssignment.VendorAssignmentID || -1;
       this.VendorAssignment = VendorAssignment.VendorAssignment || '';
       this.activationStatus = VendorAssignment.activationStatus || '';
       this.updatedBy=VendorAssignment.updatedBy || 10;
       this.updateDateTime = VendorAssignment.updateDateTime;
    }
  }
  
}

