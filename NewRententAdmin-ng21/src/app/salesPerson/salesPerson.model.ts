// @ts-nocheck
export class ReservationSalesPersonModel {
  reservationSalesPersonID:number;
  reservationID:number;
  salesPersonID:number;
  salesPerson:string;
  userID:number;
  activationStatus:boolean;

  constructor(reservationSalesPersonModel) {
    {
      this.reservationSalesPersonID = reservationSalesPersonModel.reservationSalesPersonID || '';
      this.reservationID = reservationSalesPersonModel.reservationID || '';
      this.salesPersonID = reservationSalesPersonModel.salesPersonID || '';
      this.salesPerson = reservationSalesPersonModel.salesPerson || '';
      this.activationStatus = reservationSalesPersonModel.activationStatus || '';
    }
  }
}
