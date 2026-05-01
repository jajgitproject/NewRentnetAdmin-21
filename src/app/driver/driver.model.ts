// @ts-nocheck
import { formatDate } from '@angular/common';
export class Driver {
   driverID: number;
   driverName: string;
   driverGradeID: number;
   driverFatherName:string;
   driverGrade:string;
   driverEmail:string;
   driverOfficialIdentityNumber:string;
   aadharAuthenticationToken:string;
   dob:Date;
   driverGradeName:string;
   dobString:string;
   rtoState:string;
   password:string;
   confirmpassword:string;
   idMark:string;
   localAddressCity:string;
   highestQualificationID:number;
   highestQualification:string;
   bloodGroup:string;
   driverStatus:string;
   dateOfJoining:Date;
   dateOfJoiningString:string;
   dateOfLeaving:Date;
   dateOfLeavingString:string;
   localAddressAddressString:string;
   localAddressLatLong:string;
   localAddressCityID:number;
   localAddress:string;
   localPincode:string;
   permanentAddressCityID:number;
   permanentAddressCity:number;
   permanentAddress:string;
   permanentAddressPincode:string;
   mobile1:string;
   mobile2:string;
   hubID:number;
   hub:string;
   locationID:number;
   location:string;
   ownedSupplier:string;
   supplierID:number;
   supplier:string;
   supplierOfficialIdentityNumber:string;
   englishSpeakingSkills:string;
   referenceOf:string;
   rtoStateID:number;
   policeVerification:string;
   driverImage:string;
   medicalInsurance:boolean;
   drivingSinceDate:Date;
   drivingSinceDateString:string;
   countryCode:string;
   countryCodes:string;
   activationStatus:boolean;
   latitude:string;
   longitude:string;
   companyName:string;
   companyID:number;
   userID:number;
   isAdhoc:boolean;
   
  constructor(driver) {
    {
       this.driverID = driver.driverID || -1;
       this.driverName = driver.driverName || '';
       this.driverEmail = driver.driverEmail || '';
       this.driverGradeID = driver.driverGradeID || '';
       this.driverFatherName = driver.driverFatherName || '';
       this.driverOfficialIdentityNumber = driver.driverOfficialIdentityNumber || '';
       this.aadharAuthenticationToken = driver.aadharAuthenticationToken || '';
       this.dobString = driver.dobString || '';
       this.idMark = driver.idMark || '';
       this.highestQualificationID = driver.highestQualificationID || '';
       this.highestQualification = driver.highestQualification || '';
       this.bloodGroup = driver.bloodGroup || '';
       this.driverStatus = driver.driverStatus || '';
       this.dateOfJoiningString = driver.dateOfJoiningString || '';
       this.dateOfLeavingString = driver.dateOfLeavingString || '';
       this.localAddressAddressString = driver.localAddressAddressString || '';
       this.localAddressLatLong = driver.localAddressLatLong || '';
       this.localAddressCityID = driver.localAddressCityID || '';
       this.localAddressCity = driver.localAddressCity || '';
       this.permanentAddress = driver.permanentAddress || '';
       this.localPincode = driver.localPincode || '';
       this.permanentAddressCityID = driver.permanentAddressCityID || '';
       this.permanentAddressCity = driver.permanentAddressCity || '';
       this.permanentAddress = driver.permanentAddress || '';
       this.permanentAddressPincode = driver.permanentAddressPincode || '';
       this.mobile1 = driver.mobile1 || '';
       this.mobile2 = driver.mobile2 || '';
       this.hubID = driver.hubID || '';
       this.hub = driver.hub || '';
       this.locationID = driver.locationID || '';
       this.location = driver.location || '';
       this.ownedSupplier = driver.ownedSupplier || '';
       this.supplierID = driver.supplierID || '';
       this.supplier = driver.supplier || '';
       this.supplierOfficialIdentityNumber = driver.supplierOfficialIdentityNumber || '';
       this.englishSpeakingSkills = driver.englishSpeakingSkills || '';
       this.referenceOf = driver.referenceOf || '';
       this.rtoStateID = driver.rtoStateID || '';
       this.policeVerification = driver.policeVerification || '';
       this.driverImage = driver.driverImage || '';
       this.isAdhoc = driver.isAdhoc || '';
       this.medicalInsurance = driver.medicalInsurance || '';
       this.drivingSinceDateString = driver.drivingSinceDateString || '';
       this.countryCodes = driver.countryCodes || '';
       this.activationStatus = driver.activationStatus || '';
       this.password = driver.password || '';
       this.confirmpassword = driver.confirmpassword || '';
       this.companyName=driver.companyName || '';
       this.companyID=driver.companyID || '';
       

       this.dob=new Date();
       this.dateOfJoining=new Date();
       //this.dateOfLeaving=new Date();
       this.drivingSinceDate=new Date();
    }
  }

  
}


  export class MobileEmailModel{
  mobile1: string;
  isDuplicate: boolean;
}
