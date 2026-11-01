// @ts-nocheck
export class DutyNight {
  dutyNightID: number;
  dutySlipID: number;
  numberOnNights: number;
  changedByID: number;
  firstName: string;
  lastName: string;
  changeDateTime: Date;
  changeDateTimeString: string;
  reasonOfChange: string;
  activationStatus: boolean;
  userID: number;

  constructor(dutyNight) {
    {
      this.dutyNightID = dutyNight.dutyNightID || -1;
      this.dutySlipID = dutyNight.dutySlipID || '';
      this.numberOnNights = dutyNight.numberOnNights || '';
      this.changedByID = dutyNight.changedByID || '';
      this.firstName = dutyNight.firstName || '';
      this.lastName = dutyNight.lastName || '';
      this.changeDateTimeString = dutyNight.changeDateTimeString || '';
      this.reasonOfChange = dutyNight.reasonOfChange || '';
      this.activationStatus = dutyNight.activationStatus || '';
      this.changeDateTime = new Date();
    }
  }
}
