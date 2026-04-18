// @ts-nocheck
export class DriverComplianceDashboard {
  driverID: number;
  driverName: string;
  documentType: string;
  documentID :number
  documentNo: string;
  documentExpiry: Date ;
  daysRemaining: string;
  documentStatus: string;
  ownedSupplier: string;
  location: string;
  documentName:string;


  constructor(driverComplianceDashboard) {
    this.driverID = driverComplianceDashboard.driverID || 0;
    this.driverName = driverComplianceDashboard.driverName || '';
    this.documentType = driverComplianceDashboard.documentType || '';
    this.documentNo = driverComplianceDashboard.documentNo || '';
    this.documentExpiry = driverComplianceDashboard.documentExpiry || '';
    this.daysRemaining = driverComplianceDashboard.daysRemaining || '';
    this.documentStatus = driverComplianceDashboard.documentStatus || '';
    this.ownedSupplier = driverComplianceDashboard.ownedSupplier || '';
    this.location = driverComplianceDashboard.location || '';
  }
}


