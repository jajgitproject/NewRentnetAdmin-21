// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDrivingLicenseVerification {
  customerPersonDrivingLicenseID: number;
  verifiedByID : number;
  verificationRemark:string;

  verificationDate :Date; 
  verificationDateString:string;
  licenseVerified:boolean;
  status:string;
  verified:string;
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
  verifiedBy:string;
  userID:number;

  constructor(customerPersonDrivingLicenseVerification) {
    {
       this.customerPersonDrivingLicenseID = customerPersonDrivingLicenseVerification.customerPersonDrivingLicenseID || -1;
       this.verifiedByID = customerPersonDrivingLicenseVerification.verifiedByID||'';
       this.verificationRemark = customerPersonDrivingLicenseVerification.verificationRemark || '';
       this.verificationDateString = customerPersonDrivingLicenseVerification.verificationDateString || '';
       this.licenseVerified = customerPersonDrivingLicenseVerification.licenseVerified || '';
       this.verified = customerPersonDrivingLicenseVerification.verified || '';
       this.customerPersonID = customerPersonDrivingLicenseVerification.customerPersonID || '';
       this.customerPersonAddressCityID = customerPersonDrivingLicenseVerification.customerPersonAddressCityID || '';
       this.permanentAddress = customerPersonDrivingLicenseVerification.permanentAddress || '';
       this.drivingLicenseNo = customerPersonDrivingLicenseVerification.drivingLicenseNo || '';
       this.licenseImage = customerPersonDrivingLicenseVerification.licenseImage || '';
       this.reasonOfLicenseImageNonAvailblity = customerPersonDrivingLicenseVerification.reasonOfLicenseImageNonAvailblity || '';
       this.licenseIssueCityID = customerPersonDrivingLicenseVerification.licenseIssueCityID || '';
       this.licenseAuthorityName = customerPersonDrivingLicenseVerification.licenseAuthorityName || '';
       this.uploadedByID = customerPersonDrivingLicenseVerification.uploadedByID || '';
       this.uploadEditedDateString = customerPersonDrivingLicenseVerification.uploadEditedDateString || '';
       this.uploadRemark = customerPersonDrivingLicenseVerification.uploadRemark || '';
       this.activationStatus = customerPersonDrivingLicenseVerification.activationStatus || '';

       this.verificationDate = new Date();
      
    }
  }
  
}

