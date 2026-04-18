// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyPostPickUPCallModel {
  dutyPostPickUPCallID: number;
  dutySlipID: number;
  userID: number;
  postPickUpCallMode: string;
  postPickUpCallDetails: string;
  postPickUpCallDate: Date | null;
  postPickUpCallTime: Date | null;
  postPickUpCallByID: number | null;
  postPickUpCallDateString: string;
  postPickUpCallTimeString: string;

  // Status
  activationStatus: boolean;
  constructor(dutyPostPickUPCallModel) {
    {
      this.dutyPostPickUPCallID = dutyPostPickUPCallModel.dutyPostPickUPCallID || -1;
      this.dutySlipID = dutyPostPickUPCallModel.dutySlipID || '';
      this.userID = dutyPostPickUPCallModel.userID || '';
      this.postPickUpCallMode = dutyPostPickUPCallModel.postPickUpCallMode || '';
      this.postPickUpCallDetails = dutyPostPickUPCallModel.postPickUpCallDetails || '';
      this.postPickUpCallByID = dutyPostPickUPCallModel.postPickUpCallByID || '';
      this.postPickUpCallDate = dutyPostPickUPCallModel.postPickUpCallDate || '';
      this.postPickUpCallTime = dutyPostPickUPCallModel.postPickUpCallTime || '';
      this.activationStatus = dutyPostPickUPCallModel.activationStatus || '';
      this.postPickUpCallDate = new Date();
      this.postPickUpCallTime = new Date();

    }
  }
  
}

