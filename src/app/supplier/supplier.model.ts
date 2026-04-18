// @ts-nocheck
import { formatDate } from '@angular/common';
export class Supplier {
   supplierID: number;
   userID:number;
   supplierName: string;
   addressCityID:number;
   address:string;
   pin:string;
   phone:string;
   fax:string;
   email:string;
   geoPointName:string;
   supplierCreatedByEmployeeID:number;
   supplierCreationRemark:string;
   supplierStatus:string;
   verificationStatus:string;
   supplierRegistrationDate:string;
   stateID:number;
  countryID:number;
  country:string;
  city:string;
  stateName:string;
  ifCreatedFromCompanyReferenceCompanyID:number;
  ifCreatedFromCompanyReferenceCompany:string;
  supplierCode:string;
  supplierTypeID:number;
  supplierType:string;
  internalExternal:string;
   supplierOfficialIdentityNumber:string;

  constructor(supplier) {
    {
       this.supplierID = supplier.supplierID || -1;
       this.supplierName = supplier.supplierName || '';
       this.addressCityID = supplier.addressCityID || '';
       this.address = supplier.address || '';
       this.pin = supplier.pin || '';
       this.phone = supplier.phone || '';
       this.fax = supplier.fax || '';
       this.email = supplier.email || '';
        this.supplierOfficialIdentityNumber = supplier.supplierOfficialIdentityNumber || '';
       this.supplierCreatedByEmployeeID = supplier.supplierCreatedByEmployeeID || '';
       this.ifCreatedFromCompanyReferenceCompanyID = supplier.ifCreatedFromCompanyReferenceCompanyID || '';
       this.supplierCreationRemark = supplier.supplierCreationRemark || '';
       this.supplierCode=supplier.supplierCode || 'N/A';
      this.supplierTypeID=supplier.supplierTypeID || '';
      this.supplierType=supplier.supplierType || '';
      this.internalExternal=supplier.internalExternal || '';
    }
  }
  
}

