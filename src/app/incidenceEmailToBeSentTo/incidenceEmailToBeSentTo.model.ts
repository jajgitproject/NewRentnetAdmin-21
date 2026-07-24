// @ts-nocheck
export class IncidenceEmailToBeSentTo {
  incidenceEmailToBeSentToID: number;
  incidenceEmailToBeSentTo: string;
  incidenceEmailToBeSentToType: string;
  userID: number;
  activationStatus: boolean;

  constructor(incidenceEmailToBeSentTo) {
    const src = incidenceEmailToBeSentTo || {};
    this.incidenceEmailToBeSentToID =
      src.incidenceEmailToBeSentToID ?? src.IncidenceEmailToBeSentToID ?? -1;
    this.incidenceEmailToBeSentTo =
      src.incidenceEmailToBeSentTo ?? src.IncidenceEmailToBeSentTo ?? '';
    this.incidenceEmailToBeSentToType = (
      src.incidenceEmailToBeSentToType ??
      src.IncidenceEmailToBeSentToType ??
      ''
    )
      .toString()
      .trim();
    this.activationStatus =
      src.activationStatus ?? src.ActivationStatus ?? true;
    this.userID = src.userID ?? src.UserID ?? 0;
  }
}
