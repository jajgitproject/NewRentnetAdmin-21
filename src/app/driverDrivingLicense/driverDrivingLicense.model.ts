// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverDrivingLicense {
  driverDrivingLicenseID:number;
  driverID:number;
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
  verified:string;
  verifiedData:string;
  verifiedBy:string;
  verificationRemark:string;
  verificationDate:string;
  userID:number;
  drivingLicenseExpiryDate:Date;
  drivingLicenseExpiryDateString:string;

  constructor(driverDrivingLicense) {
    {
       this.driverDrivingLicenseID = driverDrivingLicense.driverDrivingLicenseID || -1;
       this.driverID = driverDrivingLicense.driverID || '';
       this.driverAddressCityID = driverDrivingLicense.driverAddressCityID || '';
       this.permanentAddress = driverDrivingLicense.permanentAddress || '';
       this.drivingLicenseNo = driverDrivingLicense.drivingLicenseNo || '';
       this.licenseImage = driverDrivingLicense.licenseImage || '';
       this.reasonOfLicenseImageNonAvailblity = driverDrivingLicense.reasonOfLicenseImageNonAvailblity || '';
       this.licenseIssueCityID = driverDrivingLicense.licenseIssueCityID || '';
       this.licenseAuthorityName = driverDrivingLicense.licenseAuthorityName || '';
       this.uploadedByID = driverDrivingLicense.uploadedByID || '';
       this.uploadEditedDateString = driverDrivingLicense.uploadEditedDateString || '';
       this.drivingLicenseExpiryDateString = driverDrivingLicense.drivingLicenseExpiryDateString || '';
       this.uploadRemark = driverDrivingLicense.uploadRemark || '';
       this.activationStatus = driverDrivingLicense.activationStatus || '';

       this.verified = driverDrivingLicense.verified || '';
       this.verifiedBy = driverDrivingLicense.verifiedBy || '';
       this.verificationRemark = driverDrivingLicense.verificationRemark || '';
       this.verificationDate = driverDrivingLicense.verificationDate || '';

       this.uploadEditedDate=new Date();
       this.drivingLicenseExpiryDate = new Date();
    }
  }
  
}

