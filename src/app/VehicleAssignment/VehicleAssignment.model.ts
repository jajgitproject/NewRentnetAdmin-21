// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleAssignment {
   VehicleAssignmentID: number;
   VehicleAssignment: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(VehicleAssignment) {
    {
       this.VehicleAssignmentID = VehicleAssignment.VehicleAssignmentID || -1;
       this.VehicleAssignment = VehicleAssignment.VehicleAssignment || '';
       this.activationStatus = VehicleAssignment.activationStatus || '';
       this.updatedBy=VehicleAssignment.updatedBy || 10;
       this.updateDateTime = VehicleAssignment.updateDateTime;
    }
  }
  
}

