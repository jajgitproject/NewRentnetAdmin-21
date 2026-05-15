// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './authentication/page404/page404.component';
import { AuthGuard } from './core/guard/auth.guard';
import { RolePageGuard } from './core/guard/role-page.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { NoSidebarLayoutComponent } from './layout/app-layout/no-sidebar-layout/no-sidebar-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard, RolePageGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
      {
        path: 'welcome',
        loadChildren: () =>
          import('./welcome/welcome.module').then((m) => m.WelcomeModule),
        data: { skipRolePageGuard: true },
      },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: { skipRolePageGuard: true },
      },

      {
        path: 'myupload',
        loadChildren: () =>
          import('./myupload/myupload.module').then(
            (m) => m.MyUploadModule
          ),
        data: { skipRolePageGuard: true },
      },

      {
        path: 'cdcLocalFixedDetails',
        loadChildren: () =>
          import('./cdcLocalFixedDetails/cdcLocalFixedDetails.module').then(
            (m) => m.CDCLocalFixedDetailsModule
          )
      },

      {
        path: 'driverComplianceDashboard',
        loadChildren: () =>
          import('./driverComplianceDashboard/driverComplianceDashboard.module').then(
            (m) => m.DriverComplianceDashboardModule
          )
      },
       {
        path: 'supplierComplianceDashboard',
        loadChildren: () =>
          import('./supplierComplianceDashboard/supplierComplianceDashboard.module').then(
            (m) => m.SupplierComplianceDashboardModule
          )
      },
      {
        path: 'tallyMis',
        loadChildren: () =>
          import('./tallyMis/tallyMis.module').then(
            (m) => m.TallyMisModule
          )
      },

      {
        path: 'dutyState',
        loadChildren: () =>
          import('./dutyState/dutyState.module').then(
            (m) => m.DutyStateModule
          )
      },
      {
        path: 'dutyStateCustomer',
        loadChildren: () =>
          import('./dutyStateCustomer/dutyStateCustomer.module').then(
            (m) => m.DutyStateCustomerModule
          )
      },

       {
        path: 'disputeType',
        loadChildren: () =>
          import('./disputeType/disputeType.module').then(
            (m) => m.DisputeTypeModule
          )
      },

      {
        path: 'changePassenger',
        loadChildren: () =>
          import('./changePassenger/changePassenger.module').then(
            (m) => m.ChangePassengerModule
          )
      },

      {
        path: 'changeBooker',
        loadChildren: () =>
          import('./changeBooker/changeBooker.module').then(
            (m) => m.ChangeBookerModule
          )
      },

      {
        path: 'changeVendor',
        loadChildren: () =>
          import('./changeVendor/changeVendor.module').then(
            (m) => m.ChangeVendorModule
          )
      },
       {
        path: 'changePickupTime',
        loadChildren: () =>
          import('./changePickupTime/changePickupTime.module').then(
            (m) => m.ChangePickupTimeModule
          )
      },

      {
        path: 'clearIMEI',
        loadChildren: () =>
          import('./clearIMEI/clearIMEI.module').then(
            (m) => m.ClearIMEIModule
          )
      },

      {
        path: 'changeCarType',
        loadChildren: () =>
          import('./changeCarType/changeCarType.module').then(
            (m) => m.ChangeCarTypeModule
          )
      },

       {
        path: 'controlPanelDialoge',
        loadChildren: () =>
          import('./controlPanelDialoge/controlPanelDialoge.module').then(
            (m) => m.ControlPanelDialogeModule
          )
      },
      {
        path: 'customerKAMCity',
        loadChildren: () =>
          import('./customerKAMCity/customerKAMCity.module').then(
            (m) => m.CustomerKAMCityModule
          )
      },
       {
        path: 'currentdata-information',
        loadChildren: () =>
          import('./currentdata-information/currentdata-information.module').then(
            (m) => m.CurrentDataInformationModule
          )
      },
      {
        path: 'packageRateDetailsForClosing',
        loadChildren: () =>
          import('./packageRateDetailsForClosing/packageRateDetailsForClosing.module').then(
            (m) => m.PackageRateDetailsForClosingModule
          )
      },

       {
        path: 'special-information',
        loadChildren: () =>
          import('./special-information/special-information.module').then(
            (m) => m.SpecialinformationModule
          )
          
      },
      {
        path: 'advanceDetailsClosing',
        loadChildren: () =>
          import('./advanceDetailsClosing/advanceDetailsClosing.module').then(
            (m) => m.AdvanceDetailsClosingModule
          )
      },
       {
        path: 'kamDetailsClosing',
        loadChildren: () =>
          import('./kamDetailsClosing/kamDetailsClosing.module').then(
            (m) => m.KAMDetailsClosingModule
          )
      },
       
      {
        path: 'settledRateClosing',
         loadChildren: () =>
          import('./settledRateClosing/settledRateClosing.module').then(
            (m) => m.SettledRateClosingModule
          )
      },

       {
        path: 'special-information',
        loadChildren: () =>
          import('./special-information/special-information.module').then(
            (m) => m.SpecialinformationModule
          )
          
      },

       {
        path: 'internal-information',
        loadChildren: () =>
          import('./internal-information/internal-information.module').then(
            (m) => m.IternallinformationModule
          )
          
      },

       {
        path: 'lumpsum-information',
        loadChildren: () =>
          import('./lumpsum-information/lumpsum-information.module').then(
            (m) => m.LumpsuminformationModule
          )
          
      },
      //  {
      //   path: 'specialInstrucation-information',
      //   loadChildren: () =>
      //     import('./specialInstrucation-information/specialInstrucation-information.module').then(
      //       (m) => m.SpecialInstrucationInformationModule
      //     )
      // },
       {
        path: 'customer-information',
        loadChildren: () =>
          import('./customer-information/customer-information.module').then(
            (m) => m.CustomerInformationModule
          )
      },

      {
        path: 'generateBillMain',
        loadChildren: () =>
          import('./generateBillMain/generateBillMain.module').then(
            (m) => m.GenerateBillMainModule
          )
      },

      {
        path: 'generalBill',
        loadChildren: () =>
          import('./generalBill/generalBill.module').then(
            (m) => m.GeneralBillModule
          )
      },
      {
        path: 'totalBookingCountDetails',
        loadChildren: () =>
          import('./totalBookingCountDetails/totalBookingCountDetails.module').then(
            (m) => m.TotalBookingCountDetailsModule
          )
      },
      {
        path: 'modeOfPaymentChanges',
        loadChildren: () =>
          import('./modeOfPaymentChanges/modeOfPaymentChanges.module').then(
            (m) => m.ModeOfPaymentChangeModule
          )
      },
      {
        path: 'bookingBackupMIS',
        loadChildren: () =>
          import('./bookingBackupMIS/bookingBackupMIS.module').then(
            (m) => m.BookingBackupMISModule
          )
      },

      {
        path: 'creditNoteDutyAdjustment',
        loadChildren: () =>
          import('./creditNoteDutyAdjustment/creditNoteDutyAdjustment.module').then(
            (m) => m.CreditNoteDutyAdjustmentModule
          )
      },

      {
        path: 'rateViewForLocalContract',
        loadChildren: () =>
          import('./rateViewForLocalContract/rateViewForLocalContract.module').then(
            (m) => m.RateViewForLocalContractModule
          )
      },

      {
        path: 'rateViewForLocalLumpsumContract',
        loadChildren: () =>
          import('./rateViewForLocalLumpsumContract/rateViewForLocalLumpsumContract.module').then(
            (m) => m.RateViewForLocalLumpsumContractModule
          )
      },

      {
        path: 'rateViewForLocalTransferContract',
        loadChildren: () =>
          import('./rateViewForLocalTransferContract/rateViewForLocalTransferContract.module').then(
            (m) => m.RateViewForLocalTransferContractModule
          )
      },

      {
        path: 'rateViewForLongTermRentalContract',
        loadChildren: () =>
          import('./rateViewForLongTermRentalContract/rateViewForLongTermRentalContract.module').then(
            (m) => m.RateViewForLongTermRentalContractModule
          )
      },

      {
        path: 'rateViewForOutstationLumpsumContract',
        loadChildren: () =>
          import('./rateViewForOutstationLumpsumContract/rateViewForOutstationLumpsumContract.module').then(
            (m) => m.RateViewForOutstationLumpsumContractModule
          )
      },

      {
        path: 'rateViewForOutstationOneWayTripContract',
        loadChildren: () =>
          import('./rateViewForOutstationOneWayTripContract/rateViewForOutstationOneWayTripContract.module').then(
            (m) => m.RateViewForOutstationOneWayTripContractModule
          )
      },

      {
        path: 'rateViewForOutstationRoundTripContract',
        loadChildren: () =>
          import('./rateViewForOutstationRoundTripContract/rateViewForOutstationRoundTripContract.module').then(
            (m) => m.RateViewForOutstationRoundTripContractModule
          )
      },
      
      {
        path: 'creditNoteHome',
        loadChildren: () =>
          import('./creditNoteHome/creditNoteHome.module').then(
            (m) => m.CreditNoteHomeModule
          )
      },

      {
        path: 'generateEInvoice',
        loadChildren: () =>
          import('./generateEInvoice/generateEInvoice.module').then(
            (m) => m.GenerateEInvoiceModule
          )
      },

      {
        path: 'dynamicEInvoice',
        loadChildren: () =>
          import('./dynamicEInvoice/dynamicEInvoice.module').then(
            (m) => m.DynamicEInvoiceModule
          )
      },


      {
        path: 'customerCorporateIndividual',
        loadChildren: () =>
          import('./customerCorporateIndividual/customerCorporateIndividual.module').then(
            (m) => m.CustomerCorporateIndividualModule
          )
      },

      {
        path: 'inventoryComplianceDashboard',
        loadChildren: () =>
          import('./inventoryComplianceDashboard/inventoryComplianceDashboard.module').then(
            (m) => m.InventoryComplianceDashboardModule
          )
      },

{
        path: 'creditNoteHistory',
        loadChildren: () =>
          import('./creditnotehistory/creditnotehistory.module').then(
            (m) => m.CreditNoteHistoryModule
          )
      },

      {
        path: 'creditNoteManagement',
        loadChildren: () =>
          import('./creditNoteManagement/creditNoteManagement.module').then(
            (m) => m.CreditNoteManagementModule
          )
      },

      {
        path: 'creditNoteApproval',
        loadChildren: () =>
          import('./creditNoteApproval/creditNoteApproval.module').then(
            (m) => m.CreditNoteApprovalModule
          )
      },

      {
        path: 'inventoryDocument',
        loadChildren: () =>
          import('./inventoryDocument/inventoryDocument.module').then(
            (m) => m.InventoryDocumentModule
          )
      },
      
      {
        path: 'customerMIS',
        loadChildren: () =>
          import('./customerMIS/customerMIS.module').then(
            (m) => m.CustomerMISModule
          )
      },
        
     
      {
        path: 'invoiceBillingHistory',
        loadChildren: () =>
          import('./invoiceBillingHistory/invoiceBillingHistory.module').then(
            (m) => m.InvoiceBillingHistoryModule
          )
      },


      {
        path: 'invoiceAttachDetach',
        loadChildren: () =>
          import('./invoiceAttachDetach/invoiceAttachDetach.module').then(
            (m) => m.InvoiceAttachDetachModule
          )
      },

      {
        path: 'invoiceDetach',
        loadChildren: () =>
          import('./invoiceDetach/invoiceDetach.module').then(
            (m) => m.InvoiceDetachModule
          )
      },

        {
        path: 'createCreditNote',
        loadChildren: () =>
          import('./createCreditNote/createCreditNote.module').then(
            (m) => m.CreateCreditNoteModule
          )
      },

      {
        path: 'setAsCustomerKAM',
        loadChildren: () =>
          import('./setAsCustomerKAM/setAsCustomerKAM.module').then(
            (m) => m.SetAsCustomerKAMModule
          )
      },
      {
        path: 'trackOnMapInfo',
        loadChildren: () =>
          import('./trackOnMapInfo/trackOnMapInfo.module').then(
            (m) => m.TrackOnMapInfoModule
          )
      },
      {
        path: 'sendSmsWhatsappMail',
        loadChildren: () =>
          import('./sendSmsWhatsappMail/sendSmsWhatsappMail.module').then(
            (m) => m.SendSmsWhatsappMailModule
          )
      },
      {
        path: 'adhocCarAndDriver',
        loadChildren: () =>
          import('./adhocCarAndDriver/adhocCarAndDriver.module').then(
            (m) => m.AdhocCarAndDriverModule
          )
      },
      {
        path: 'vendorDetails',
        loadChildren: () =>
          import('./vendorDetails/vendorDetails.module').then(
            (m) => m.VendorDetailsModule
          )
      },
      {
        path: 'customerAppBasedVehicleCategory',
        loadChildren: () =>
          import('./customerAppBasedVehicleCategory/customerAppBasedVehicleCategory.module').then(
            (m) => m.CustomerAppBasedVehicleCategoryModule
          )
      },
      {
        path: 'customerAppBasedVehicle',
        loadChildren: () =>
          import('./customerAppBasedVehicle/customerAppBasedVehicle.module').then(
            (m) => m.CustomerAppBasedVehicleModule
          )
      },
      {
        path: 'locationDetails',
        loadChildren: () =>
          import('./locationDetails/locationDetails.module').then(
            (m) => m.LocationDetailsModule
          )
      },
      {
        path: 'sendFeedbackMail',
        loadChildren: () =>
          import('./sendFeedbackMail/sendFeedbackMail.module').then(
            (m) => m.SendFeedbackMailModule
          )
      },
      {
        path: 'feedbackEmailMIS',
        loadChildren: () =>
          import('./feedbackEmailMIS/feedbackEmailMIS.module').then(
            (m) => m.FeedbackEmailMISModule
          )
      },

      {
        path: 'invoiceTemplate',
        loadChildren: () =>
          import('./invoiceTemplate/invoiceTemplate.module').then(
            (m) => m.InvoiceTemplateModule
          )
      },
      {
        path: 'cancelReservation',
        loadChildren: () =>
          import('./cancelReservation/cancelReservation.module').then(
            (m) => m.CancelReservationModule
          )
      },

      {
        path: 'showLateAllotmentMIS',
        loadChildren: () =>
          import('./showLateAllotmentMIS/showLateAllotmentMIS.module').then(
            (m) => m.ShowLateAllotmentMISModule
          )
      },

      {
        path: 'showLateDispatchMIS',
        loadChildren: () =>
          import('./showLateDispatchMIS/showLateDispatchMIS.module').then(
            (m) => m.ShowLateDispatchMISModule
          )
      },

      {
        path: 'showLateDispatchMIS',
        loadChildren: () =>
          import('./showLateDispatchMIS/showLateDispatchMIS.module').then(
            (m) => m.ShowLateDispatchMISModule
          )
      },

      {
        path: 'reservationLocationTransferLog',
        loadChildren: () =>
          import('./reservationLocationTransferLog/reservationLocationTransferLog.module').then(
            (m) => m.ReservationLocationTransferLogModule
          )
      },

      {
        path: 'supplierType',
        loadChildren: () =>
          import('./supplierType/supplierType.module').then(
            (m) => m.SupplierTypeModule
          )
      },

      {
        path: 'dutyRegister',
        loadChildren: () =>
          import('./dutyRegister/dutyRegister.module').then(
            (m) => m.DutyRegisterModule
          )
      },
      
      {
        path: 'locationGroupLocationMapping',
        loadChildren: () =>
          import('./locationGroupLocationMapping/locationGroupLocationMapping.module').then(
            (m) => m.LocationGroupLocationMappingModule
          )
      },

      {
        path: 'customerCreditCharges',
        loadChildren: () =>
          import('./customerCreditCharges/customerCreditCharges.module').then(
            (m) => m.CustomerCreditChargesModule
          )
      },

      {
        path: 'dutySlipLTRStatement',
        loadChildren: () =>
          import('./dutySlipLTRStatement/dutySlipLTRStatement.module').then(
            (m) => m.DutySlipLTRStatementModule
          )
      },
      
      {
        path: 'contractPackageTypeMapping',
        loadChildren: () =>
          import('./contractPackageTypeMapping/contractPackageTypeMapping.module').then(
            (m) => m.ContractPackageTypeMappingModule
          )
      },

      {
        path: 'employeeLocation',
        loadChildren: () =>
          import('./employeeLocation/employeeLocation.module').then(
            (m) => m.EmployeeLocationModule
          )
      },
      
      {
        path: 'garageIn',
        loadChildren: () =>
          import('./garageIn/garageIn.module').then(
            (m) => m.GarageInModule
          )
      },
      { 
        path: 'CustomerAlertMessageDetails',
        loadChildren: () =>
          import('./customerAlertMessageDetails/customerAlertMessageDetails.module').then(
            (m) => m.CustomerAlertMessageDetailsModule
          )
      },

      {
        path: 'customerInvoiceTemplate',
        loadChildren: () =>
          import('./customerInvoiceTemplate/CustomerInvoiceTemplate.module').then(
            (m) => m.CustomerInvoiceTemplateModule
          )
      },
      
 {
  path: 'dispute',
  loadChildren: () =>
    import('./dispute/dispute.module').then(
      (m) => m.DisputeModule
    )
},

{
  path: 'disputeResolution',
  loadChildren: () =>
    import('./disputeResolution/disputeResolution.module').then(
      (m) => m.DisputeResolutionModule
    )
},
{
  path: 'lifeCycleStatus',
  loadChildren: () =>
    import('./lifeCycleStatus/lifeCycleStatus.module').then(
      (m) => m.LifeCycleStatusModule
    )
},

{
  path: 'pageGroup',
  loadChildren: () =>
    import('./pageGroup/pageGroup.module').then(
      (m) => m.PageGroupModule
    )
},

{
  path: 'disputeHistory',
  loadChildren: () =>
    import('./disputeHistory/disputeHistory.module').then(
      (m) => m.DisputeHistoryModule
    )
},
{
  path: 'dutySlipImage',
  loadChildren: () =>
    import('./dutySlipImage/dutySlipImage.module').then(
      (m) => m.DutySlipImageModule
    )
},
 {
        path: 'driverRemark',
        loadChildren: () =>
          import('./driverRemark/driverRemark.module').then(
            (m) => m.DriverRemarkModule
          )
      },
      {
        path: 'driverRemarkDetails',
        loadChildren: () =>
          import('./DriverRemarkDetails/DriverRemarkDetails.module').then(
            (m) => m.DriverRemarkDetailsModule
          )
      },

      {
        path: 'feedBackDetails',
        loadChildren: () =>
          import('./feedBackDetails/feedBackDetails.module').then(
            (m) => m.FeedBackDetailsModule
          )
      },
      {
        path: 'nextDayInstruction',
        loadChildren: () =>
          import('./nextDayInstruction/nextDayInstruction.module').then(
            (m) => m.NextDayInstructionModule
          )
          
      },

     
  {
        path: 'dynamicEInvoiceDetails',
        loadChildren: () =>
          import('./DynamicEInvoiceDetails/DynamicEInvoiceDetails.module').then(
            (m) => m.DynamicEInvoiceDetailsModule
          )
      },

       {
        path: 'dynamicEInvoiceResponseDetails',
        loadChildren: () =>
          import('./DynamicEInvoiceResponseDetails/DynamicEInvoiceResponseDetails.module').then(
            (m) => m.DynamicEInvoiceResponseDetailsModule
          )
      },

      {
        path: 'nextDayInstructionDetails',
        loadChildren: () =>
          import('./NextDayInstructionDetails/NextDayInstructionDetails.module').then(
            (m) => m.NextDayInstructionDetailsModule
          )
      },
      {
        path: 'mopDetailsShow',
        loadChildren: () =>
          import('./MOPDetailsShow/mopDetailsShow.module').then(
            (m) => m.MOPDetailsModule
          )
      },
{
  path: 'dutySlipImageDetailsShow',
  loadChildren: () =>
    import('./dutySlipImageDetailsShow/dutySlipImageDetailsShow.module').then(
      (m) => m.DutySlipImageDetailsShowModule
    )
},
{
  path: 'contractPaymentMapping',
  loadChildren: () =>
    import('./contractPaymentMapping/contractPaymentMapping.module').then(
      (m) => m.ContractPaymentMappingModule
    )
},
      {
        path: 'sendSMS',
        loadChildren: () =>
          import('./sendSMS/sendSMS.module').then(
            (m) => m.SendSMSModule
          )
      },

      {
        path: 'allotCarAndDriver',
        loadChildren: () =>
          import('./allotCarAndDriver/allotCarAndDriver.module').then(
            (m) => m.AllotCarAndDriverModule
          )
      },

      {
        path: 'newForm',
        loadChildren: () =>
          import('./newForm/newForm.module').then(
            (m) => m.NewFormModule
          )
      },
      {
        path: 'feedBackAttachment',
        loadChildren: () =>
          import('./feedBackAttachment/feedBackAttachment.module').then(
            (m) => m.FeedBackAttachmentModule
          )
      },
      {
        path: 'feedBack',
        loadChildren: () =>
          import('./feedBack/feedBack.module').then(
            (m) => m.FeedBackModule
          )
      },
      
      {
        path: 'cancelAllotment',
        loadChildren: () =>
          import('./cancelAllotment/cancelAllotment.module').then(
            (m) => m.CancelAllotmentModule
          )
      },

      {
        path: 'cancelReservationAndAllotment',
        loadChildren: () =>
          import('./cancelReservationAndAllotment/cancelReservationAndAllotment.module').then(
            (m) => m.CancelReservationAndAllotmentModule
          )
      },

      {
        path: 'searchDriverByLocation',
        loadChildren: () =>
          import('./searchDriverByLocation/searchDriverByLocation.module').then(
            (m) => m.SearchDriverByLocationModule
          )
      },
      {
        path: 'cancelInvoice',
        loadChildren: () =>
          import('./cancelInvoice/cancelInvoice.module').then(
            (m) => m.CancelInvoiceModule
          )
      },

      {
        path: 'customerAlertMessageType',
        loadChildren: () =>
          import('./customerAlertMessageType/customerAlertMessageType.module').then(
            (m) => m.CustomerAlertMessageTypeModule
          )
      },

      {
        path: 'customerForSalesManager',
        loadChildren: () =>
          import('./customerForSalesManager/customerForSalesManager.module').then(
            (m) => m.CustomerForSalesManagerModule
          )
      },

      {
        path: 'transmissionType',
        loadChildren: () =>
          import('./transmissionType/transmissionType.module').then(
            (m) => m.TransmissionTypeModule
          )
      },

      {
        path: 'customerAlertMessage',
        loadChildren: () =>
          import('./customerAlertMessage/customerAlertMessage.module').then(
            (m) => m.CustomerAlertMessageModule
          )
      },

      {
        path: 'dutyInterstateTax',
        loadChildren: () =>
          import('./dutyInterstateTax/dutyInterstateTax.module').then(
            (m) => m.DutyInterstateTaxModule
          )
      },

      {
        path: 'dutyInterstateTaxApproval',
        loadChildren: () =>
          import('./dutyInterstateTaxApproval/dutyInterstateTaxApproval.module').then(
            (m) => m.DutyInterstateTaxApprovalModule
          )
      },

      {
        path: 'customerInfo',
        loadChildren: () =>
          import('./customerInfo/customerInfo.module').then(
            (m) => m.CustomerInfoModule
          )
      },
      {
        path: 'reservationClosingDetails',
        loadChildren: () =>
          import('./reservationClosingDetails/reservationClosingDetails.module').then(
            (m) => m.ReservationClosingDetailsModule
          )
      },

      {
        path: 'gstPercentage',
        loadChildren: () =>
          import('./gstPercentage/gstPercentage.module').then(
            (m) => m.GSTPercentageModule
          )
      },

      // {
      //   path: 'SingleDutySingleBillForOutstation',
      //   loadChildren: () =>
      //     import('./SingleDutySingleBillForOutstation/SingleDutySingleBillForOutstation.module').then(
      //       (m) => m.SingleDutySingleBillForOutstationModule
      //     )
      // },

      // {
      //   path: 'SingleDutySingleBillForLocal',
      //   loadChildren: () =>
      //     import('./SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.module').then(
      //       (m) => m.SingleDutySingleBillForLocalModule
      //     )
      // },

  // {
  //       path: 'gstPercentage',
  //       loadChildren: () =>
  //         import('./gstPercentage/gstPercentage.module').then(
  //           (m) => m.GSTPercentageModule
  //         )
  //     },

  {
    path: 'tollParkingType',
    loadChildren: () =>
      import('./tollParkingType/tollParkingType.module').then(
        (m) => m.TollParkingTypeModule
      )
  },
  {
    path: 'interstateTaxEntry',
    loadChildren: () =>
      import('./interstateTaxEntry/interstateTaxEntry.module').then(
        (m) => m.InterstateTaxEntryModule
      )
  },

      {
        path: 'tripFeedBack',
        loadChildren: () =>
          import('./tripFeedBack/tripFeedBack.module').then(
            (m) => m.TripFeedBackModule
          )
      },
      {
        path: 'otherDetails',
        loadChildren: () =>
          import('./otherDetails/otherDetails.module').then(
            (m) => m.OtherDetailsModule
          )
      },

      {
        path: 'passwordReset',
        loadChildren: () =>
          import('./PasswordReset/PasswordReset.module').then(
            (m) => m.PasswordResetModule
          )
      },
 {
        path: 'auditTrail',
        loadChildren: () =>
          import('./auditTrail/auditTrail.module').then(
            (m) => m.AuditTrailModule
          )
        },
      {
        path: 'reservationGroup',
        loadChildren: () =>
          import('./reservationGroup/reservationGroup.module').then(
            (m) => m.ReservationGroupModule
          )
      },

      {
        path: 'reservationGroupDetails',
        loadChildren: () =>
          import('./reservationGroupDetails/reservationGroupDetails.module').then(
            (m) => m.ReservationGroupDetailsModule
          )
      },
      
      {
        path: 'currentDuty',
        loadChildren: () =>
          import('./currentDuty/currentDuty.module').then(
            (m) => m.CurrentDutyModule
          )
      },
      {
        path: 'clossingScreen',
        loadChildren: () =>
          import('./clossingScreen/clossingScreen.module').then(
            (m) => m.ClossingScreenModule
          )
      },

      {
        path: 'dutySlipForBilling',
        loadChildren: () =>
          import('./dutySlipForBilling/dutySlipForBilling.module').then(
            (m) => m.DutySlipForBillingModule
          )
      },

      {
        path: 'closingOne',
        loadChildren: () =>
          import('./clossingOne/clossingOne.module').then(
            (m) => m.ClossingOneModule
          )
      },

      {
        path: 'reservationDetails',
        loadChildren: () =>
          import('./reservationDetails/reservationDetails.module').then(
            (m) => m.ReservationDetailsModule
          )
      },

      {
        path: 'debitType',
        loadChildren: () =>
          import('./debitType/debitType.module').then(
            (m) => m.DebitTypeModule
          )
      },

      {
        path: 'passToSupplier',
        loadChildren: () =>
          import('./passToSupplier/passToSupplier.module').then(
            (m) => m.PassToSupplierModule
          )
      },

      {
        path: 'currentDutyDetails',
        loadChildren: () =>
          import('./currentDutyDetails/currentDutyDetails.module').then(
            (m) => m.CurrentDutyDetailsModule
          )
      },

      {
        path: 'passengerDetails',
        loadChildren: () =>
          import('./passengerDetails/passengerDetails.module').then(
            (m) => m.PassengerDetailsModule
          )
      },

      {
        path: 'dutyTracking',
        loadChildren: () =>
          import('./dutyTracking/dutyTracking.module').then(
            (m) => m.DutyTrackingModule
          )
      },

      {
        path: 'customerSpecificDetails',
        loadChildren: () =>
          import('./customerSpecificDetails/customerSpecificDetails.module').then(
            (m) => m.CustomerSpecificDetailsModule
          )
      },

      {
        path: 'discountDetails',
        loadChildren: () =>
          import('./discountDetails/discountDetails.module').then(
            (m) => m.DiscountDetailsModule
          )
      },

      {
        path: 'monthlyBusinessReport',
        loadChildren: () =>
          import('./monthlyBusinessReport/monthlyBusinessReport.module').then(
            (m) => m.MonthlyBusinessReportModule
          )
      },

      {
        path: 'lumpsumRateDetails',
        loadChildren: () =>
          import('./lumpsumRateDetails/lumpsumRateDetails.module').then(
            (m) => m.LumpsumRateDetailsModule
          )
      },

      // {
      //   path: 'customerPersonInventoryRestriction',
      //   loadChildren: () =>
      //     import('./customerPersonInventoryRestriction/customerPersonInventoryRestriction.module').then(
      //       (m) => m.CustomerPersonInventoryRestrictionModule
      //     )
      // },

      {
        path: 'settledRateDetails',
        loadChildren: () =>
          import('./settledRateDetails/settledRateDetails.module').then(
            (m) => m.SettledRateDetailsModule
          )
      },

      {
        path: 'billToOtherDetails',
        loadChildren: () =>
          import('./billToOtherDetails/billToOtherDetails.module').then(
            (m) => m.BillToOtherDetailsModule
          )
      },

      {
        path: 'kamCard',
        loadChildren: () =>
          import('./kamCard/kamCard.module').then(
            (m) => m.KamCardModule
          )
      },

      {
        path: 'supplierVerificationDocuments',
        loadChildren: () =>
          import('./supplierVerificationDocuments/supplierVerificationDocuments.module').then(
            (m) => m.SupplierVerificationDocumentsModule
          )
      },

      {
        path: 'dispatchFetchData',
        loadChildren: () =>
          import('./dispatchFetchData/dispatchFetchData.module').then(
            (m) => m.DispatchFetchDataModule
          )
      },

      {
        path: 'currencyExchangeRate',
        loadChildren: () =>
          import('./currencyExchangeRate/currencyExchangeRate.module').then(
            (m) => m.CurrencyExchangeRateModule
          )
      },
      
      {
        path: 'CarAndDriverSearch',
        loadChildren: () =>
          import('./CarAndDriverSearch/CarAndDriverSearch.module').then(
            (m) => m.CarAndDriverSearchModule
          )
      },
      
      {
        path: 'passengerhistory',
        loadChildren: () =>
          import('./PassengerHistory/PassengerHistory.module').then(
            (m) => m.PassengerHistoryModule
          )
      },
      {
        path: 'ExistingBids',
        loadChildren: () =>
          import('./ExistingBids/ExistingBids.module').then(
            (m) => m.ExistingBidsModule
          )
      },
      {
        path: 'AddCarAndDriver',
        loadChildren: () =>
          import('./AddCarAndDriver/AddCarAndDriver.module').then(
            (m) => m.AddCarAndDriverModule
          )
      },
      
      {
        path: 'imageUploader',
        loadChildren: () =>
          import('./imageUploader/imageUploader.module').then(
            (m) => m.ImageUploaderModule
          )
      },
      {
        path: 'bookingScreen',
        loadChildren: () =>
          import('./bookingScreen/bookingScreen.module').then(
            (m) => m.BookingScreenModule
          )
      },
      {
        path: 'tripDetails',
        loadChildren: () =>
          import('./tripDetails/tripDetails.module').then(
            (m) => m.TripDetailsModule
          )
      },

      {
        path: 'reservation',
        loadChildren: () =>
          import('./reservation/reservation.module').then(
            (m) => m.ReservationModule
          )
      },

      {
        path: 'reservationList',
        loadChildren: () =>
          import('./reservationList/reservationList.module').then(
            (m) => m.ReservationListModule
          )
      },
      
      {
        path: 'customerSpecificFields',
        loadChildren: () =>
          import('./customerSpecificFields/customerSpecificFields.module').then(
            (m) => m.CustomerSpecificFieldsModule
          )
      },
      {
        path: 'pickUpByExecutive',
        loadChildren: () =>
          import('./pickUpByExecutive/pickUpByExecutive.module').then(
            (m) => m.PickUpByExecutiveModule
          )
      },
      {
        path: 'dropOffByExecutive',
        loadChildren: () =>
          import('./dropOffByExecutive/dropOffByExecutive.module').then(
            (m) => m.DropOffByExecutiveModule
          )
      },

      {
        path: 'otherFields',
        loadChildren: () =>
          import('./otherFields/otherFields.module').then(
            (m) => m.OtherFieldsModule
          )
      },
      {
        path: 'reservationSource',
        loadChildren: () =>
          import('./reservationSource/reservationSource.module').then(
            (m) => m.ReservationSourceModule
          )
      },
      {
        path: 'controlPanelDesign',
        loadChildren: () =>
          import('./controlPanelDesign/controlPanelDesign.module').then(
            (m) => m.ControlPanelDesignModule
          )
      },

      {
        path: 'controlPanelTemp',
        loadChildren: () =>
          import('./controlPanelTemp/controlPanelTemp.module').then(
            (m) => m.ControlPanelTempModule
          )
      },

      {
        path: 'CarAndDriverAllotmentTemp',
        loadChildren: () =>
          import('./CarAndDriverAllotmentTemp/CarAndDriverAllotmentTemp.module').then(
            (m) => m.CarAndDriverAllotmentTempModule
          )
      },

      {
        path: 'addDiscount',
        loadChildren: () =>
          import('./addDiscount/addDiscount.module').then(
            (m) => m.AddDiscountModule
          )
      },
      {
        path: 'settledRates',
        loadChildren: () =>
          import('./settledRates/settledRates.module').then(
            (m) => m.SettledRatesModule
          )
      },
      {
        path: 'billingInstruction',
        loadChildren: () =>
          import('./billingInstruction/billingInstruction.module').then(
            (m) => m.BillingInstructionModule
          )
      },

      {
        path: 'billToOther',
        loadChildren: () =>
          import('./billToOther/billToOther.module').then(
            (m) => m.BillToOtherModule
          )
      },
      {
        path: 'customerReservationFields',
        loadChildren: () =>
          import('./customerReservationFields/customerReservationFields.module').then(
            (m) => m.CustomerReservationFieldsModule
          )
      },

      {
        path: 'customerReservationFieldValues',
        loadChildren: () =>
          import('./customerReservationFieldValues/customerReservationFieldValues.module').then(
            (m) => m.CustomerReservationFieldValuesModule
          )
      },
	  
      {
        path: 'viewKAM',
        loadChildren: () =>
          import('./viewKAM/viewKAM.module').then(
            (m) => m.ViewKAMModule
          )
      },
      {
        path: 'kamDetails',
        loadChildren: () =>
          import('./kamDetails/kamDetails.module').then(
            (m) => m.KamDetailsModule
          )
      },
      {
        path: 'additionalSMSEmailWhatsapp',
        loadChildren: () =>
          import('./additionalSMSEmailWhatsapp/additionalSMSEmailWhatsapp.module').then(
            (m) => m.AdditionalSMSEmailWhatsappModule
          )
      },
      {
        path: 'addPassengers',
        loadChildren: () =>
          import('./addPassengers/addPassengers.module').then(
            (m) => m.AddPassengersModule
          )
      },
      {
        path: 'addStop',
        loadChildren: () =>
          import('./addStop/addStop.module').then(
            (m) => m.AddStopModule
          )
      },

      {
        path: 'dailyReport',
        loadChildren: () =>
          import('./dailyReport/dailyReport.module').then(
            (m) => m.DailyReportModule
          )
      },
      {
        path: 'stopsPopup',
        loadChildren: () =>
          import('./stopsPopup/stopsPopup.module').then(
            (m) => m.StopsPopupModule
          )
      },
      {
        path: 'dropOffDetails',
        loadChildren: () =>
          import('./dropOffDetails/dropOffDetails.module').then(
            (m) => m.DropOffDetailsModule
          )
      },

      {
        path: 'carMovingStatusByApp',
        loadChildren: () =>
          import('./carMovingStatusByApp/carMovingStatusByApp.module').then(
            (m) => m.CarMovingStatusByAppModule
          )
      },

      {
        path: 'appDataMissingStatus',
        loadChildren: () =>
          import('./appDataMissingStatus/appDataMissingStatus.module').then(
            (m) => m.AppDataMissingStatusModule
          )
      },

      {
        path: 'additionalKmsDetails',
        loadChildren: () =>
          import('./additionalKmsDetails/additionalKmsDetails.module').then(
            (m) => m.AdditionalKmsDetailsModule
          )
      },
      {
        path: 'pickupDetails',
        loadChildren: () =>
          import('./pickupDetails/pickupDetails.module').then(
            (m) => m.PickupDetailsModule
          )
      },
      {
        path: 'specialInstruction',
        loadChildren: () =>
          import('./specialInstruction/specialInstruction.module').then(
            (m) => m.SpecialInstructionModule
          )
      },

      {
        path: 'stopDetails',
        loadChildren: () =>
          import('./stopDetails/stopDetails.module').then(
            (m) => m.StopDetailsModule
          )
      },

      {
        path: 'advance',
        loadChildren: () =>
          import('./advance/advance.module').then(
            (m) => m.AdvanceModule
          )
      },

      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then(
            (m) => m.ProfileModule
          )
      },

      

      {
        path: 'citybasedspots',
        loadChildren: () =>
          import('./CityBasedSpots/CityBasedSpots.module').then(
            (m) => m.CityBasedSpotsModule
          )
      },

      {
        path: 'tollParkingISTImages',
        loadChildren: () =>
          import('./TollParkingISTImages/TollParkingISTImages.module').then(
            (m) => m.TollParkingISTImagesModule
          )
      },

      {
        path: 'reservationStopDetails',
        loadChildren: () =>
          import('./reservationStopDetails/reservationStopDetails.module').then(
            (m) => m.ReservationStopDetailsModule
          )
      },

       {
        path: 'reservationStopDetails',
        loadChildren: () =>
          import('./reservationStopDetails/reservationStopDetails.module').then(
            (m) => m.ReservationStopDetailsModule
          )
      },
      
      {
        path: 'dutyDetails',
        loadChildren: () =>
          import('./dutyDetails/dutyDetails.module').then(
            (m) => m.DutyDetailsModule
          )
      },

      {
        path: 'sendEmsAndEmail',
        loadChildren: () =>
          import('./sendEmsAndEmail/sendEmsAndEmail.module').then(
            (m) => m.SendEmsAndEmailModule
          )
      },
      {
        path: 'tripFilter',
        loadChildren: () =>
          import('./tripFilter/tripFilter.module').then(
            (m) => m.TripFilterModule
          )
      },
      {
        path: 'CarAndDriverActions',
        loadChildren: () =>
          import('./CarAndDriverActions/CarAndDriverActions.module').then(
            (m) => m.CarAndDriverActionsModule
          )
      },
      {
        path: 'CarAndDriverAllotment',
        loadChildren: () =>
          import('./CarAndDriverAllotment/CarAndDriverAllotment.module').then(
            (m) => m.CarAndDriverAllotmentModule
          )
      },
      {
        path: 'AttachAnotherCar',
        loadChildren: () =>
          import('./AttachAnotherCar/AttachAnotherCar.module').then(
            (m) => m.AttachAnotherCarModule
          )
      },
      {
        path: 'AttachAnotherDriver',
        loadChildren: () =>
          import('./AttachAnotherDriver/AttachAnotherDriver.module').then(
            (m) => m.AttachAnotherDriverModule
          )
      },
      {
        path: 'DriverFeedbackInfo',
        loadChildren: () =>
          import('./DriverFeedbackInfo/DriverFeedbackInfo.module').then(
            (m) => m.DriverFeedbackInfoModule
          )
      },
      {
        path: 'bookerinfo',
        loadChildren: () =>
          import('./BookerInfo/BookerInfo.module').then(
            (m) => m.BookerInfoModule
          )
      },
      {
        path: 'emailInfo',
        loadChildren: () =>
          import('./EmailInfo/EmailInfo.module').then(
            (m) => m.EmailInfoModule
          )
      },
      {
        path: 'vehiclecategoryinfo',
        loadChildren: () =>
          import('./VehicleCategoryInfo/VehicleCategoryInfo.module').then(
            (m) => m.VehicleCategoryInfoModule
          )
      },
      {
        path: 'vehicleinfo',
        loadChildren: () =>
          import('./VehicleInfo/VehicleInfo.module').then(
            (m) => m.VehicleInfoModule
          )
      },  
      {
        path: 'packageinfo',
        loadChildren: () =>
          import('./PackageInfo/PackageInfo.module').then(
            (m) => m.PackageInfoModule
          )
      },

      {
        path: 'salesPerson',
        loadChildren: () =>
          import('./salesPerson/salesPerson.module').then(
            (m) => m.SalesPersonModule
          )
      },

      {
        path: 'passengerinfo',
        loadChildren: () =>
          import('./PassengerInfo/PassengerInfo.module').then(
            (m) => m.PassengerInfoModule
          )
      },

      {
        path: 'allotmentStatusDetails',
        loadChildren: () =>
          import('./AllotmentStatusDetails/AllotmentStatusDetails.module').then(
            (m) => m.AllotmentStatusDetailsModule
          )
      },

      {
        path: 'dutySlipQualityCheckDetails',
        loadChildren: () =>
          import('./DutySlipQualityCheckDetails/DutySlipQualityCheckDetails.module').then(
            (m) => m.DutySlipQualityCheckDetailsModule
          )
      },

      {
        path: 'garageOutDetails',
        loadChildren: () =>
          import('./GarageOutDetails/GarageOutDetails.module').then(
            (m) => m.GarageOutDetailsModule
          )
      },

      {
        path: 'reachedByExecutiveDetails',
        loadChildren: () =>
          import('./ReachedByExecutiveDetails/ReachedByExecutiveDetails.module').then(
            (m) => m.ReachedByExecutiveDetailsModule
          )
      },

      {
        path: 'pickUpDetailShow',
        loadChildren: () =>
          import('./pickUpDetailShow/pickUpDetailShow.module').then(
            (m) => m.PickUpDetailShowModule
          )
      },
    
      {
        path: 'locationInDetailShow',
        loadChildren: () =>
          import('./locationInDetailShow/locationInDetailShow.module').then(
            (m) => m.LocationInDetailShowShowModule
          )
      },
    
      {
        path: 'dropOffDetailShow',
        loadChildren: () =>
          import('./dropOffDetailShow/dropOffDetailShow.module').then(
            (m) => m.DropOffDetailShowModule
          )
      },
    
      {
        path: 'dutySlipQualityCheckedByExecutiveDetails',
        loadChildren: () =>
          import('./DutySlipQualityCheckedByExecutiveDetails/DutySlipQualityCheckedByExecutiveDetails.module').then(
            (m) => m.DutySlipQualityCheckedByExecutiveDetailsModule
          )
      },

      {
        path: 'stopDetailsShow',
        loadChildren: () =>
          import('./stopDetailsShow/stopDetailsShow.module').then(
            (m) => m.StopDetailsShowModule
          )
      },
      {
        path: 'specialinstructioninfo',
        loadChildren: () =>
          import('./SpecialInstructionInfo/SpecialInstructionInfo.module').then(
            (m) => m.SpecialInstructionInfoModule
          )
      },

      {
        path: 'timeandaddressinfo',
        loadChildren: () =>
          import('./TimeAndAddressInfo/TimeAndAddressInfo.module').then(
            (m) => m.TimeAndAddressInfoModule
          )
      },

      {
        path: 'stopdetailsinfo',
        loadChildren: () =>
          import('./StopDetailsInfo/StopDetailsInfo.module').then(
            (m) => m.StopDetailsInfoModule
          )
      },
      {
        path: 'stoponmapinfo',
        loadChildren: () =>
          import('./StopOnMapInfo/StopOnMapInfo.module').then(
            (m) => m.StopOnMapInfoModule
          )
      },
      {
        path: 'vendorassignment',
        loadChildren: () =>
          import('./VendorAssignment/VendorAssignment.module').then(
            (m) => m.VendorAssignmentModule
          )
      },

      {
        path: 'vendorinfo',
        loadChildren: () =>
          import('./VendorInfo/VendorInfo.module').then(
            (m) => m.VendorInfoModule
          )
      },

      {
        path: 'vehicleassignment',
        loadChildren: () =>
          import('./VehicleAssignment/VehicleAssignment.module').then(
            (m) => m.VehicleAssignmentModule
          )
      },
      {
        path: 'otherFilter',
        loadChildren: () =>
          import('./otherFilter/otherFilter.module').then(
            (m) => m.OtherFilterModule
          )
      },

      {
        path: 'customerPersonDrivingLicenseVerification',
        loadChildren: () =>
          import('./customerPersonDrivingLicenseVerification/customerPersonDrivingLicenseVerification.module').then(
            (m) => m.CustomerPersonDrivingLicenseVerificationModule
          )
      },
      {
        path: 'customerPersonDocument',
        loadChildren: () =>
          import('./customerPersonDocument/customerPersonDocument.module').then(
            (m) => m.CustomerPersonDocumentModule
          )
      },
      {
        path: 'customerPersonDocumentVerification',
        loadChildren: () =>
          import('./customerPersonDocumentVerification/customerPersonDocumentVerification.module').then(
            (m) => m.CustomerPersonDocumentVerificationModule
          )
      },
      {
        path: 'supplierVerificationStatusHistory',
        loadChildren: () =>
          import('./supplierVerificationStatusHistory/supplierVerificationStatusHistory.module').then(
            (m) => m.SupplierVerificationStatusHistoryModule
          )
      },
      {
        path: 'cityGroup',
        loadChildren: () =>
          import('./cityGroup/cityGroup.module').then(
            (m) => m.CityGroupModule
          )
      },
      {
        path: 'country',
        loadChildren: () =>
          import('./country/country.module').then(
            (m) => m.CountryModule
          )
      },

      {
        path: 'department',
        loadChildren: () =>
          import('./department/department.module').then(
            (m) => m.DepartmentModule
          )
      },
      {
        path: 'dateWiseCarwiseBookingReport',
        loadChildren: () =>
          import('./dateWiseCarwiseBookingReport/dateWiseCarwiseBookingReport.module').then(
            (m) => m.DateWiseCarwiseBookingReportModule
          )
      },
      {
        path: 'customerConfigurationMessaging',
        loadChildren: () =>
          import('./customerConfigurationMessaging/customerConfigurationMessaging.module').then(
            (m) => m.CustomerConfigurationMessagingModule
          )
      },
      {
        path: 'customerConfigurationInvoicing',
        loadChildren: () =>
          import('./customerConfigurationInvoicing/customerConfigurationInvoicing.module').then(
            (m) => m.CustomerConfigurationInvoicingModule
          )
      },
      {
        path: 'customerKeyAccountManager',
        loadChildren: () =>
          import('./customerKeyAccountManager/customerKeyAccountManager.module').then(
            (m) => m.CustomerKeyAccountManagerModule
          )
      },
      {
        path: 'customerBillingExecutive',
        loadChildren: () =>
          import('./customerBillingExecutive/customerBillingExecutive.module').then(
            (m) => m.CustomerBillingExecutiveModule
          )
      },
      {
        path: 'customerReservationExecutive',
        loadChildren: () =>
          import('./customerReservationExecutive/customerReservationExecutive.module').then(
            (m) => m.CustomerReservationExecutiveModule
          )
      },
      {
        path: 'customerSalesManager',
        loadChildren: () =>
          import('./customerSalesManager/customerSalesManager.module').then(
            (m) => m.CustomerSalesManagerModule
          )
      },
      {
        path: 'customerCollectionExecutive',
        loadChildren: () =>
          import('./customerCollectionExecutive/customerCollectionExecutive.module').then(
            (m) => m.CustomerCollectionExecutiveModule
          )
      },
      {
        path: 'customerCredit',
        loadChildren: () =>
          import('./customerCredit/customerCredit.module').then(
            (m) => m.CustomerCreditModule
          )
      },

      // {
      //   path: 'savedAddress',
      //   loadChildren: () =>
      //     import('./savedAddress/savedAddress.module').then(
      //       (m) => m.SavedAddressModule
      //     )
      // },
      {
        path: 'customerShort',
        loadChildren: () =>
          import('./customerShort/customerShort.module').then(
            (m) => m.CustomerShortModule
          )
      },

      {
        path: 'personShort',
        loadChildren: () =>
          import('./personShort/personShort.module').then(
            (m) => m.PersonShortModule
          )
      },

      {
        path: 'cdcLocalOnDemandRate',
        loadChildren: () =>
          import('./cdcLocalOnDemandRate/cdcLocalOnDemandRate.module').then(
            (m) => m.CDCLocalOnDemandRateModule
          )
      },

      {
        path: 'customerServiceExecutive',
        loadChildren: () =>
          import('./customerServiceExecutive/customerServiceExecutive.module').then(
            (m) => m.CustomerServiceExecutiveModule
          )
      },
      {
        path: 'customerPersonInstruction',
        loadChildren: () =>
          import('./customerPersonInstruction/customerPersonInstruction.module').then(
            (m) => m.CustomerPersonInstructionModule
          )
      },
      {
        path: 'stopReservation',
        loadChildren: () =>
          import('./stopReservation/stopReservation.module').then(
            (m) => m.StopReservationModule
          )
      },

      {
        path: 'cdcLongTermRentalRate',
        loadChildren: () =>
          import('./cdcLongTermRentalRate/cdcLongTermRentalRate.module').then(
            (m) => m.CDCLongTermRentalRateModule
          )
      },
      {
        path: 'cdcOutStationOneWayTripRate',
        loadChildren: () =>
          import('./cdcOutStationOneWayTripRate/cdcOutStationOneWayTripRate.module').then(
            (m) => m.CDCOutStationOneWayTripRateModule
          )
      },

      {
        path: 'customerContractMapping',
        loadChildren: () =>
          import('./customerContractMapping/customerContractMapping.module').then(
            (m) => m.CustomerContractMappingModule
          )
      },
      {
        path: 'country',
        loadChildren: () =>
          import('./country/country.module').then(
            (m) => m.CountryModule
          )
      },

      {
        path: 'supplier',
        loadChildren: () =>
          import('./supplier/supplier.module').then(
            (m) => m.SupplierModule
          )
      },

      {
        path: 'supplierActivationStatusHistory',
        loadChildren: () =>
          import('./supplierActivationStatusHistory/supplierActivationStatusHistory.module').then(
            (m) => m.SupplierActivationStatusHistoryModule
          )
      },

      {
        path: 'designation',
        loadChildren: () =>
          import('./designation/designation.module').then(
            (m) => m.DesignationModule
          )
      },

      {
        path: 'qualification',
        loadChildren: () =>
          import('./qualification/qualification.module').then(
            (m) => m.QualificationModule
          )
      },

      {
        path: 'inventoryBlock',
        loadChildren: () =>
          import('./inventoryBlock/inventoryBlock.module').then(
            (m) => m.InventoryBlockModule
          )
      },
      {
        path: 'inventoryFitness',
        loadChildren: () =>
          import('./inventoryFitness/inventoryFitness.module').then(
            (m) => m.InventoryFitnessModule
          )
      },

      {
        path: 'customerContract',
        loadChildren: () =>
          import('./customerContract/customerContract.module').then(
            (m) => m.CustomerContractModule
          )
      },

      {
        path: 'customerConfigurationBilling',
        loadChildren: () =>
          import('./customerConfigurationBilling/customerConfigurationBilling.module').then(
            (m) => m.CustomerConfigurationBillingModule
          )
      },

      {
        path: 'customerConfigurationReservation',
        loadChildren: () =>
          import('./customerConfigurationReservation/customerConfigurationReservation.module').then(
            (m) => m.CustomerConfigurationReservationModule
          )
      },

      {
        path: 'customerConfigurationSupplier',
        loadChildren: () =>
          import('./customerConfigurationSupplier/customerConfigurationSupplier.module').then(
            (m) => m.CustomerConfigurationSupplierModule
          )
      },

      {
        path: 'customerAddress',
        loadChildren: () =>
          import('./customerAddress/customerAddress.module').then(
            (m) => m.CustomerAddressModule
          )
      },

      {
        path: 'customerBlocking',
        loadChildren: () =>
          import('./customerBlocking/customerBlocking.module').then(
            (m) => m.CustomerBlockingModule
          )
      },

      {
        path: 'inventoryPUC',
        loadChildren: () =>
          import('./inventoryPUC/inventoryPUC.module').then(
            (m) => m.InventoryPUCModule
          )
      },

      {
        path: 'vehicleCategory',
        loadChildren: () =>
          import('./vehicleCategory/vehicleCategory.module').then(
            (m) => m.VehicleCategoryModule
          )
      },
      {
        path: 'spotInCity',
        loadChildren: () =>
          import('./spotInCity/spotInCity.module').then(
            (m) => m.SpotInCityModule
          )
      },
      {
        path: 'serviceType',
        loadChildren: () =>
          import('./serviceType/serviceType.module').then(
            (m) => m.ServiceTypeModule
          )
      },
      {
        path: 'state',
        loadChildren: () =>
          import('./state/state.module').then(
            (m) => m.StateModule
          )
      },

      {
        path: 'test',
        loadChildren: () =>
          import('./test/test.module').then(
            (m) => m.TestModule
          )
      },

      {
        path: 'uom',
        loadChildren: () =>
          import('./uom/uom.module').then(
            (m) => m.UomModule
          )
      },

      {
        path: 'package',
        loadChildren: () =>
          import('./package/package.module').then(
            (m) => m.PackageModule
          )
      },

      {
        path: 'packageType',
        loadChildren: () =>
          import('./packageType/packageType.module').then(
            (m) => m.PackageTypeModule
          )
      },

      {
        path: 'customerPerson',
        loadChildren: () =>
          import('./customerPerson/customerPerson.module').then(
            (m) => m.CustomerPersonModule
          )
      },

      {
        path: 'reservationAlert',
        loadChildren: () =>
          import('./reservationAlert/reservationAlert.module').then(
            (m) => m.ReservationAlertModule
          )
      },

      {
        path: 'customerPersonDriverRestriction',
        loadChildren: () =>
          import('./customerPersonDriverRestriction/customerPersonDriverRestriction.module').then(
            (m) => m.CustomerPersonDriverRestrictionModule
          )
      },
      {
        path: 'customerPersonInventoryRestriction',
        loadChildren: () =>
          import('./customerPersonInventoryRestriction/customerPersonInventoryRestriction.module').then(
            (m) => m.CustomerPersonInventoryRestrictionModule
          )
      },

      {
        path: 'customerIntegrationMapping',
        loadChildren: () =>
          import('./customerIntegrationMapping/customerIntegrationMapping.module').then(
            (m) => m.CustomerIntegrationMappingModule
          )
      },

      {
        path: 'customerFuelSurcharge',
        loadChildren: () =>
          import('./customerFuelSurcharge/customerFuelSurcharge.module').then(
            (m) => m.CustomerFuelSurchargeModule
          )
      },

      {
        path: 'customerPersonTempVIP',
        loadChildren: () =>
          import('./customerPersonTempVIP/customerPersonTempVIP.module').then(
            (m) => m.CustomerPersonTempVIPModule
          )
      },
       {
        path: 'changeKamForCustomers',
        loadChildren: () =>
          import('./changeKamForCustomers/changeKamForCustomers.module').then(
            (m) => m.ChangeKamForCustomersModule
          )
      },
       {
        path: 'changeSaleForCustomers',
        loadChildren: () =>
          import('./changeSaleForCustomers/changeSaleForCustomers.module').then(
            (m) => m.ChangeSaleForCustomersModule
          )
      },

 {
        path: 'sdUnLimitedRate',
        loadChildren: () =>
          import('./sdUnLimitedRate/sdUnLimitedRate.module').then(
            (m) => m.SDUnLimitedRateModule
          )
      },
      // {
      //   path: 'self-drive-unlimited-rates',
      //   loadChildren: () =>
      //     import('./self-drive-unlimited-rates/self-drive-unlimited-rates.module').then(
      //       (m) => m.SelfDriveUnlimitedRatesModule
      //     )
      // },

      {
        path: 'page',
        loadChildren: () =>
          import('./page/page.module').then((m) => m.PageModule)
      },

      {
        path: 'role',
        loadChildren: () =>
          import('./role/role.module').then((m) => m.RoleModule)
      },

      {
        path: 'rolePageMapping/:RoleID/:Role',
        loadChildren: () =>
          import('./rolePageMapping/rolePageMapping.module').then(
            (m) => m.RolePageMappingModule
          )
      },

      {
        path: 'customerPersonPreferedDriver',
        loadChildren: () =>
          import('./customerPersonPreferedDriver/customerPersonPreferedDriver.module').then(
            (m) => m.CustomerPersonPreferedDriverModule
          )
      },

      {
        path: 'customerPersonAlertMessages',
        loadChildren: () =>
          import('./customerPersonAlertMessages/customerPersonAlertMessages.module').then(
            (m) => m.CustomerPersonAlertMessagesModule
          )
      },

      {
        path: 'driverGrade',
        loadChildren: () =>
          import('./driverGrade/driverGrade.module').then(
            (m) => m.DriverGradeModule
          )
      },

      {
        path: 'driverReward',
        loadChildren: () =>
          import('./driverReward/driverReward.module').then(
            (m) => m.DriverRewardModule
          )
      },

      {
        path: 'customerContractCDCLocalRate',
        loadChildren: () =>
          import('./customerContractCDCLocalRate/customerContractCDCLocalRate.module').then(
            (m) => m.CustomerContractCDCLocalRateModule
          )
      },

      {
        path: 'cdcLocalLumpsumRate',
        loadChildren: () =>
          import('./cdcLocalLumpsumRate/cdcLocalLumpsumRate.module').then(
            (m) => m.CDCLocalLumpsumRateModule
          )
      },

      {
        path: 'cdcOutStationRoundTripRate',
        loadChildren: () =>
          import('./cdcOutStationRoundTripRate/cdcOutStationRoundTripRate.module').then(
            (m) => m.CDCOutStationRoundTripRateModule
          )
      },

      {
        path: 'cdcOutStationLumpsumRate',
        loadChildren: () =>
          import('./cdcOutStationLumpsumRate/cdcOutStationLumpsumRate.module').then(
            (m) => m.CDCOutStationLumpsumRateModule
          )
      },

      {
        path: 'customerDiscount',
        loadChildren: () =>
          import('./customerDiscount/customerDiscount.module').then(
            (m) => m.CustomerDiscountModule
          )
      },

      {
        path: 'acrisCode',
        loadChildren: () =>
          import('./acrisCode/acrisCode.module').then(
            (m) => m.AcrisCodeModule
          )
      },

      {
        path: 'salutation',
        loadChildren: () =>
          import('./salutation/salutation.module').then(
            (m) => m.SalutationModule
          )
      },

      {
        path: 'additionalService',
        loadChildren: () =>
          import('./additionalService/additionalService.module').then(
            (m) => m.AdditionalServiceModule
          )
      },

       {
        path: 'changeEntity',
        loadChildren: () =>
          import('./changeEntity/changeEntity.module').then(
            (m) => m.ChangeEntityModule
          )
      },

      {
        path: 'additionalServiceRate',
        loadChildren: () =>
          import('./additionalServiceRate/additionalServiceRate.module').then(
            (m) => m.AdditionalServiceRateModule
          )
      },

      {
        path: 'amenitie',
        loadChildren: () =>
          import('./amenitie/amenitie.module').then(
            (m) => m.AmenitieModule
          )
      },
      {
        path: 'appDutyMIS',
        loadChildren: () =>
          import('./appDutyMIS/appDutyMIS.module').then(
            (m) => m.AppDutyMISModule
          )
      },

 {
        path: 'dutyPostPickUPCall',
        loadChildren: () =>
          import('./dutyPostPickUPCall/dutyPostPickUPCall.module').then(
            (m) => m.DutyPostPickUPCallModule
          )
      },

      {
        path: 'bank',
        loadChildren: () =>
          import('./bank/bank.module').then(
            (m) => m.BankModule
          )
      },

      {
        path: 'businessType',
        loadChildren: () =>
          import('./businessType/businessType.module').then(
            (m) => m.BusinessTypeModule
          )
      },

      {
        path: 'card',
        loadChildren: () =>
          import('./card/card.module').then(
            (m) => m.CardModule
          )
      },

      {
        path: 'carPaidTaxMIS',
        loadChildren: () =>
          import('./carPaidTaxMIS/carPaidTaxMIS.module').then(
            (m) => m.CarPaidTaxMISModule
          )
      },
      {
        path: 'carMasterMIS',
        loadChildren: () =>
          import('./carMasterMIS/carMasterMIS.module').then(
            (m) => m.CarMasterMISModule
          )
      },

      {
        path: 'driverCarSupplierMIS',
        loadChildren: () =>
          import('./driverCarSupplierMIS/driverCarSupplierMIS.module').then(
            (m) => m.DriverCarSupplierMISModule
          )
      },

      {
        path: 'driverCarWithoutDutyMIS',
        loadChildren: () =>
          import('./driverCarWithoutDutyMIS/driverCarWithoutDutyMIS.module').then(
            (m) => m.DriverCarWithoutDutyMISModule
          )
      },

      // {
      //   path: 'carUtilizationMIS',
      //   loadChildren: () =>
      //     import('./carUtilizationMIS/carUtilizationMIS.module').then(
      //       (m) => m.CarUtilizationMISModule
      //     )
      // },
      {
        path: 'carUtilizationMIS',
        loadChildren: () =>
          import('./carUtilizationMIS/carUtilizationMIS.module').then(
            (m) => m.CarUtilizationMISModule
          )
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./customer/customer.module').then(
            (m) => m.CustomerModule
          )
      },

      {
        path: 'customerContactPerson',
        loadChildren: () =>
          import('./customerContactPerson/customerContactPerson.module').then(
            (m) => m.CustomerContactPersonModule
          )
      },

      {
        path: 'customerContractCityTiers',
        loadChildren: () =>
          import('./customerContractCityTiers/customerContractCityTiers.module').then(
            (m) => m.CustomerContractCityTiersModule
          )
      },

      {
        path: 'customerContractCityTiersCityMapping',
        loadChildren: () =>
          import('./customerContractCityTiersCityMapping/customerContractCityTiersCityMapping.module').then(
            (m) => m.CustomerContractCityTiersCityMappingModule
          )
      },

      {
        path: 'customerDepartment',
        loadChildren: () =>
          import('./customerDepartment/customerDepartment.module').then(
            (m) => m.CustomerDepartmentModule
          )
      },

      {
        path: 'cardType',
        loadChildren: () =>
          import('./cardType/cardType.module').then(
            (m) => m.CardTypeModule
          )
      },

      {
        path: 'color',
        loadChildren: () =>
          import('./color/color.module').then(
            (m) => m.ColorModule
          )
      },

      {
        path: 'cityTier',
        loadChildren: () =>
          import('./cityTier/cityTier.module').then(
            (m) => m.CityTierModule
          )
      },

      {
        path: 'customerConfigurationSEZ',
        loadChildren: () =>
          import('./customerConfigurationSEZ/customerConfigurationSEZ.module').then(
            (m) => m.CustomerConfigurationSEZModule
          )
      },

      {
        path: 'customerCarAndDriverDetailsSMSEMail',
        loadChildren: () =>
          import('./customerCarAndDriverDetailsSMSEMail/customerCarAndDriverDetailsSMSEMail.module').then(
            (m) => m.CustomerCarAndDriverDetailsSMSEMailModule
          )
      },
      {
        path: 'customerGroupSBTDomain',
        loadChildren: () =>
          import('./customerGroupSBTDomain/customerGroupSBTDomain.module').then(
            (m) => m.CustomerGroupSBTDomainModule
          )
      },

       {
        path: 'customerDecimalValuesOnInvoice',
        loadChildren: () =>
          import('./customerDecimalValuesOnInvoice/customerDecimalValuesOnInvoice.module').then(
            (m) => m.CustomerDecimalValuesOnInvoiceModule
          )
      },
      {
        path: 'customerDecimalValuesOnInvoice',
        loadChildren: () =>
          import('./customerDecimalValuesOnInvoice/customerDecimalValuesOnInvoice.module').then(
            (m) => m.CustomerDecimalValuesOnInvoiceModule
          )
      },
        {
        path: 'customerOTPConfiguration',
        loadChildren: () =>
          import('./customerOTPConfiguration/customerOTPConfiguration.module').then(
            (m) => m.CustomerOTPConfigurationModule
          )
      },
      {
        path: 'customerReservationAlert',
        loadChildren: () =>
          import('./customerReservationAlert/customerReservationAlert.module').then(
            (m) => m.CustomerReservationAlertModule
          )
      },

      {
        path: 'customerDesignation',
        loadChildren: () =>
          import('./customerDesignation/customerDesignation.module').then(
            (m) => m.CustomerDesignationModule
          )
      },
      {
        path: 'customerCategoryMapping',
        loadChildren: () =>
          import('./customerCategoryMapping/customerCategoryMapping.module').then(
            (m) => m.CustomerCategoryMappingModule
          )
      },

      {
        path: 'customerPaymentTermsCode',
        loadChildren: () =>
          import('./customerPaymentTermsCode/customerPaymentTermsCode.module').then(
            (m) => m.CustomerPaymentTermsCodeModule
          )
      },
      {
        path: 'customerGrowthPerson',
        loadChildren: () =>
          import('./customerGrowthPerson/customerGrowthPerson.module').then(
            (m) => m.CustomerGrowthPersonModule
          )
      },
      {
        path: 'driverMIS',
        loadChildren: () =>
          import('./driverMIS/driverMIS.module').then(
            (m) => m.DriverMISModule
          )
      },

      {
        path: 'dutyAllotmentStatusSearch',
        loadChildren: () =>
          import('./dutyAllotmentStatusSearch/dutyAllotmentStatusSearch.module').then(
            (m) => m.DutyAllotmentStatusSearchModule
          )
      },

      {
        path: 'driverDocument',
        loadChildren: () =>
          import('./driverDocument/driverDocument.module').then(
            (m) => m.DriverDocumentModule
          )
      },

      {
        path: 'driverDocumentVerification',
        loadChildren: () =>
          import('./driverDocumentVerification/driverDocumentVerification.module').then(
            (m) => m.DriverDocumentVerificationModule
          )
      },

      {
        path: 'fuelType',
        loadChildren: () =>
          import('./fuelType/fuelType.module').then(
            (m) => m.FuelTypeModule
          )
      },

      {
        path: 'supplierRateCardSupplierMapping',
        loadChildren: () =>
          import('./supplierRateCardSupplierMapping/supplierRateCardSupplierMapping.module').then(
            (m) => m.SupplierRateCardSupplierMappingModule
          )
      },

      {
        path: 'supplierContractCDCOutStationRoundTrip',
        loadChildren: () =>
          import('./supplierContractCDCOutStationRoundTrip/supplierContractCDCOutStationRoundTrip.module').then(
            (m) => m.SupplierContractCDCOutStationRoundTripModule
          )
      },

      {
        path: 'supplierContractCDCLocalLumpsum',
        loadChildren: () =>
          import('./supplierContractCDCLocalLumpsum/supplierContractCDCLocalLumpsum.module').then(
            (m) => m.SupplierContractCDCLocalLumpsumModule
          )
      },

      {
        path: 'supplierContractSDCSelfDriveLimited',
        loadChildren: () =>
          import('./supplierContractSDCSelfDriveLimited/supplierContractSDCSelfDriveLimited.module').then(
            (m) => m.SupplierContractSDCSelfDriveLimitedModule
          )
      },

      {
        path: 'supplierContractSDCSelfDriveUnLimited',
        loadChildren: () =>
          import('./supplierContractSDCSelfDriveUnLimited/supplierContractSDCSelfDriveUnLimited.module').then(
            (m) => m.SupplierContractSDCSelfDriveUnLimitedModule
          )
      },

      {
        path: 'cardProcessingCharge',
        loadChildren: () =>
          import('./cardProcessingCharge/cardProcessingCharge.module').then(
            (m) => m.CardProcessingChargeModule
          )
      },
      {
        path: 'customerContractCarCategory',
        loadChildren: () =>
          import('./customerContractCarCategory/customerContractCarCategory.module').then(
            (m) => m.CustomerContractCarCategoryModule
          )
      },

      {
        path: 'sdlimitedRate',
        loadChildren: () =>
          import('./sdlimitedRate/sdlimitedRate.module').then(
            (m) => m.SDLimitedRateModule
          )
      },

      {
        path: 'cdcLocalTransferRate',
        loadChildren: () =>
          import('./cdcLocalTransferRate/cdcLocalTransferRate.module').then(
            (m) => m.CDCLocalTransferRateModule
          )
      },

      {
        path: 'customerContractCarCategoriesCarMapping',
        loadChildren: () =>
          import('./customerContractCarCategoriesCarMapping/customerContractCarCategoriesCarMapping.module').then(
            (m) => m.CustomerContractCarCategoriesCarMappingModule
          )
      },

      {
        path: 'lut',
        loadChildren: () =>
          import('./lut/lut.module').then(
            (m) => m.LutModule
          )
      },
      {
        path: 'locationGroup',
        loadChildren: () =>
          import('./locationGroup/locationGroup.module').then(
            (m) => m.LocationGroupModule
          )
      },

      {
        path: 'messageType',
        loadChildren: () =>
          import('./messageType/messageType.module').then(
            (m) => m.MessageTypeModule
          )
      },

      {
        path: 'bankBranch',
        loadChildren: () =>
          import('./bankBranch/bankBranch.module').then(
            (m) => m.BankBranchModule
          )
      },

      {
        path: 'paymentNetwork',
        loadChildren: () =>
          import('./paymentNetwork/paymentNetwork.module').then(
            (m) => m.PaymentNetworkModule
          )
      },

       {
        path: 'invoiceHome',
        loadChildren: () =>
          import('./invoiceHome/invoiceHome.module').then(
            (m) => m.InvoiceHomeModule
          )
      },

      {
        path: 'supplierCityMapping',
        loadChildren: () =>
          import('./supplierCityMapping/supplierCityMapping.module').then(
            (m) => m.SupplierCityMappingModule
          )
      },

      {
        path: 'supplierContractVehiclePercentage',
        loadChildren: () =>
          import('./supplierContractVehiclePercentage/supplierContractVehiclePercentage.module').then(
            (m) => m.SupplierContractVehiclePercentageModule
          )
      },
      {
        path: 'customerAllowedCarsInCDP',
        loadChildren: () =>
          import('./customerAllowedCarsInCDP/customerAllowedCarsInCDP.module').then(
            (m) => m.CustomerAllowedCarsInCDPModule
          )
      },
       {
        path: 'customerAllowedPackageTypesInCDP',
        loadChildren: () =>
          import('./customerAllowedPackageTypesInCDP/customerAllowedPackageTypesInCDP.module').then(
            (m) => m.CustomerAllowedPackageTypesInCDPModule
          )
      },
      {
        path: 'customerPersonApprover',
        loadChildren: () =>
          import('./customerPersonApprover/customerPersonApprover.module').then(
            (m) => m.CustomerPersonApproverModule
          )
      },
      {
        path: 'supplierContractCustomerVehiclePercentage',
        loadChildren: () =>
          import('./supplierContractCustomerVehiclePercentage/supplierContractCustomerVehiclePercentage.module').then(
            (m) => m.SupplierContractCustomerVehiclePercentageModule
          )
      },
      {
        path: 'supplierRateCard',
        loadChildren: () =>
          import('./supplierRateCard/supplierRateCard.module').then(
            (m) => m.SupplierRateCardModule
          )
      },
      {
        path: 'supplierContractCustomerPackageTypePercentage',
        loadChildren: () =>
          import('./supplierContractCustomerPackageTypePercentage/supplierContractCustomerPackageTypePercentage.module').then(
            (m) => m.SupplierContractCustomerPackageTypePercentageModule
          )
      },
      {
        path: 'supplierContractPackageTypePercentage',
        loadChildren: () =>
          import('./supplierContractPackageTypePercentage/supplierContractPackageTypePercentage.module').then(
            (m) => m.SupplierContractPackageTypePercentageModule
          )
      },

      {
        path: 'supplierContractCustomerCityPercentage',
        loadChildren: () =>
          import('./supplierContractCustomerCityPercentage/supplierContractCustomerCityPercentage.module').then(
            (m) => m.SupplierContractCustomerCityPercentageModule
          )
      },

      {
        path: 'mailSupplier',
        loadChildren: () =>
          import('./mailSupplier/mailSupplier.module').then(
            (m) => m.MailSupplierModule
          )
      },

      {
        path: 'paymentCycle',
        loadChildren: () =>
          import('./paymentCycle/paymentCycle.module').then(
            (m) => m.PaymentCycleModule
          )
      },

      {
        path: 'modeOfPayment',
        loadChildren: () =>
          import('./modeOfPayment/modeOfPayment.module').then(
            (m) => m.ModeOfPaymentModule
          )
      },
      {
        path: 'allotmentLogDetails',
        loadChildren: () =>
          import('./allotmentLogDetails/allotmentLogDetails.module').then(
            (m) => m.AllotmentLogDetailsModule
          )
      },
       {
        path: 'changeDutyTypeClosing',
        loadChildren: () =>
          import('./changeDutyTypeClosing/changeDutyTypeClosing.module').then(
            (m) => m.ChangeDutyTypeClosingModule
          )
      },

      {
        path: 'supplierContractPercentage',
        loadChildren: () =>
          import('./supplierContractPercentage/supplierContractPercentage.module').then(
            (m) => m.SupplierContractPercentageModule
          )
      },
      {
        path: 'supplierContractCityPercentage',
        loadChildren: () =>
          import('./supplierContractCityPercentage/supplierContractCityPercentage.module').then(
            (m) => m.SupplierContractCityPercentageModule
          )
      },

      {
        path: 'supplierContract',
        loadChildren: () =>
          import('./supplierContract/supplierContract.module').then(
            (m) => m.SupplierContractModule
          )
      },

      {
        path: 'reservationMessaging',
        loadChildren: () =>
          import('./reservationMessaging/reservationMessaging.module').then(
            (m) => m.ReservationMessagingModule
          )
      },

      {
        path: 'supplierCustomerFixedForAllPercentage',
        loadChildren: () =>
          import('./supplierCustomerFixedForAllPercentage/supplierCustomerFixedForAllPercentage.module').then(
            (m) => m.SupplierCustomerFixedForAllPercentageModule
          )
      },

      {
        path: 'dutyTollParkingEntry',
        loadChildren: () =>
          import('./dutyTollParkingEntry/dutyTollParkingEntry.module').then(
            (m) => m.DutyTollParkingEntryModule
          )
      },

      {
        path: 'currency',
        loadChildren: () =>
          import('./currency/currency.module').then(
            (m) => m.CurrencyModule
          )
      },

      {
        path: 'clientWiseReport',
        loadChildren: () =>
          import('./clientWiseReport/clientWiseReport.module').then(
            (m) => m.ClientWiseReportModule
          )
      },

      {
        path: 'driverCarChangesMIS',
        loadChildren: () =>
          import('./driverCarChangesMIS/driverCarChangesMIS.module').then(
            (m) => m.DriverCarChangesMISModule
          )
      },

      {
        path: 'city',
        loadChildren: () =>
          import('./city/city.module').then(
            (m) => m.CityModule
          )
      },

      {
        path: 'customerPersonAddress',
        loadChildren: () =>
          import('./customerPersonAddress/customerPersonAddress.module').then(
            (m) => m.CustomerPersonAddressModule
          )
      },

      {
        path: 'customerPersonDrivingLicense',
        loadChildren: () =>
          import('./customerPersonDrivingLicense/customerPersonDrivingLicense.module').then(
            (m) => m.CustomerPersonDrivingLicenseModule
          )
      },

      {
        path: 'driverDrivingLicense',
        loadChildren: () =>
          import('./driverDrivingLicense/driverDrivingLicense.module').then(
            (m) => m.DriverDrivingLicenseModule
          )
      },

      {
        path: 'driverDrivingLicenseVerification',
        loadChildren: () =>
          import('./driverDrivingLicenseVerification/driverDrivingLicenseVerification.module').then(
            (m) => m.DriverDrivingLicenseVerificationModule
          )
      },

      {
        path: 'driver',
        loadChildren: () =>
          import('./driver/driver.module').then(
            (m) => m.DriverModule
          )
      },

      {
        path: 'driverInventoryAssociation',
        loadChildren: () =>
          import('./driverInventoryAssociation/driverInventoryAssociation.module').then(
            (m) => m.DriverInventoryAssociationModule
          )
      },

      {
        path: 'dutySlipQualityCheck',
        loadChildren: () =>
          import('./dutySlipQualityCheck/dutySlipQualityCheck.module').then(
            (m) => m.DutySlipQualityCheckModule
          )
      },

      {
        path: 'fetchDataRBE',
        loadChildren: () =>
          import('./fetchDataRBE/fetchDataRBE.module').then(
            (m) => m.FetchDataRBEModule
          )
      },

      {
        path: 'fetchDataFromApp',
        loadChildren: () =>
          import('./fetchDataFromApp/fetchDataFromApp.module').then(
            (m) => m.FetchDataFromAppModule
          )
      },
      {
        path: 'dutySlipQualityCheckedByExecutive',
        loadChildren: () =>
          import('./dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.module').then(
            (m) => m.DutySlipQualityCheckedByExecutiveModule
          )
      },

      {
        path: 'dispatchByExecutive',
        loadChildren: () =>
          import('./dispatchByExecutive/dispatchByExecutive.module').then(
            (m) => m.DispatchByExecutiveModule
          )
      },

      {
        path: 'reachedByExecutive',
        loadChildren: () =>
          import('./reachedByExecutive/reachedByExecutive.module').then(
            (m) => m.ReachedByExecutiveModule
          )
      },

      {
        path: 'vehicle',
        loadChildren: () =>
          import('./vehicle/vehicle.module').then(
            (m) => m.VehicleModule
          )
      },

      {
        path: 'geoPointType',
        loadChildren: () =>
          import('./geoPointType/geoPointType.module').then(
            (m) => m.GeoPointTypeModule
          )
      },
      {
        path: 'document',
        loadChildren: () =>
          import('./document/document.module').then(
            (m) => m.DocumentModule
          )
      },

      {
        path: 'supplierRequiredDocument',
        loadChildren: () =>
          import('./supplierRequiredDocument/supplierRequiredDocument.module').then(
            (m) => m.SupplierRequiredDocumentModule
          )
      },

      {
        path: 'bankChargeConfig',
        loadChildren: () =>
          import('./bankChargeConfig/bankChargeConfig.module').then(
            (m) => m.BankChargeConfigModule
          )
      },

      {
        path: 'vehicleManufacturer',
        loadChildren: () =>
          import('./vehicleManufacturer/vehicleManufacturer.module').then(
            (m) => m.VehicleManufacturerModule
          )
      },

      {
        path: 'organizationalEntity',
        loadChildren: () =>
          import('./organizationalEntity/organizationalEntity.module').then(
            (m) => m.OrganizationalEntityModule
          )
      },
      {
        path: 'supplierContractVehiclePercentage',
        loadChildren: () =>
          import('./supplierContractVehiclePercentage/supplierContractVehiclePercentage.module').then(
            (m) => m.SupplierContractVehiclePercentageModule
          )
      },
      {
        path: 'supplierContractCustomerVehiclePercentage',
        loadChildren: () =>
          import('./supplierContractCustomerVehiclePercentage/supplierContractCustomerVehiclePercentage.module').then(
            (m) => m.SupplierContractCustomerVehiclePercentageModule
          )
      },
      {
        path: 'supplierRateCard',
        loadChildren: () =>
          import('./supplierRateCard/supplierRateCard.module').then(
            (m) => m.SupplierRateCardModule
          )
      },
      {
        path: 'supplierContractCustomerPackageTypePercentage',
        loadChildren: () =>
          import('./supplierContractCustomerPackageTypePercentage/supplierContractCustomerPackageTypePercentage.module').then(
            (m) => m.SupplierContractCustomerPackageTypePercentageModule
          )
      },
      {
        path: 'supplierContractPackageTypePercentage',
        loadChildren: () =>
          import('./supplierContractPackageTypePercentage/supplierContractPackageTypePercentage.module').then(
            (m) => m.SupplierContractPackageTypePercentageModule
          )
      },

      {
        path: 'inventoryInsurance',
        loadChildren: () =>
          import('./inventoryInsurance/inventoryInsurance.module').then(
            (m) => m.InventoryInsuranceModule
          )
      },

      {
        path: 'inventoryPermit',
        loadChildren: () =>
          import('./inventoryPermit/inventoryPermit.module').then(
            (m) => m.InventoryPermitModule
          )
      },
      {
        path: 'inventoryTarget',
        loadChildren: () =>
          import('./inventoryTarget/inventoryTarget.module').then(
            (m) => m.InventoryTargetModule
          )
      },
      {
        path: 'inventoryStatusHistory',
        loadChildren: () =>
          import('./inventoryStatusHistory/inventoryStatusHistory.module').then(
            (m) => m.InventoryStatusHistoryModule
          )
      },

      {
        path: 'customerGroup',
        loadChildren: () =>
          import('./customerGroup/customerGroup.module').then(
            (m) => m.CustomerGroupModule
          )
      },

      {
        path: 'integrationLog',
        loadChildren: () =>
          import('./integrationLog/integrationLog.module').then(
            (m) => m.IntegrationLogModule
          )
      },

      {
        path: 'customerCategory',
        loadChildren: () =>
          import('./customerCategory/customerCategory.module').then(
            (m) => m.CustomerCategoryModule
          )
      },

      {
        path: 'customerType',
        loadChildren: () =>
          import('./customerType/customerType.module').then(
            (m) => m.CustomerTypeModule
          )
      },

      {
        path: 'vehicleCategoryTarget',
        loadChildren: () =>
          import('./vehicleCategoryTarget/vehicleCategoryTarget.module').then(
            (m) => m.VehicleCategoryTargetModule
          )
      },

      {
        path: 'vehicleInterStateTax',
        loadChildren: () =>
          import('./vehicleInterStateTax/vehicleInterStateTax.module').then(
            (m) => m.VehicleInterStateTaxModule
          )
      },

      {
        path: 'inventory',
        loadChildren: () =>
          import('./inventory/inventory.module').then(
            (m) => m.InventoryModule
          )
      },

      {
        path: 'changePassword',
        loadChildren: () =>
          import('./changePassword/changePassword.module').then(
            (m) => m.ChangePasswordModule
          )
      },

      {
        path: 'fuelRate',
        loadChildren: () =>
          import('./fuelRate/fuelRate.module').then(
            (m) => m.FuelRateModule
          )
      },

      {
        path: 'incidenceType',
        loadChildren: () =>
          import('./incidenceType/incidenceType.module').then(
            (m) => m.IncidenceTypeModule
          )
      },

      {
        path: 'incidence',
        loadChildren: () =>
          import('./incidence/incidence.module').then(
            (m) => m.IncidenceModule
          )
      },
      {
        path: 'issueCategory',
        loadChildren: () =>
          import('./issueCategory/issueCategory.module').then(
            (m) => m.IssueCategoryModule
          )
      },

      {
        path: 'resolution',
        loadChildren: () =>
          import('./resolution/resolution.module').then(
            (m) => m.ResolutionModule
          )
      },

      {
        path: 'fleet',
        loadChildren: () =>
          import('./fleet/fleet.module').then(
            (m) => m.FleetModule
          )
      },

      {
        path: 'supplierContractCDCOutStationLumpsumTrip',
        loadChildren: () =>
          import('./supplierContractCDCOutStationLumpsumTrip/supplierContractCDCOutStationLumpsumTrip.module').then(
            (m) => m.SupplierContractCDCOutStationLumpsumTripModule
          )
      },

      {
        path: 'supplierContractCDCOutStationOnewayTrip',
        loadChildren: () =>
          import('./supplierContractCDCOutStationOnewayTrip/supplierContractCDCOutStationOnewayTrip.module').then(
            (m) => m.SupplierContractCDCOutStationOnewayTripModule
          )
      },

      {
        path: 'supplierContractCDCLongTermRental',
        loadChildren: () =>
          import('./supplierContractCDCLongTermRental/supplierContractCDCLongTermRental.module').then(
            (m) => m.SupplierContractCDCLongTermRentalModule
          )
      },

      {
        path: 'supplierContractCDCLocalOnDemand',
        loadChildren: () =>
          import('./supplierContractCDCLocalOnDemand/supplierContractCDCLocalOnDemand.module').then(
            (m) => m.SupplierContractCDCLocalOnDemandModule
          )
      },

      {
        path: 'supplierContractCDCLocalTransfer',
        loadChildren: () =>
          import('./supplierContractCDCLocalTransfer/supplierContractCDCLocalTransfer.module').then(
            (m) => m.SupplierContractCDCLocalTransferModule
          )
      },

      {
        path: 'supplierContractCDCLocal',
        loadChildren: () =>
          import('./supplierContractCDCLocal/supplierContractCDCLocal.module').then(
            (m) => m.SupplierContractCDCLocalModule
          )
      },

      {
        path: 'supplierContractSDCSelfDriveHourlyLimited',
        loadChildren: () =>
          import('./supplierContractSDCSelfDriveHourlyLimited/supplierContractSDCSelfDriveHourlyLimited.module').then(
            (m) => m.SupplierContractSDCSelfDriveHourlyLimitedModule
          )
      },


      {
        path: 'supplierContractSDCSelfDriveHourlyUnlimited',
        loadChildren: () =>
          import('./supplierContractSDCSelfDriveHourlyUnlimited/supplierContractSDCSelfDriveHourlyUnlimited.module').then(
            (m) => m.SupplierContractSDCSelfDriveHourlyUnlimitedModule
          )
      },

      {
        path: 'organizationalEntityMessage',
        loadChildren: () =>
          import('./organizationalEntityMessage/organizationalEntityMessage.module').then(
            (m) => m.OrganizationalEntityMessageModule
          )
      },

      {
        path: 'organizationalEntityStakeHolders',
        loadChildren: () =>
          import('./organizationalEntityStakeHolders/organizationalEntityStakeHolders.module').then(
            (m) => m.OrganizationalEntityStakeHoldersModule
          )
      },

      {
        path: 'currentDesgination',
        loadChildren: () =>
          import('./currentDesgination/currentDesgination.module').then(
            (m) => m.CurrentDesginationModule
          )
      },

      {
        path: 'employee',
        loadChildren: () =>
          import('./employee/employee.module').then(
            (m) => m.EmployeeModule
          )
      },
      {
        path: 'unlockEmployee',
        loadChildren: () =>
          import('./unlockEmployee/unlockEmployee.module').then(
            (m) => m.UnlockEmployeeModule
          )
      },

      {
        path: 'expense',
        loadChildren: () =>
          import('./expense/expense.module').then(
            (m) => m.ExpenseModule
          )
      },

      {
        path: 'dutyExpense',
        loadChildren: () =>
          import('./dutyExpense/dutyExpense.module').then(
            (m) => m.DutyExpenseModule
          )
      },

      {
        path: 'customerGroupReservationCapping',
        loadChildren: () =>
          import('./customerGroupReservationCapping/customerGroupReservationCapping.module').then(
            (m) => m.CustomerGroupReservationCappingModule
          )
      },

      {
        path: 'customerReservationCapping',
        loadChildren: () =>
          import('./customerReservationCapping/customerReservationCapping.module').then(
            (m) => m.CustomerReservationCappingModule
          )
      },

      {
        path: 'sac',
        loadChildren: () =>
          import('./sac/sac.module').then(
            (m) => m.SACModule
          )
      },

      {
        path: 'customerQC',
        loadChildren: () =>
          import('./customerQC/customerQC.module').then(
            (m) => m.CustomerQCModule
          )
      },

 {
        path: 'billingType',
        loadChildren: () =>
          import('./billingType/billingType.module').then(
            (m) => m.BillingTypeModule
          )
      },
      {
        path: 'customerBillingCycle',
        loadChildren: () =>
          import('./customerBillingCycle/customerBillingCycle.module').then(
            (m) => m.CustomerBillingCycleModule
          )
      },
      {
        path: 'billingCycleName',
        loadChildren: () =>
          import('./billingCycleName/billingCycleName.module').then(
            (m) => m.BillingCycleNameModule
          )
      },
      {
        path: 'validateOTP',
        loadChildren: () =>
          import('./validateOTP/validateOTP.module').then(
            (m) => m.ValidateOTPModule
          )
      },
      {
        path: 'password',
        loadChildren: () =>
          import('./password/password.module').then(
            (m) => m.PasswordModule
          )
      },

      {
        path: 'singleDutySingleBill',
        loadChildren: () =>
          import('./singleDutySingleBill/singleDutySingleBill.module').then(
            (m) => m.SingleDutySingleBillModule
          )
      },

      {
        path: 'dutySAC',
        loadChildren: () =>
          import('./dutySAC/dutySAC.module').then(
            (m) => m.DutySACModule
          )
      },
      
      {
        path: 'dutyGSTPercentage',
        loadChildren: () =>
          import('./dutyGSTPercentage/dutyGSTPercentage.module').then(
            (m) => m.DutyGSTPercentageModule
          )
      },

      {
        path: 'bookingRequest',
        loadChildren: () =>
          import('./bookingRequest/bookingRequest.module').then(
            (m) => m.BookingRequestModule
          )
      },

      {
        path: 'bookingConfiguration',
        loadChildren: () =>
          import('./bookingConfiguration/bookingConfiguration.module').then(
            (m) => m.BookingConfigurationModule
          )
      },

      {
        path: 'vendorContract',
        loadChildren: () =>
          import('./vendorContract/vendorContract.module').then(
            (m) => m.VendorContractModule
          )
      },

      {
        path: 'vendorContractCarCategory',
        loadChildren: () =>
          import('./vendorContractCarCategory/vendorContractCarCategory.module').then(
            (m) => m.VendorContractCarCategoryModule
          )
      },

      {
        path: 'vendorContractCarCategoriesCarMapping',
        loadChildren: () =>
          import('./vendorContractCarCategoriesCarMapping/vendorContractCarCategoriesCarMapping.module').then(
            (m) => m.VendorContractCarCategoriesCarMappingModule
          )
      },

      {
        path: 'vendorContractCityTiers',
        loadChildren: () =>
          import('./vendorContractCityTiers/vendorContractCityTiers.module').then(
            (m) => m.VendorContractCityTiersModule
          )
      },

      {
        path: 'vendorContractCityTiersCityMapping',
        loadChildren: () =>
          import('./vendorContractCityTiersCityMapping/vendorContractCityTiersCityMapping.module').then(
            (m) => m.VendorContractCityTiersCityMappingModule
          )
      },

       {
        path: 'rateViewForOutstationRoundTripVendorContract',
        loadChildren: () =>
          import('./rateViewForOutstationRoundTripVendorContract/rateViewForOutstationRoundTripVendorContract.module').then(
            (m) => m.RateViewForOutstationRoundTripVendorContractModule
          )
      },

       {
        path: 'rateViewForOutstationOneWayTripVendorContract',
        loadChildren: () =>
          import('./rateViewForOutstationOneWayTripVendorContract/rateViewForOutstationOneWayTripVendorContract.module').then(
            (m) => m.RateViewForOutstationOneWayTripVendorContractModule
          )
      },

       {
        path: 'rateViewForVendorLocalTransferRate',
        loadChildren: () =>
          import('./rateViewForVendorLocalTransferRate/rateViewForVendorLocalTransferRate.module').then(
            (m) => m.RateViewForVendorLocalTransferRateModule
          )
      },

       {
        path: 'rateViewForVendorLocalLumpsumRate',
        loadChildren: () =>
          import('./rateViewForVendorLocalLumpsumRate/rateViewForVendorLocalLumpsumRate.module').then(
            (m) => m.RateViewForVendorLocalLumpsumRateModule
          )
      },
         {
        path: 'vendorContractPackageTypeMapping',
        loadChildren: () =>
          import('./vendorContractPackageTypeMapping/vendorContractPackageTypeMapping.module').then(
            (m) => m.VendorContractPackageTypeMappingModule
          )
      },

       {
        path: 'vendorPaymentMapping',
        loadChildren: () =>
          import('./vendorPaymentMapping/vendorPaymentMapping.module').then(
            (m) => m.VendorPaymentMappingModule
          )
      },

      {
        path: 'vendorOutStationRoundTripRate',
        loadChildren: () =>
          import('./vendorOutStationRoundTripRate/vendorOutStationRoundTripRate.module').then(
            (m) => m.VendorOutStationRoundTripRateModule
          )
      },

      {
        path: 'vendorOutStationOneWayTripRate',
        loadChildren: () =>
          import('./vendorOutStationOneWayTripRate/vendorOutStationOneWayTripRate.module').then(
            (m) => m.VendorOutStationOneWayTripRateModule
          )
      },

       {
        path: 'vendorLocalTransferRate',
        loadChildren: () =>
          import('./vendorLocalTransferRate/vendorLocalTransferRate.module').then(
            (m) => m.VendorLocalTransferRateModule
          )
      },

       {
        path: 'vendorLocalLumpsumRate',
        loadChildren: () =>
          import('./vendorLocalLumpsumRate/vendorLocalLumpsumRate.module').then(
            (m) => m.VendorLocalLumpsumRateModule
          )
      },

      {
        path: 'rateViewForVendorLocal',
        loadChildren: () =>
          import('./rateViewForVendorLocal/rateViewForVendorLocal.module').then(
            (m) => m.RateViewForVendorLocalModule
          )
      },

      {
        path: 'rateViewForVendorLongTermRental',
        loadChildren: () =>
          import('./rateViewForVendorLongTermRental/rateViewForVendorLongTermRental.module').then(
            (m) => m.RateViewForVendorLongTermRentalModule
          )
      },

      {
        path: 'vendorLongTermRentalRate',
        loadChildren: () =>
          import('./vendorLongTermRentalRate/vendorLongTermRentalRate.module').then(
            (m) => m.VendorLongTermRentalRateModule
          )
      },

      {
        path: 'vendorContractLocalRate',
        loadChildren: () =>
          import('./vendorContractLocalRate/vendorContractLocalRate.module').then(
            (m) => m.VendorContractLocalRateModule
          )
      },

    ]
  },
  
      

    
  
 
  {
    path: '',
    component: NoSidebarLayoutComponent,
    children: [
      {
        path: 'SingleDutySingleBillForLocal',
        loadChildren: () =>
          import('./SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.module').then(
            (m) => m.SingleDutySingleBillForLocalModule
          )
      },
      {
        path: 'printdutyslip',
        loadChildren: () =>
          import('./PrintDutySlip/PrintDutySlip.module').then(
            (m) => m.PrintDutySlipModule
          )
      },
     
      {
        path: 'printBlankdutyslip',
        loadChildren: () =>
          import('./PrintBlankDutySlip/PrintBlankDutySlip.module').then(
            (m) => m.PrintBlankDutySlipModule
          )
      },
      {
        path: 'signupPage',
        loadChildren: () =>
          import('./signupPage/signupPage.module').then(
            (m) => m.SignupPageModule
          )
      },
      {
        path: 'adminBookingPage',
        loadChildren: () =>
          import('./adminBookingPage/adminBookingPage.module').then(
            (m) => m.AdminBookingPageModule
          )
      },
      {
        path: 'bookerBookingPage',
        loadChildren: () =>
          import('./bookerBookingPage/bookerBookingPage.module').then(
            (m) => m.BookerBookingPageModule
          )
      },
       {
        path: 'travllerBookingPage',
        loadChildren: () =>
          import('./travllerBookingPage/travllerBookingPage.module').then(
            (m) => m.TravllerBookingPageModule
          )
      },
       {
        path: 'jajSingleDutySingleBillForLocal',
        loadChildren: () =>
          import('./jajSingleDutySingleBillForLocal/jajSingleDutySingleBillForLocal.module').then(
            (m) => m.JajSingleDutySingleBillForLocalModule
          )
      },
      {
        path: 'BookingHtmlPage',
        loadChildren: () =>
          import('./bookingHtmlPage/bookingHtmlPage.module').then(
            (m) => m.BookingHtmlPageModule
          )
      },
      
      {
        path: 'reservationDutyslipSearch',
        loadChildren: () =>
          import('./reservationDutyslipSearch/reservationDutyslipSearch.module').then(
            (m) => m.ReservationDutyslipSearchModule
          )
      },

      {
        path: 'SingleDutySingleBillForOutstation',
        loadChildren: () =>
          import('./SingleDutySingleBillForOutstation/SingleDutySingleBillForOutstation.module').then(
            (m) => m.SingleDutySingleBillForOutstationModule
          )
      },
      {
        path: 'generalBillDetails',
         loadChildren: () =>
          import('./generalBillDetails/generalBillDetails.module').then(
            (m) => m.GeneralBillDetailsModule
          )
      },
       {
        path: 'invoiceMultiDuties',
        loadChildren: () =>
          import('./invoiceMultiDuties/invoiceMultiDuties.module').then(
            (m) => m.InvoiceMultiDutiesModule
          )
      },
      {
        path: 'jajInvoiceMultiDuties',
        loadChildren: () =>
          import('./jajInvoiceMultiDuties/jajInvoiceMultiDuties.module').then(
            (m) => m.JajInvoiceMultiDutiesModule
          )
      },
      {
        path: 'dutySlipAccenture',
        loadChildren: () =>
          import('./dutySlipAccenture/dutySlipAccenture.module').then(
            (m) => m.DutySlipAccentureModule
          )
      },
      {
        path: 'PrintDutySlipWithoutMap',
        loadChildren: () =>
          import('./PrintDutySlipWithoutMap/PrintDutySlipWithoutMap.module').then(
            (m) => m.PrintDutySlipWithoutMapModule
          )
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      )
  },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

