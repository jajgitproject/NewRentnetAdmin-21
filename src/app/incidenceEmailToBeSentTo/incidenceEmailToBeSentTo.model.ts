// @ts-nocheck
export class IncidenceEmailToBeSentTo {
  incidenceEmailToBeSentToID: number;
  incidenceEmailToBeSentTo: string;
  incidenceEmailToBeSentToType: string;
  userID: number;
  activationStatus: boolean;

  constructor(incidenceEmailToBeSentTo) {
    this.incidenceEmailToBeSentToID = incidenceEmailToBeSentTo.incidenceEmailToBeSentToID || -1;
    this.incidenceEmailToBeSentTo = incidenceEmailToBeSentTo.incidenceEmailToBeSentTo || '';
    this.incidenceEmailToBeSentToType = incidenceEmailToBeSentTo.incidenceEmailToBeSentToType || '';
    this.activationStatus = incidenceEmailToBeSentTo.activationStatus || '';
  }
}
