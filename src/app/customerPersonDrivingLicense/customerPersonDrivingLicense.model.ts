// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDrivingLicense {
  customerPersonDrivingLicenseID:number;
  customerPersonID:number;
  customerPersonAddressCityID:number;
  addressCity:string;
  permanentAddress:string;
  drivingLicenseNo:string;
  licenseImage:string;
  reasonOfLicenseImageNonAvailblity:string;
  licenseIssueCityID:number;
  issuingCity:string;
  licenseAuthorityName:string;
  uploadedByID:number;
  uploadedBy:string;
  uploadEditedDate:Date;
  uploadEditedDateString:string;
  uploadRemark:string;
  activationStatus:boolean;
  verified:string;
  verifiedData:string;
  verifiedBy:string;
  verificationRemark:string;
  verificationDate:string;
  userID:number;

  constructor(customerPersonDrivingLicense) {
    {
       this.customerPersonDrivingLicenseID = customerPersonDrivingLicense.customerPersonDrivingLicenseID || -1;
       this.customerPersonID = customerPersonDrivingLicense.customerPersonID || '';
       this.customerPersonAddressCityID = customerPersonDrivingLicense.customerPersonAddressCityID || '';
       this.permanentAddress = customerPersonDrivingLicense.permanentAddress || '';
       this.drivingLicenseNo = customerPersonDrivingLicense.drivingLicenseNo || '';
       this.licenseImage = customerPersonDrivingLicense.licenseImage || '';
       this.reasonOfLicenseImageNonAvailblity = customerPersonDrivingLicense.reasonOfLicenseImageNonAvailblity || '';
       this.licenseIssueCityID = customerPersonDrivingLicense.licenseIssueCityID || '';
       this.licenseAuthorityName = customerPersonDrivingLicense.licenseAuthorityName || '';
       this.uploadedByID = customerPersonDrivingLicense.uploadedByID || '';
       this.uploadEditedDateString = customerPersonDrivingLicense.uploadEditedDateString || '';
       this.uploadRemark = customerPersonDrivingLicense.uploadRemark || '';
       this.activationStatus = customerPersonDrivingLicense.activationStatus || '';

       this.verified = customerPersonDrivingLicense.verified || '';
       this.verifiedBy = customerPersonDrivingLicense.verifiedBy || '';
       this.verificationRemark = customerPersonDrivingLicense.verificationRemark || '';
       this.verificationDate = customerPersonDrivingLicense.verificationDate || '';

       this.uploadEditedDate=new Date();
    }
  }
  
}

