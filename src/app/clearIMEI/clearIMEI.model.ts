// @ts-nocheck
import { formatDate } from '@angular/common';
export class ClearIMEI {
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
   
  constructor(clearIMEI) {
    {
       this.driverID = clearIMEI.driverID || -1;
       this.driverName = clearIMEI.driverName || '';
       this.driverEmail = clearIMEI.driverEmail || '';
       this.driverGradeID = clearIMEI.driverGradeID || '';
       this.driverFatherName = clearIMEI.driverFatherName || '';
       this.driverOfficialIdentityNumber = clearIMEI.driverOfficialIdentityNumber || '';
       this.aadharAuthenticationToken = clearIMEI.aadharAuthenticationToken || '';
       this.dobString = clearIMEI.dobString || '';
       this.idMark = clearIMEI.idMark || '';
       this.highestQualificationID = clearIMEI.highestQualificationID || '';
       this.highestQualification = clearIMEI.highestQualification || '';
       this.bloodGroup = clearIMEI.bloodGroup || '';
       this.driverStatus = clearIMEI.driverStatus || '';
       this.dateOfJoiningString = clearIMEI.dateOfJoiningString || '';
       this.dateOfLeavingString = clearIMEI.dateOfLeavingString || '';
       this.localAddressAddressString = clearIMEI.localAddressAddressString || '';
       this.localAddressLatLong = clearIMEI.localAddressLatLong || '';
       this.localAddressCityID = clearIMEI.localAddressCityID || '';
       this.localAddressCity = clearIMEI.localAddressCity || '';
       this.permanentAddress = clearIMEI.permanentAddress || '';
       this.localPincode = clearIMEI.localPincode || '';
       this.permanentAddressCityID = clearIMEI.permanentAddressCityID || '';
       this.permanentAddressCity = clearIMEI.permanentAddressCity || '';
       this.permanentAddress = clearIMEI.permanentAddress || '';
       this.permanentAddressPincode = clearIMEI.permanentAddressPincode || '';
       this.mobile1 = clearIMEI.mobile1 || '';
       this.mobile2 = clearIMEI.mobile2 || '';
       this.hubID = clearIMEI.hubID || '';
       this.hub = clearIMEI.hub || '';
       this.locationID = clearIMEI.locationID || '';
       this.location = clearIMEI.location || '';
       this.ownedSupplier = clearIMEI.ownedSupplier || '';
       this.supplierID = clearIMEI.supplierID || '';
       this.supplier = clearIMEI.supplier || '';
       this.supplierOfficialIdentityNumber = clearIMEI.supplierOfficialIdentityNumber || '';
       this.englishSpeakingSkills = clearIMEI.englishSpeakingSkills || '';
       this.referenceOf = clearIMEI.referenceOf || '';
       this.rtoStateID = clearIMEI.rtoStateID || '';
       this.policeVerification = clearIMEI.policeVerification || '';
       this.driverImage = clearIMEI.driverImage || '';
       this.isAdhoc = clearIMEI.isAdhoc || '';
       this.medicalInsurance = clearIMEI.medicalInsurance || '';
       this.drivingSinceDateString = clearIMEI.drivingSinceDateString || '';
       this.countryCodes = clearIMEI.countryCodes || '';
       this.activationStatus = clearIMEI.activationStatus || '';
       this.password = clearIMEI.password || '';
       this.confirmpassword = clearIMEI.confirmpassword || '';
       this.companyName=clearIMEI.companyName || '';
       this.companyID=clearIMEI.companyID || '';
       

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
