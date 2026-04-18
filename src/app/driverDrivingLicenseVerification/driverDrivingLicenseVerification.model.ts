// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverDrivingLicenseVerification {
  driverDrivingLicenseID:number;
  driverID:number;
  driver:string;
  supplier:string;
  driverAddressCityID:number;
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
  status:string;
  verified:string;
  verifiedBy:string;
  verifiedByID:number;
  verificationRemark:string;
  verificationDate:Date;
  verificationDateString:string;
  userID:number;
  constructor(driverDrivingLicenseVerification) {
    {
       this.driverDrivingLicenseID = driverDrivingLicenseVerification.driverDrivingLicenseID || -1;
       this.driverID = driverDrivingLicenseVerification.driverID || '';
       this.driverAddressCityID = driverDrivingLicenseVerification.driverAddressCityID || '';
       this.permanentAddress = driverDrivingLicenseVerification.permanentAddress || '';
       this.drivingLicenseNo = driverDrivingLicenseVerification.drivingLicenseNo || '';
       this.licenseImage = driverDrivingLicenseVerification.licenseImage || '';
       this.reasonOfLicenseImageNonAvailblity = driverDrivingLicenseVerification.reasonOfLicenseImageNonAvailblity || '';
       this.licenseIssueCityID = driverDrivingLicenseVerification.licenseIssueCityID || '';
       this.licenseAuthorityName = driverDrivingLicenseVerification.licenseAuthorityName || '';
       this.uploadedByID = driverDrivingLicenseVerification.uploadedByID || '';
       this.uploadEditedDateString = driverDrivingLicenseVerification.uploadEditedDateString || '';
       this.uploadRemark = driverDrivingLicenseVerification.uploadRemark || '';
       this.activationStatus = driverDrivingLicenseVerification.activationStatus || '';

       this.verified = driverDrivingLicenseVerification.verified || '';
       this.verifiedBy = driverDrivingLicenseVerification.verifiedBy || '';
       this.verificationRemark = driverDrivingLicenseVerification.verificationRemark || '';
       this.verificationDateString=driverDrivingLicenseVerification.verificationDateString|| '';
       this.verificationDate = new Date();

       this.uploadEditedDate=new Date();
    }
  }
  
}

