// @ts-nocheck
export class SupplierComplianceDashboard {
  supplierID: number;
  supplierName: string;
  documentType: string;
  documentID :number
  documentNo: string;
  documentExpiry: Date ;
  daysRemaining: string;
  documentStatus: string;
  ownedSupplier: string;
  location: string;
  documentName:string;


  constructor(supplierComplianceDashboard) {
    this.supplierID = supplierComplianceDashboard.supplierID || 0;
    this.supplierName = supplierComplianceDashboard.supplierName || '';
    this.documentType = supplierComplianceDashboard.documentType || '';
    this.documentNo = supplierComplianceDashboard.documentNo || '';
    this.documentExpiry = supplierComplianceDashboard.documentExpiry || '';
    this.daysRemaining = supplierComplianceDashboard.daysRemaining || '';
    this.documentStatus = supplierComplianceDashboard.documentStatus || '';
    this.ownedSupplier = supplierComplianceDashboard.ownedSupplier || '';
    this.location = supplierComplianceDashboard.location || '';
  }
}


