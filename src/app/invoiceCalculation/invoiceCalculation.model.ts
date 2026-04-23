// @ts-nocheck
import { formatDate } from '@angular/common';
export class InvoiceCalculationModel
{
    invoiceCalculationID:number;
    invoiceID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    totalKMWithAddtionalKM:number;
    totalHoursWithAddtionalHours:number;
    totalAmountBeforeExpences:number;
    totalParkingTollFastagRFIDAmount:number;
    totalChargebleExpenceAmount:number;
    totalInterStateAmount:number;
    totalExpences:number;
    totalAmountAfterExpences:number;
    totalAmountAfterGST:number;
    invoiceTotalAmountBeforeAdvance:number;
    totalAmountAfterDiscount :number;
    sendToGSTAmount:number; 
    activationStatus:boolean

    invoiceAddtionalKmsAndHoursModel:InvoiceAddtionalKmsAndHoursModel;
    invoiceBookerModel:InvoiceBookerModel;
    invoiceCessModel:InvoiceCessModel;
    invoiceCommunicationModel:InvoiceCommunicationModel;
    invoiceCreditCardModel:InvoiceCreditCardModel;
    invoiceCreditNoteModel:InvoiceCreditNoteModel;
    invoiceCustomerModel:InvoiceCustomerModel;
    invoiceCustomerFieldsModel:InvoiceCustomerFieldsModel[];
    invoiceDiscountModel:InvoiceDiscountModel;
    invoiceDriverAllownceModel:InvoiceDriverAllownceModel;
    invoiceDutyModel:InvoiceDutyModel;
    invoiceEcoBranchModel:InvoiceEcoBranchModel;
    invoiceEcoCompanyModel:InvoiceEcoCompanyModel;
    InvoiceFixedDetailsModel:InvoiceFixedDetailsModel;
    invoiceFuelSurchargeModel:InvoiceFuelSurchargeModel;
    invoiceGSTModel:InvoiceGSTModel;
    invoiceInterstateTaxModel:InvoiceInterstateTaxModel[];
    invoiceLumpsumModel:InvoiceLumpsumModel;
    invoiceNightModel:InvoiceNightModel;
    invoicePackageModel:InvoicePackageModel;
    invoicePackageFGRModel:InvoicePackageFGRModel;
    invoicePackageValuesModel:InvoicePackageValuesModel;
    invoicePassengerModel:InvoicePassengerModel;
    invoiceReservationModel:InvoiceReservationModel;
    invoiceSEZModel:InvoiceSEZModel
    invoiceStatusChangeLogModel:InvoiceStatusChangeLogModel;
    invoiceTollParkingModel:InvoiceTollParkingModel[];
}


export interface InvoiceAddtionalKmsAndHoursModel
{
    invoiceAddtionalKmsAndHoursID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    invoiceCalculationID:number;
    reservationID:number;
    addtionalKms:number;
    addtionalMinutes:number;
    showAddtionKMAndHours:boolean;
    activationStatus:boolean;
}


export interface InvoiceBookerModel
{
    invoiceBookerID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;   
    reservationID:number;
    bookerID:number;
    bookerSalutation:string;
    bookerName:string;
    activationStatus:boolean;

}


export interface InvoiceCessModel
{
    invoiceCessID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    cessName:string;
    cessPercentage:number;
    totalCessAmount:number;
    activationStatus:boolean;
}


export interface InvoiceCommunicationModel
{
    invoiceCommunicationID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    communicationType:string;
    communicationDate:Date;
    CommunicationByID:number;
    communicationTextSent:string;
    communicationInternalRemark:string;
    communicationMode:string;
    paymentLink:string;
    activationStatus:boolean;
}


export interface InvoiceCreditCardModel
{
    invoiceCreditCardID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    creditCardProcessedAmount:number;
    creditCardProcessingRate:number;
    totalCreditCardProcessingAmount:number;
    activationStatus:number;
}


export interface InvoiceCreditNoteModel
{
    invoiceCreditNoteID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    activationStatus:number;
}


export interface InvoiceCustomerModel
{
    invoiceCustomerID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    customerTypeID:number;
    customerType:string;
    customerID:number;
    customerName:string;
    customerAddress:string;
    customerCountryID:number;
    customerCountryName:string;
    customerStateID:number;    
    customerStateName:string;
    customerCityID:number;
    customerCityName:string;
    customerPinCode:string;
    customerGSTStateID:number;
    customerGSTStateName:string;
    customerGSTStateCode:string;
    customerGSTNumber:string;
    billingName:string;
    billingAddress:string;   
    billingCityID:number;
    billingCityName:string;
    billingStateID:number;
    billingStateName:string;
    billingPin:string;
    eInvoiceAddress:string;
    startDate:Date;
    endDate:Date;
    activationStatus:boolean;
}


export interface InvoiceCustomerFieldsModel
{
    invoiceCustomerFieldsID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    customerReservationFieldID:number;
    customerReservationFieldValue:string;
    customerReservationFieldName:string;
    activationStatus:boolean;
}

export interface InvoiceDiscountModel
{
    invoiceDiscountID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    discountPercentageOnPackage:number;
    discountPercentageOnExtraKM:number;
    discountPercentageOnExtraHour:number;
    discountAmountOnPackage:number;
    discountAmountOnExtraKM:number;
    discountAmountOnExtraHour:number;
    activationStatus:boolean;
}


export interface InvoiceDriverAllownceModel
{
    invoiceDriverAllowanceID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    dailyDriverAllowanceRate:number;
    fixedDriverAllowanceRate:number;   
    totalDriverAllowanceDays:number;
    totalDriverAllowanceAmount:number;
    activationStatus:boolean;
}


export interface InvoiceDutyModel
{
    invoiceDutyID:number;
    invoiceCalculationID:number;
    dtySlipID:number;
    dtySlipForBillingID:number;
    reservationID:number;
    dutyStartDateTime:Date;    
    dutyEndDateTime:Date;  
    totalRunningKM:number;
    totalRunningDays:number;
    totalRunningHours:number;
    totalRunningMinutes:number;
    totalRunningSeconds:number;
    billFromTo:string;
    totalTimeInMinuts:number;
    activationStatus:boolean;
}


export interface InvoiceEcoBranchModel
{
    invoiceEcoBranchID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    branchID:number;
    branchName:string;
    branchAddress:string;
    branchCountryID:number;
    branchCountryName:string;
    branchStateID:number;
    branchStateName:string;
    branchCityID:number;
    branchCityName:string;
    branchPinCode:string;
    branchPhone:string;
    branchFax:string;
    branchGSTNumber:string;
    branchLUTID:number;
    branchLUTNumber:string;
    branchLUTExpiryDate:Date;
    activationStatus:boolean;
}


export interface InvoiceEcoCompanyModel
{
    invoiceEcoCompanyID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    ecoCompanyID:number;
    ecoCompanyName:string;
    ecoCompanyAddress:string;
    ecoCompanyCountryID:number;
    ecoCompanyCountryName:string;
    ecoCompanyStateID:number;
    ecoCompanyStateName:string;
    ecoCompanyCityID:number;
    ecoCompanyCityName:string;
    ecoCompanyPinCode:string;
    cin:string;
    phoneNumber:string;
    fax:string;
    emailBilling:string;
    emailReservation:string;
    correspondenceAddress:string;
    correspondenceCountryID:number;
    correspondenceCountryName:string;
    correspondenceStateID:number;
    correspondenceStateName:string;
    correspondenceCityID:number;
    correspondenceCityName:string;
    correspondencePinCode:string;
    activationStatus:boolean;
}


export interface InvoiceFixedDetailsModel
{
    invoiceFixedDetailsID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    customerContractID:number;
    billFromTo:string;
    packageJumpCriteria:string;
    nextPackageSelectionCriteria:string;
    packageGraceMinutes:number;
    packageGraceKms:number;
    activationStatus:boolean;
}


export interface InvoiceFuelSurchargeModel
{
    invoiceFuelSurchargeID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    totalFuelSurchargeOnExtraKM:number;
    totalFuelSurchargeOnExtraHours:number;
    totalFuelSurchargeOnPackageRate:number;
    activationStatus:boolean;
}


export interface InvoiceGSTModel
{
    invoiceGSTID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    igstPercentage:number;
    igstAmount:number;
    cgstPercentage:number;
    cgstAmount:number;
    sgstPercentage:number;
    sgstAmount:number;
    applicableGST:string;
    gstSAC:string;
    activationStatus:boolean;
    gstNumber:string;
    billingName:string;
    billingAddress:string;
    billingCityID:number;
    billingStateID:number;
    billingPin:string;
    eInvoiceAddress:string;
}



export interface InvoiceInterstateTaxModel
{
    invoiceInterstateTaxID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    invoiceCalculationID:number;
    reservationID:number;
    dutyInterstateTaxID:number;
    interStateTaxID:number;
    stateName:string;
    dutyInterStateTaxImage:string;
    amountToBeChargedInCurrentDuty:number;
    activationStatus:boolean;
}


export interface InvoiceLumpsumModel
{
    invoiceLumpsumID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    lumpsumAmount:number;
    attachment:string;
    activationStatus:boolean;
}


export interface InvoiceNightModel
{
    invoiceNightID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    totalNights:number;
    totalNightChargesAmount:number;
    nightChargesPerNight:number;
    nightChargeable:boolean;
    nightChargeForSupplier:number;
    nightChargeStartTime:Date;
    nightChargeEndTime:Date;
    graceMinutesForNightCharges:number;
    graceMinutesNightChargeAmount:number;
    activationStatus:boolean;
}


export interface InvoicePackageModel
{
    invoicePackageID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    invoiceCalculationID:number;
    reservationID:number;
    serviceTypeID:number;
    serviceType:string;
    packageTypeID:number;
    packageType:string;
    packageConfigurationID:number;
    customerContractID:number;
    customerContractCarCategoryID:number;
    customerContractCarCategory:string;
    customerContractCityTiersID:number;
    customerContractCityTiers:string;
    packageID:number;
    package:string;
    minimumHours:number;
    minimumKM:number;
    billingOption:string;
    baseRate:number;
    baseRateForSupplier:number;
    extraKMRate:number;
    extraKMRateForSupplier:number;
    extraHRRate:number;
    extraHRRateForSupplier:number;
    driverAllowance:number;
    driverAllowanceForSupplier:number;
    kmsPerExtraHR:number;
    nightChargeable:boolean;
    nightCharge:number;
    nightChargeForSupplier:number;
    nightChargeStartTime:Date;
    nightChargeEndTime:Date;
    graceMinutesForNightCharge:number;
    graceMinutesNightChargeAmount:number;
    fKMP2P:number;
    fixedP2PAmount:number;
    additionalKM:number;
    additionalMinutes:number;
    tollChargeable:boolean;
    parkingChargeable:boolean;
    interStateTaxChargeable:boolean;
    activationStatus:boolean;


}


export interface InvoicePackageFGRModel
{
    invoicePackageFGRID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    fgrKM:number;
    fgrKMRate:number;
    fgrKMAmount:number;
    fgrFixedAmount:number;
    activationStatus:boolean;
}


export interface InvoicePackageValuesModel
{
    invoicePackageValuesID:number;
    invoicePackageID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    invoiceCalculationID:number;
    reservationID:number;
    packageConfigurationID:number;
    packageBaseRate:number;
    extraKMs:number;
    extraKMAmount:number;
    extraMinutes:number;
    extraMinutesAmount:number;
    activationStatus:boolean;
}


export interface InvoicePassengerModel
{
    invoicePassengerID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    passengerID:number;
    passengerSalutation:string;
    passengerName:string;
    passengerDepartmentID:number;
    passengerDepartmentName:string;
    activationStatus:boolean;
}


export interface InvoiceReservationModel
{
    invoiceReservationID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    reservationGroupID:number;
    activationStatus:boolean;
}


export interface InvoiceSEZModel
{
    invoiceSEZID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    sezNarration:string;
    sezPercentage:number;
    sezAmount:number;
    activationStatus:boolean;
}


export interface InvoiceStatusChangeLogModel
{
    invoiceStatusChangeLogID:number;
    invoiceCalculationID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    reservationID:number;
    status:string;
    statusReason:string;
    statusDate:Date;
    statusChangedByID:number;
    activationStatus:boolean;
}


export interface InvoiceTollParkingModel
{

    invoiceTollParkingID:number;
    dutySlipID:number;
    dutySlipForBillingID:number;
    invoiceCalculationID:number;
    reservationID:number;
    dutyTollParkingID:number;
    tollParkingType:string;
    tollParkingAmount:number;
    tollParkingImage:string;
    activationStatus:boolean;
}
