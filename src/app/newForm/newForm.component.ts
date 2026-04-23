// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NewFormService } from './newForm.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormDialogAddPassengersComponent } from '../addPassengers/dialogs/form-dialog/form-dialog.component';
import { CustomerDetailsEditComponent } from './dialogs/customer-details-edit/customer-details-edit.component';
import { PickupDialogComponent } from './dialogs/pickup-dialog/pickup-dialog.component';
import { DropOffDialogComponent } from './dialogs/dropoff-dialog/dropoff-dialog.component';
import { AddStopsDialogComponent } from './dialogs/add-stops-dialog/add-stops-dialog.component';
import { FormDialogAddDiscountComponent } from '../addDiscount/dialogs/form-dialog/form-dialog.component';
import { AdvanceDialogComponent } from '../advance/dialogs/advance-dialog/advance-dialog.component';
import { SettledRatesDialogComponent } from '../settledRates/dialogs/settled-rates-dialog/settled-rates-dialog.component';
import { AdditionalSMSEmailDialogComponent } from '../additionalSMSEmailWhatsapp/dialogs/additional-SMS-Email-dialog/additional-SMS-Email-dialog.component';
import { FormDialogBillToOtherComponent } from '../billToOther/dialogs/form-dialog/form-dialog.component';
import { KamDialogComponent } from '../kamDetails/dialogs/kam-dialog/kam-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { FormDialogRDComponent } from '../reservationDetails/dialogs/form-dialog/form-dialog.component';
import { FormDialogRPComponent } from '../passengerDetails/dialogs/form-dialog/form-dialog.component';
import { PassengerDetails } from '../passengerDetails/passengerDetails.model';
import { PassengerDetailsService } from '../passengerDetails/passengerDetails.service';
import { InternalNoteDetailsService } from '../internalNoteDetails/internalNoteDetails.service';
import { InternalNoteDetails } from '../internalNoteDetails/internalNoteDetails.model';
import { InternalNoteDialogComponent } from '../internalNoteDetails/dialogs/internal-note-dialog/internal-note-dialog.component';
import { FormDialogReservationStopDetailsComponent } from '../reservationStopDetails/dialogs/form-dialog/form-dialog.component';
import { ReservationDetailsService } from '../reservationDetails/reservationDetails.service';
import { ReservationDetails } from '../reservationDetails/reservationDetails.model';
import { FormDialogADComponent } from '../advanceDetails/dialogs/form-dialog/form-dialog.component';
import { AdvanceDetailsService } from '../advanceDetails/advanceDetails.service';
import { AdvanceDetails } from '../advanceDetails/advanceDetails.model';
import { FormDialogSRDComponent } from '../settledRateDetails/dialogs/form-dialog/form-dialog.component';
import { SettledRateDetailsService } from '../settledRateDetails/settledRateDetails.service';
import { SettledRateDetails } from '../settledRateDetails/settledRateDetails.model';
import { FormDialogKCComponent } from '../kamCard/dialogs/form-dialog/form-dialog.component';
import { KamCardService } from '../kamCard/kamCard.service';
import { KamCard } from '../kamCard/kamCard.model';
import { SpecialInstructionDialogComponent } from '../specialInstruction/dialogs/special-instruction-dialog/special-instruction-dialog.component';
import { BillingInstructionsDetailsDialogComponent } from '../billingInstructionsDetails/dialogs/billing-instruction-dialog/billing-instruction-dialog.component';
import { BillingInstructionsDetailsService } from '../billingInstructionsDetails/billingInstructionsDetails.service';
import { BillingInstructionsDetails } from '../billingInstructionsDetails/billingInstructionsDetails.model';
import { DiscountDetails } from '../discountDetails/discountDetails.model';
import { DiscountDetailsService } from '../discountDetails/discountDetails.service';
import { LumpsumRateDetailsDialogComponent } from '../lumpsumRateDetails/dialogs/lumpsumRateDetails/lumpsumRateDetails.component';
import { LumpsumRateDetailsService } from '../lumpsumRateDetails/lumpsumRateDetails.service';
import { LumpsumRateDetails } from '../lumpsumRateDetails/lumpsumRateDetails.model';
import { OtherDetailsComponent } from '../otherDetails/otherDetails.component';
import { OtherDetailsDialogComponent } from '../otherDetails/dialogs/otherDetails/otherDetails.component';
import { OtherDetailsService } from '../otherDetails/otherDetails.service';
import { OtherDetails } from '../otherDetails/otherDetails.model';
import { SpecialInstructionDetailsService } from '../specialInstructionDetails/specialInstructionDetails.service';
import { BillToOtherService } from '../billToOther/billToOther.service';
import { AdditionalSMSDetailsService } from '../additionalSMSDetails/additionalSMSDetails.service';
import { CustomerSpecificDetails, CustomerSpecificDetailsData } from '../customerSpecificDetails/customerSpecificDetails.model';
import { FormDialogComponentCSD } from '../customerSpecificDetails/dialogs/form-dialog/form-dialog.component';
import { SpecialInstructionDetails } from '../specialInstructionDetails/specialInstructionDetails.model';
import { AdditionalSMSDetails } from '../additionalSMSDetails/additionalSMSDetails.model';
import { FormDialogComponent } from '../MOPDetailsShow/dialogs/mopDetails/mopDetails.component';
import { MOPModel } from '../MOPDetailsShow/mopDetailsShow.model';
import { MOPDetailsService } from '../MOPDetailsShow/mopDetailsShow.service';
import { StopDetailsService } from '../stopDetails/stopDetails.service';
import { FormDialogCRComponent } from '../cancelReservation/dialogs/form-dialog/form-dialog.component';
import { CancelReservationService } from '../cancelReservation/cancelReservation.service';
import { CancelReservation } from '../cancelReservation/cancelReservation.model';
import { ModeOfPaymentChangeComponent } from '../modeOfPaymentChanges/modeOfPaymentChanges.component';
import { DiscountDetailsDialogComponent } from '../discountDetails/dialogs/discountDetails/discountDetails.component';
import { ClossingOneService } from '../clossingOne/clossingOne.service';
//import { BillToOtherDetailsService } from '../billToOtherDetails/billToOtherDetails.service';
export interface User {
  name: string;
}
@Component({
  standalone: false,
  selector: 'app-newForm',
  templateUrl: './newForm.component.html',
  styleUrls: ['./newForm.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class NewFormComponent implements OnInit {
 advanceTableLR: LumpsumRateDetails |null;
  advanceTableForm: FormGroup;
  advanceTable: PassengerDetails | null;
  advanceTableIN: InternalNoteDetails | null;
  advanceTableRD: ReservationDetails | null;
  advanceTableAD: AdvanceDetails | null;
  advanceTableSRD: SettledRateDetails | null;
  advanceTableKC: KamCard | null;
  advanceTableDD: DiscountDetails | null;
  advanceTableBI: BillingInstructionsDetails | null;
  advanceTableOD: OtherDetails;
  advanceTableSI: SpecialInstructionDetails | null;
  advanceTableASE: AdditionalSMSDetails | null;
  advanceTableMOP:MOPModel | null;
  advanceTableCR:CancelReservation | null;
	
  @Output() newDataAddedEvent = new EventEmitter<boolean>();
  @Input() newDataAddedEvents = new EventEmitter<boolean>();

  ReservationID: any;
  showHideSpecialInst:boolean = false;
  showHideInternalNote:boolean = false;
  showHideBillingInstruction:boolean = false;
  showHideadditionaSMS:boolean = false;
  showHideAdvanceDetails:boolean = false;
  showHideLumpsumRate:boolean = false;
  showHidebillToOther:boolean = false;
  showHidekamCard:boolean = false;
  showHidesettledRates:boolean = false;
  showHideaddDiscount:boolean = false;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  eventsSubject: Subject<boolean> = new Subject<boolean>();
  CustomerGroupID: any;

  dataSource:CustomerSpecificDetails[];
  dropOffData = [];
  pickUpData = [];
  enRouteData = [];
  reservationID: number;
  viewDetails = false;
  ReservationGroupID: any;
  verifydutystatus: any;
  status: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public newFormService: NewFormService,
    private snackBar: MatSnackBar,
    public stopDetailsService: StopDetailsService,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    public route:ActivatedRoute,
    public passengerDetailsService: PassengerDetailsService,
    public internalNoteDetailsService: InternalNoteDetailsService,
    public reservationDetailsService: ReservationDetailsService,
    public advanceDetailsService: AdvanceDetailsService,
    public settleRateService: SettledRateDetailsService,
    public kamCardService: KamCardService,
    public discountDetails: DiscountDetailsService,
    public lumpshumRate: LumpsumRateDetailsService,
    public billingInstructionsDetailsService: BillingInstructionsDetailsService,
    public otherDetailsService:OtherDetailsService,
    private specialInstructionDetailsService: SpecialInstructionDetailsService,
    private billToOtherService: BillToOtherService,
    public additionalSMSDetailsService: AdditionalSMSDetailsService,
     public clossingOneService: ClossingOneService,
    //private billToOtherDetailsService: BillToOtherDetailsService,
    public mopDetailsService: MOPDetailsService,
    public cancelReservationService: CancelReservationService,
  ) {
    //this.advanceTable = new NewForm({});
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedReservationID = paramsData.reservationID;
      const encryptedCustomerGroupID = paramsData.customerGroupID;
      const encryptedReservationGroupID = paramsData.reservationGroupID;

if (encryptedReservationID) {
this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
}

if (encryptedCustomerGroupID) {
this.CustomerGroupID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID));
}

if (encryptedReservationGroupID) {
this.ReservationGroupID = this._generalService.decrypt(decodeURIComponent(encryptedReservationGroupID));
}

    });
    // this.route.queryParams.subscribe(paramsData =>{
    //   this.ReservationID   = paramsData.reservationID;
    //   this.ReservationGroupID   = paramsData.reservationGroupID;    
    //   this.CustomerGroupID = paramsData.customerGroupID;
    //   if(paramsData.view) {
    //     this.viewDetails = paramsData.view;
    //   }
    // });
    this.checkVerifyDutyBeforeFormOpen();
    this.internalNoteLoadData();
    this.reservationDetailsloadData();
    this.advanceDetailsLoadData();
    this.settledRateLoadData();
    this.kamCardLoadData();
    this.loadData();
	 this.billingInstructionLoadData();
   this.discountDetailsLoadData();
   this.LumPsumRateLoadData();
   this.OtherDetailsLoadData();
   this.getAdditionalSmsEmailDetails();
    this.SubscribeUpdateService();
    this.getInstrucationDetails();
    this.getBillToOtherDetails();
    this.CustomerSpecificFieldsloadData();
    this.MOPLoadData();
    this.cancelreservationDetailsloadData();
  
  }

  // showHideSpecialInstruction() {
  //   this.showHideSpecialInst = true;
  // }

  emitEventToChild() {
    this.eventsSubject.next(true);
  }

  // getInstrucationDetails() {
  //   debugger
  //   this.specialInstructionDetailsService.getspecialInstructionDetails(this.ReservationID).subscribe((res:any) => {
  //     debugger
  //     if(res.length > 0) 
  //     {
  //       this.showHideSpecialInst = true;
  //     }
  //     else
  //     {
  //       this.showHideSpecialInst = false;
  //     }
  //   }, (error: HttpErrorResponse) => {
  //   });
  // }

  public getInstrucationDetails() 
  {
     this.specialInstructionDetailsService.getspecialInstructionDetails(this.ReservationID).subscribe
     (
       (data: SpecialInstructionDetails)=>   
       {
        if(data != null){
          this.showHideSpecialInst = true;
        }
         this.advanceTableSI = data;
       },
       (error: HttpErrorResponse) => { this.advanceTableSI = null;}
     );
 }
  getOuput(booleanValue: boolean) {
    if(booleanValue) {
      this.loadData();
    }
  }

  submit() 
  {
    // emppty stuff
  }

  openCD()
  {
    const dialogRef = this.dialog.open(FormDialogRDComponent, 
    {
      data: 
        {
          reservationID: this.ReservationID,
          action: 'add',
          status: this.status
        }
    });
  }
  
   openAddPassenger()
  {
    const dialogRef = this.dialog.open(FormDialogRPComponent, 
      {
        width: '700px',
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
            reservationID:this.ReservationID,
            customerGroupID:this.CustomerGroupID,
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.loadData();
      })
  }

  public loadData() 
  {
     this.passengerDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
     (
       (data: PassengerDetails)=>   
       {
         this.advanceTable = data;
        
       },
       (error: HttpErrorResponse) => { this.advanceTable = null;}
     );
 }

 newDataAdded(msg: boolean) {
  this.newDataAddedEvent.emit(msg);
}

OtherDetails()
{
  const dialogRef = this.dialog.open(OtherDetailsDialogComponent, 
    {
      data: 
        {
           advanceTable: this.advanceTableOD,           
          action: 'edit',
          status: this.status
        }
    });
   
    dialogRef.afterClosed().subscribe((res: any) => {
      this.OtherDetailsLoadData();
})
}
public OtherDetailsLoadData() 
{
   this.otherDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
   (
     (data: OtherDetails)=>   
     {
       this.advanceTableOD = data;
      
     }, 
   );  
}

MOPDetails()
{
  const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTableMOP, 
          reservationID:this.ReservationID,          
          action: 'edit',
          status: this.status
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.MOPLoadData();
  })
}

 
MOPHistoryDetails(ReservationID:number) {
    this.dialog.open(ModeOfPaymentChangeComponent, {
      width: '500px',
      data: {
        reservationID:ReservationID, 
      }
    });
  }


public MOPLoadData() 
{
   this.mopDetailsService.getModeOfPaymentDetails(this.ReservationID).subscribe
   (
     data=>   
     {
       this.advanceTableMOP = data;
     }, 
   );  
}

BillingInstruction()
{
  
  const dialogRef = this.dialog.open(BillingInstructionsDetailsDialogComponent, 
    {
      width:'350px',
      data: 
        {
           //advanceTable: this.advanceTable,
           reservationID:this.ReservationID,
           status: this.status
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.billingInstructionLoadData();
})
}

public billingInstructionLoadData() 
{
  
   this.billingInstructionsDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
 (
   (data :BillingInstructionsDetails)=>   
   {
    if(data != null){
      this.showHideBillingInstruction = true;
    }
     this.advanceTableBI = data;
   },
   (error: HttpErrorResponse) => { this.advanceTableBI = null;}
 );
}

addDiscount()
{
  const dialogRef = this.dialog.open(DiscountDetailsDialogComponent, 
    {
      data: 
        {
          // advanceTable: this.advanceTable,
          // action: 'add'
          reservationID:this.ReservationID,
          status: this.status
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.discountDetailsLoadData();
})
}
LumpsumRate()
{
  const dialogRef = this.dialog.open(LumpsumRateDetailsDialogComponent, 
    {
      width:'350px',
      data: 
        {
          // advanceTable: this.advanceTable,
          // action: 'add'
          reservationID:this.ReservationID,
          status: this.status
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.LumPsumRateLoadData();
})
}
public LumPsumRateLoadData() 
{
 
   this.lumpshumRate.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
 (
   (data :LumpsumRateDetails)=>   
   {
    if(data !== null){
      this.showHideLumpsumRate = true;
    }
     this.advanceTableLR = data;
   },
   (error: HttpErrorResponse) => { this.advanceTableLR = null;}
 );
 
}
public discountDetailsLoadData() 
{
   this.discountDetails.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
 (
   (data :DiscountDetails)=>   
   {
    if(data !== null){
      this.showHideaddDiscount = true;
    }
    else{
      this.showHideaddDiscount = false;
    }
     this.advanceTableDD = data;
   },
   (error: HttpErrorResponse) => { this.advanceTableDD = null;}
 );
 
}
openAdvanceDetails()
  {
    const dialogRef = this.dialog.open(FormDialogADComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
            reservationID:this.ReservationID,
            action: 'add',
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.advanceDetailsLoadData();
      })
  }

  public advanceDetailsLoadData() 
  {
     this.advanceDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
     (
       (data: AdvanceDetails)=>   
       {
        
        if(data !== null){
          this.showHideAdvanceDetails = true;
           }
         this.advanceTableAD = data;
        
       },
       (error: HttpErrorResponse) => { this.advanceTableAD = null;}
     );
 }

  openReservationDetails()
  {
    const dialogRef = this.dialog.open(FormDialogRDComponent, 
    {
      width:'100%',
      height:'80%',
      data: 
        {
          reservationID: this.ReservationID,
          action: 'edit',
          status: this.status
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.reservationDetailsloadData();
      this.loadData();
      this.emitEventToChild(); 
      // this.stopReservationloadData();
    })
  }

  cancelReservationDetails()
  {
    const dialogRef = this.dialog.open(FormDialogCRComponent, 
    {
      data: 
        {
          reservationID: this.ReservationID,
          action: 'edit',
          status: this.status
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
       this.cancelreservationDetailsloadData();
      // this.loadData();
      this.emitEventToChild(); 
    })
  }
  
  cancelreservationDetailsloadData()
  {
    this.cancelReservationService.getTableData(this.ReservationID).subscribe
    (
      data =>   
      {
        this.advanceTableCR = data;
      
      },
      (error: HttpErrorResponse) => { this.advanceTableCR = null;}
    );
  }
  
  reservationDetailsloadData()
  {
    this.reservationDetailsService.getTableData(this.ReservationID).subscribe(
      (data:ReservationDetails)=>
      {
        this.advanceTableRD=data;
      }
      
    );
  }

 openAddStops()
 {
   const dialogRef = this.dialog.open(FormDialogReservationStopDetailsComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          reservationID:this.ReservationID,
          status: this.status
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.emitEventToChild();
    });
 }

  InternalNote()
  {
    
    const dialogRef = this.dialog.open(InternalNoteDialogComponent, 
      {
        width:'400px',
        data: 
          {
             //advanceTable: this.advanceTable,
             reservationID:this.ReservationID,
             status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.internalNoteLoadData();
})
  }

  // stopReservationloadData()
  // {
  //   this.pickUpData = []; this.dropOffData = []; this.enRouteData = [];
  //   this.stopDetailsService.getReservationStopDetails(this.reservationID).subscribe((res: any) => {
  //     res?.forEach(element => {
  //       if(element.reservationStopType === 'Pickup') {
  //         this.pickUpData.push(element);        
  //       } else if(element.reservationStopType === 'Enroute') {
  //         this.enRouteData.push(element);
  //       } else if(element.reservationStopType === 'Dropoff') {
  //         this.dropOffData.push(element);
          
  //       }
  //     });
  //   }, (error: HttpErrorResponse) => {
  //   });
  // }

  public internalNoteLoadData() 
  {
     this.internalNoteDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
   (
    
     (data :InternalNoteDetails)=>   
     {
      if(data !== null)
      {
        this.showHideInternalNote = true;
      }
       this.advanceTableIN = data;
     },
     
     (error: HttpErrorResponse) => { this.advanceTableIN = null;}
   );
 }
 
 settledRates()
 {
  this.settleRateService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (dataSRD :SettledRateDetails)=>   
    {
      if(dataSRD !== null)
      {
        this.advanceTableSRD = dataSRD;
        const dialogRef = this.dialog.open(FormDialogSRDComponent, 
        {
          data: 
          {
            reservationID:this.ReservationID,
            advanceTable:this.advanceTableSRD[0],
            action: 'edit',
            status: this.status
          }
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          this.settledRateLoadData();
        })
      }
      else
      {
        const dialogRef = this.dialog.open(FormDialogSRDComponent, 
        {
          data: 
          {
            reservationID:this.ReservationID,
            action: 'add',
            status: this.status
          }
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          this.settledRateLoadData();
        })
      }
    }
  );  
}

settledRateLoadData() 
{
  this.settleRateService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (data :SettledRateDetails)=>   
    {
      if(data !== null)
      {
        this.showHidesettledRates = true;
      }
      this.advanceTableSRD = data;
    },
   (error: HttpErrorResponse) => { this.advanceTableSRD = null;}
  );
}

kamCard(){
const dialogRef = this.dialog.open(FormDialogKCComponent, 
      {
        width:'350px',
        data: 
          {
            reservationID:this.ReservationID,
            action: 'add',
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.kamCardLoadData();
  })
}

kamCardLoadData() 
{
 this.kamCardService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
(
 (data :KamCard)=>   
 {
  
if(data !== null){
  this.showHidekamCard = true;
}
   this.advanceTableKC = data;
 },
 (error: HttpErrorResponse) => { this.advanceTableKC = null;}
);
}

  kamDetails()
  {
    const dialogRef = this.dialog.open(KamDialogComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
            status: this.status
          }
      });
  }

  billToOther()
  {
    const dialogRef = this.dialog.open(FormDialogBillToOtherComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add',
            reservationID:this.ReservationID,
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
       if(res !== undefined) {       
       this.getBillToOtherDetails();
        this.emitEventToChild();
       }
      })
  }

  getBillToOtherDetails() {
    this.billToOtherService.getBillingToOther(this.ReservationID).subscribe((res:any) => {
      if(res.length>0){
        this.showHidebillToOther=true;
      }
    }, (error: HttpErrorResponse) => {
    });
  }

  additionaSMS()
  {
    const dialogRef = this.dialog.open(AdditionalSMSEmailDialogComponent, 
      {
        data: 
        {
          // advanceTable: this.advanceTable,
          // action: 'add',
          reservationID:this.ReservationID,
          status: this.status
        }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if(res !== undefined) {
          //this.getAdditionalSmsEmailDetails();
          this.emitEventToChild();
          this.ngOnInit();
        }
      });
  }

//   public getAdditionalSmsEmailDetails() 
//   {
//      this.additionalSMSDetailsService.getAdditionalSmsDetails(this.ReservationID).subscribe
//      (
//        (data: AdditionalSMSDetails)=>   
//        {
//         if(data != null){
//           this.showHideadditionaSMS = true;
//         }
//          this.advanceTableASE = data;
//        },
//        (error: HttpErrorResponse) => { this.advanceTableASE = null;}
//      );
//  }

  getAdditionalSmsEmailDetails() {
    this.additionalSMSDetailsService.getAdditionalSmsDetails(this.ReservationID).subscribe((res:any) => {
      if(res.length>0){
        this.showHideadditionaSMS=true;
      }
    }, (error: HttpErrorResponse) => {
    });
  }

  openSpecialInstrucation()
  {
    const dialogRef = this.dialog.open(SpecialInstructionDialogComponent, 
     {
      width:'520px',
       data: 
         {
           advanceTable: this.advanceTable,
           action: 'add',
           reservationID:this.ReservationID,
           status: this.status
         }
     });
     dialogRef.afterClosed().subscribe((res: any) => {
       if(res !== undefined) {
        //this.getInstrucationDetails();
         this.emitEventToChild();
         this.ngOnInit();
        }
     });
  }

  advance()
  {
    const dialogRef = this.dialog.open(AdvanceDialogComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
            status: this.status
          }
      });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  // onContextMenu(event: MouseEvent, item: NewForm) {
  //   event.preventDefault();
  //   this.contextMenuPosition.x = event.clientX + 'px';
  //   this.contextMenuPosition.y = event.clientY + 'px';
  //   this.contextMenu.menuData = { item: item };
  //   this.contextMenu.menu.focusFirstItem('mouse');
  //   this.contextMenu.openMenu();
  // }

/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }
/////////////////for Image Upload ends////////////////////////////

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="NewFormCreate")
          {
            if(this.MessageArray[1]=="NewFormView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'NewForm Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="NewFormUpdate")
          {
            if(this.MessageArray[1]=="NewFormView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'NewForm Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="NewFormDelete")
          {
            if(this.MessageArray[1]=="NewFormView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="NewFormAll")
          {
            if(this.MessageArray[1]=="NewFormView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               
               this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               
               this.showNotification(
                'snackbar-danger',
                'Duplicate Value Found.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
        }
      }
    );
  }

  addPassengers()
  {
    const dialogRef = this.dialog.open(FormDialogAddPassengersComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  CustomerSpecificFieldsloadData()
  {
    this.newFormService.GetCustomerSpecificFields(this.ReservationID).subscribe(
      (data:CustomerSpecificDetailsData)=>
      {
        this.dataSource = data.reservationDetailsList;
      }
    );
  }

  openCustomerSpecificField()
  {
    const dialogRef = this.dialog.open(FormDialogComponentCSD, 
      {
        width:'30%',
        data: 
          {
            dataSource:this.dataSource,
            reservationID:this.ReservationID,
            customerID:this.dataSource[0].customerID,
            action:"edit",
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.CustomerSpecificFieldsloadData();
  })
  }
  scrollToLinkButton() {
    const element = document.getElementById('linkButtonSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ///-----SpecialInstrucation
showAndScrollSpecialInstrucation() {
  this.showHideSpecialInst=true;
  setTimeout(() => {
    const element = document.getElementById('specialInstrucation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
///-----InternalNote
showAndScrollInternalNote() {
   this.showHideInternalNote=true;
  setTimeout(() => {
    const element = document.getElementById('internalNote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
//------BillingInstruction
showAndScrollBillingInstruction() {
  this.showHideBillingInstruction = true;
  setTimeout(() => {
    const element = document.getElementById('billingInstruction');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

//------settledRates
showAndScrollOpenSettledRates() {
  this.showHidesettledRates = true;
  setTimeout(() => {
    const element = document.getElementById('settledRates');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

//------AdvanceDetails
showAndScrollAdvanceDetails() {
  this.showHideAdvanceDetails = true;
  setTimeout(() => {
    const element = document.getElementById('advanceDetails');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

//------LumpsumRate
showAndScrollLumpsumRate() {
  this.showHideLumpsumRate = true;
  setTimeout(() => {
    const element = document.getElementById('lumpsumRate');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
//------AdditionaSMS
showAndScrollDutyAdditionaSMS() {
  this.showHideadditionaSMS = true;
  setTimeout(() => {
    const element = document.getElementById('additionaSMS');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

//------kamCard
showAndScrollkamCard() {
  this.showHidekamCard = true;
  setTimeout(() => {
    const element = document.getElementById('kamCard');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
//------addDiscount
showAndScrollAddDiscount() {
  this.showHideaddDiscount = true;
  setTimeout(() => {
    const element = document.getElementById('addDiscount');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

 // Method to check verify duty status before opening any form
  checkVerifyDutyBeforeFormOpen() {
    this.clossingOneService.getVerifyDutydata(this.ReservationID).subscribe(
      data => {
        
      this.status=data?.status?.status || data?.status || data;
      
      
    }
    );
  }
}



