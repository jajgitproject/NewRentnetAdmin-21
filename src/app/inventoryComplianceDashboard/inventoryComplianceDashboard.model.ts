// @ts-nocheck
export class InventoryComplianceDashboardModel {
  inventoryID: number;
  registrationNumber: string;
  documentType: string;
  documentID :number
  documentNo: string;
  documentExpiry: Date ;
  daysRemaining: string;
  documentStatus: string;
  ownedSupplier: string;
  location: string;
  documentName: string;


  constructor(inventoryComplianceDashboardModel) {
    this.inventoryID = inventoryComplianceDashboardModel.inventoryID || 0;
    this.registrationNumber = inventoryComplianceDashboardModel.registrationNumber || '';
    this.documentType = inventoryComplianceDashboardModel.documentType || '';
    this.documentNo = inventoryComplianceDashboardModel.documentNo || '';
    this.documentExpiry = inventoryComplianceDashboardModel.documentExpiry || '';
    this.daysRemaining = inventoryComplianceDashboardModel.daysRemaining || '';
    this.documentStatus = inventoryComplianceDashboardModel.documentStatus || '';
    this.ownedSupplier = inventoryComplianceDashboardModel.ownedSupplier || '';
    this.location = inventoryComplianceDashboardModel.location || '';
    this.documentName = inventoryComplianceDashboardModel.documentName || '';
  }
}


