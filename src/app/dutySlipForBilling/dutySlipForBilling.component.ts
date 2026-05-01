// @ts-nocheck
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DutySlipForBillingService } from './dutySlipForBilling.service';
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
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BillingHistory } from './dutySlipForBilling.model';
import { ClosingModel } from '../clossingOne/clossingOne.model';
import { Dispute } from '../dispute/dispute.model';
import { ClossingOneService } from '../clossingOne/clossingOne.service';



@Component({
  standalone: false,
  selector: 'app-dutySlipForBilling',
  templateUrl: './dutySlipForBilling.component.html',
  styleUrls: ['./dutySlipForBilling.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipForBillingComponent implements OnInit {
  @Input() advanceTableClosingOne : ClosingModel | null;
  @Input() disputeAdvanceTable : Dispute[] | null;
  @Input() RegistrationNumber;
  @Input() InvoiceID;
  @Input() DSClosing;
  @Output() dataSaved: EventEmitter<void> = new EventEmitter();
  @Output() dutyStatusChanged = new EventEmitter<{verifyDuty: boolean, goodForBilling: boolean,message: string}>();
  //@Output() dutyMessage = new EventEmitter<string>();
 advanceTableForm:FormGroup;
 panelExpanded: boolean = false;
 selectedKMType: string = '';
 datetime: string = '';
 /** Total KM chain diff; null when not computable. */
 diff: number | null = null;
 totalKMForManul: any;
 totalKMForApp: any;
 advanceTableBH : BillingHistory | null;
 CustomerSignatureImage :string = null;
 buttonText: string = 'Save';
  selectedClosureType: string;
  DutySlipID: number;

  saveDisabled: boolean = true;
  Action: string;
  Message: string;
  //DSClosing: any = null;
  showSpinner:boolean = false;
  showSpinnerForVDGB:boolean = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutySlipForBillingService: DutySlipForBillingService,
    public clossingOneService: ClossingOneService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    private fb: FormBuilder,
    public _generalService: GeneralService,  
  ) {
      this.advanceTableForm = this.createContactForm();
    }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  

  ngOnInit() 
  {
    this.advanceTableForm.valueChanges.subscribe(value => {
    this.dutyStatusChanged.emit({
      verifyDuty: value.verifyDuty,
      goodForBilling: value.goodForBilling,
      message: value.message
    });
  });
    this.Action = this.advanceTableClosingOne.action;
    this.DutySlipID = this.advanceTableClosingOne.closingDutySlipModel.dutySlipID;
    this.advanceTableForm.patchValue({dutySlipForBillingID : this.advanceTableClosingOne.closingDutySlipForBillingModel.dutySlipForBillingID});
    this.advanceTableForm.patchValue({dutySlipID : this.advanceTableClosingOne.closingDutySlipModel.dutySlipID});
    this.advanceTableForm.patchValue({allotmentID : this.advanceTableClosingOne.closingDutySlipModel.allotmentID});
    this.advanceTableForm.patchValue({reservationID : this.advanceTableClosingOne.closingDutySlipModel.reservationID});
    this.advanceTableForm.patchValue({closureStatus:'Closed'});
    this.advanceTableForm.patchValue({dutyTypeID : this.advanceTableClosingOne.closingReservationForPickupDataModel.packageTypeID});
    this.advanceTableForm.patchValue({packageID : this.advanceTableClosingOne.closingReservationForPickupDataModel.packageID});
    if(this.advanceTableClosingOne.closingDutySlipModel.customerSignatureImage)
    {
      this.CustomerSignatureImage=this.advanceTableClosingOne.closingDutySlipModel.customerSignatureImage;
    }
    
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing === null)
    {
      this.advanceTableForm.controls["goodForBilling"].disable();
      this.advanceTableForm.controls["verifyDuty"].disable();
      this.advanceTableForm.patchValue({goodForBilling : false});
      this.advanceTableForm.patchValue({verifyDuty : false});
    }
    else
    {
      this.buttonText = 'Update';
      this.advanceTableForm.controls["goodForBilling"].enable();
      this.advanceTableForm.controls["verifyDuty"].enable();
      this.LoadDataForBilling();
    }

    this.onKeyUp();
    this.onTimeSelection();
  }

  submit()
  {

  }

  toggleBillingManualVisibility(event:any) {
    if (event.value === 'Driver') 
    {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType = event.value;
      this.advanceTableForm.patchValue({closureType : event.value});
      this.advanceTableForm.patchValue({closureMethod:event.value});
      this.InitDriver();
    } 
    else if (event.value === 'App') 
    {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType = event.value;
      this.advanceTableForm.patchValue({closureType : event.value});
      this.advanceTableForm.patchValue({closureMethod:event.value});
      this.InitApp();
    } 
    else if (event.value === 'GPS') 
    {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType = event.value;
      this.advanceTableForm.patchValue({closureType : event.value});
      this.advanceTableForm.patchValue({closureMethod:event.value});
      this.InitGPS();
    }
    else if (event.value === 'Manual') 
    {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType = event.value;
      this.advanceTableForm.patchValue({closureType : event.value});
      this.advanceTableForm.patchValue({closureMethod:event.value});
      this.InitManual();
      if(this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing)
      {
      this.LoadDataForBilling();
      }
 
    } 
    
  }

   InitApp()
  {
    let locationOutLatByApp:string;
    let locationOutLongByApp : string;
    let reportingToGuestLatByApp:string;
    let reportingToGuestLongByApp : string;
    let pickUpLatByApp:string;
    let pickUpLongByApp : string;
    let dropOffLatByApp:string;
    let dropOffLongByApp : string;
    let locationInLatByApp:string;
    let locationInLongByApp : string;

    if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp)
    {
       var value = this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatByApp=lat;
      locationOutLongByApp=long;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      pickUpLatByApp=lat1;
      pickUpLongByApp=long1;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      reportingToGuestLatByApp=lat2;
      reportingToGuestLongByApp=long2;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      dropOffLatByApp=lat3;
      dropOffLongByApp=long3;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat4 = value.split(' ')[2];
      var long4 = value.split(' ')[1];
  
      locationInLatByApp=lat4;
      locationInLongByApp=long4;
    }

      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutDateByApp});
      this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutTimeByApp});
      this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutKMByAppActual});
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatByApp + ',' + locationOutLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestDateByApp});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestTimeByApp});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestKMByAppActual});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatByApp + ',' + reportingToGuestLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      } 

      if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupTime});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpDateByApp});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpTimeByApp});
      }
      
      this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickupKMByAppActual});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatByApp + ',' + pickUpLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffDateByApp});
      this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffTimeByApp});
      this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffKMByAppActual});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatByApp + ',' + dropOffLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }

      
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInDateByApp});
      this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInTimeByApp});
      this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInKMByAppActual});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp !== null)
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp});
      }
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatByApp + ',' + locationInLongByApp});
      }
      else
      {
        if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp !== null)
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:locationOutLatByApp + ',' + locationOutLongByApp });
        }
        else
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null });
        }
      }
    
    
    this.onKeyUp();
    this.onTimeSelection();
  }

  InitDriver()
  {
    let locationOutLatByApp:string;
    let locationOutLongByApp : string;
    let reportingToGuestLatByApp:string;
    let reportingToGuestLongByApp : string;
    let pickUpLatByApp:string;
    let pickUpLongByApp : string;
    let dropOffLatByApp:string;
    let dropOffLongByApp : string;
    let locationInLatByApp:string;
    let locationInLongByApp : string;

    if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp)
    {
       var value = this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatByApp=lat;
      locationOutLongByApp=long;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      pickUpLatByApp=lat1;
      pickUpLongByApp=long1;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      reportingToGuestLatByApp=lat2;
      reportingToGuestLongByApp=long2;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      dropOffLatByApp=lat3;
      dropOffLongByApp=long3;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat4 = value.split(' ')[2];
      var long4 = value.split(' ')[1];
  
      locationInLatByApp=lat4;
      locationInLongByApp=long4;
    }

      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutDateByApp});
      this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutTimeByApp});
      this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutKMByApp});
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatByApp + ',' + locationOutLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestDateByApp});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestTimeByApp});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestKMByApp});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatByApp + ',' + reportingToGuestLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      } 

      if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupTime});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpDateByApp});
      this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpTimeByApp});
      }
      
      this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpKMByApp});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatByApp + ',' + pickUpLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffDateByApp});
      this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffTimeByApp});
      this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffKMByApp});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatByApp + ',' + dropOffLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }


      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInDateByApp});
      this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInTimeByApp});
      this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInKMByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp !== null)
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp});
      }
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatByApp + ',' + locationInLongByApp});
      }
      else
      {
        if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp !== null)
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:locationOutLatByApp + ',' + locationOutLongByApp });
        }
        else
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null });
        }
      }

    this.onKeyUp();
    this.onTimeSelection();
  }

  InitGPS()
  {
    let locationOutLatByGPS:string;
    let locationOutLongByGPS : string;
    let reportingToGuestLatByGPS:string;
    let reportingToGuestLongByGPS : string;
    let pickUpLatByGPS:string;
    let pickUpLongByGPS : string;
    let dropOffLatByGPS:string;
    let dropOffLongByGPS : string;
    let locationInLatByGPS:string;
    let locationInLongByGPS : string;

    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLatLongByGPS)
    {
       var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatByGPS=lat;
      locationOutLongByGPS=long;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpLatLongByGPS)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      pickUpLatByGPS=lat1;
      pickUpLongByGPS=long1;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestLatLongByGPS)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      reportingToGuestLatByGPS=lat2;
      reportingToGuestLongByGPS=long2;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffLatLongByGPS)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      dropOffLatByGPS=lat3;
      dropOffLongByGPS=long3;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInLatLongByGPS)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat4 = value.split(' ')[2];
      var long4 = value.split(' ')[1];
  
      locationInLatByGPS=lat4;
      locationInLongByGPS=long4;
    }

      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutDateByGPS});
      this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutTimeByGPS});
      this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutKMByGPS});
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutAddressStringByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLatLongByGPS)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatByGPS + ',' + locationOutLongByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestDateByGPS});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestTimeByGPS});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestKMByGPS});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestAddressStringByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestLatLongByGPS)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatByGPS + ',' + reportingToGuestLongByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      } 

      if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupTime});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpDateByGPS});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpTimeByGPS});
      }

      
      this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpKMByGPS});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpAddressStringByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpLatLongByGPS)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatByGPS + ',' + pickUpLongByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffDateByGPS});
      this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffTimeByGPS});
      this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffKMByGPS});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffAddressStringByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffLatLongByGPS)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatByGPS + ',' + dropOffLongByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }


      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInDateByGPS});
      this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInTimeByGPS});
      this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInKMByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp !== null)
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInAddressStringByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutAddressStringByGPS});
      }
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInLatLongByGPS)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatByGPS + ',' + locationInLongByGPS});
      }
      else
      {
        if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLatLongByGPS !== null)
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:locationOutLatByGPS + ',' + locationOutLongByGPS});
        }
        else
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null });
        }
      }
    
    this.onKeyUp();
    this.onTimeSelection();
  }

  InitManual()
  {
    let locationOutLatByDriver:string;
    let locationOutLongByDriver : string;
    let reportingToGuestLatByDriver:string;
    let reportingToGuestLongByDriver : string;
    let pickUpLatByDriver:string;
    let pickUpLongByDriver : string;
    let dropOffLatByDriver:string;
    let dropOffLongByDriver : string;
    let locationInLatByDriver:string;
    let locationInLongByDriver : string;

    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLatLongByDriver)
    {
       var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatByDriver=lat;
      locationOutLongByDriver=long;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpLatLongByDriver)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      pickUpLatByDriver=lat1;
      pickUpLongByDriver=long1;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestLatLongByDriver)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      reportingToGuestLatByDriver=lat2;
      reportingToGuestLongByDriver=long2;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffLatLongByDriver)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      dropOffLatByDriver=lat3;
      dropOffLongByDriver=long3;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInLatLongByDriver)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat4 = value.split(' ')[2];
      var long4 = value.split(' ')[1];
  
      locationInLatByDriver=lat4;
      locationInLongByDriver=long4;
    }


      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutDateByDriver});
      this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutTimeByDriver});
      this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutKMByDriver});
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutAddressStringByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLatLongByDriver)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatByDriver + ',' + locationOutLongByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestDateByDriver});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestTimeByDriver});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestKMByDriver});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestAddressStringByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestLatLongByDriver)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatByDriver + ',' + reportingToGuestLongByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      } 

      if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupTime});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpDateByDriver});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpTimeByDriver});
      }
      
      this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpKMByDriver});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpAddressStringByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpLatLongByDriver)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatByDriver + ',' + pickUpLongByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffDateByDriver});
      this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffTimeByDriver});
      this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffKMByDriver});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffAddressStringByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffLatLongByDriver)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatByDriver + ',' + dropOffLongByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }


      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInDateByDriver});
      this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInTimeByDriver});
      this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInKMByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp !== null)
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInAddressStringByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutAddressStringByDriver});
      }

      
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInLatLongByDriver)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatByDriver + ',' + locationInLongByDriver});
      }
      else
      {
        if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLatLongByDriver !== null)
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:locationOutLatByDriver + ',' + locationOutLongByDriver});
        }
        else
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null });
        }
      }
    this.onKeyUp();
    this.onTimeSelection();
  }

  public LoadDataForBilling()
  {
    let locationOutLatForBilling:string;
    let locationOutLongForBilling : string;
    let reportingToGuestLatForBilling:string;
    let reportingToGuestLongForBilling : string;
    let pickUpLatForBilling:string;
    let pickUpLongForBilling : string;
    let dropOffLatForBilling:string;
    let dropOffLongForBilling : string;
    let locationInLatForBilling:string;
    let locationInLongForBilling : string;

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatForBilling=lat;
      locationOutLongForBilling=long;
    }

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      reportingToGuestLatForBilling=lat;
      reportingToGuestLongForBilling=long;
    }

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      pickUpLatForBilling=lat;
      pickUpLongForBilling=long;
    }

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      dropOffLatForBilling=lat;
      dropOffLongForBilling=long;
    }

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationInLatForBilling=lat;
      locationInLongForBilling=long;
    }

    this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutDateForBilling});
    this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutTimeForBilling});
    this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutKMForBilling});
    this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutLatLongForBilling)
    {
      this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatForBilling + ',' + locationOutLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({locationOutLatLongForBilling:null});
    }

    this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestDateForBilling});
    this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestTimeForBilling});
    this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestKMForBilling});
    this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestLatLongForBilling)
    {
      this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatForBilling + ',' + reportingToGuestLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null});
    }

    if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
    {
      this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpDateForBilling});
      this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpTimeForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpDateForBilling});
      this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpTimeForBilling});
    }

    this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpKMForBilling});
    this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpLatLongForBilling)
    {
      this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatForBilling + ',' + pickUpLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({pickUpLatLongForBilling:null});
    }

    this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffDateForBilling});
    this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffTimeForBilling});
    this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffKMForBilling});
    this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffLatLongForBilling)
    {
      this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatForBilling + ',' + dropOffLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({dropOffLatLongForBilling:null});
    }

    this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInDateForBilling});
    this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInTimeForBilling});
    this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInKMForBilling});
    this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInLatLongForBilling)
    {
      this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatForBilling + ',' + locationInLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({locationInLatLongForBilling:null});
    }

    this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutLocationOrHubID});
    this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInLocationOrHubID});
    this.advanceTableForm.patchValue({closureType : this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType});
    this.advanceTableForm.patchValue({dutyTypeID : this.advanceTableClosingOne.closingDutySlipForBillingModel.dutyTypeID});
    this.advanceTableForm.patchValue({packageID : this.advanceTableClosingOne.closingDutySlipForBillingModel.packageID});
    this.advanceTableForm.patchValue({closureStatus : this.advanceTableClosingOne.closingDutySlipModel.closureStatus});
    this.advanceTableForm.patchValue({closureMethod : this.advanceTableClosingOne.closingDutySlipModel.closureMethod});
    this.advanceTableForm.patchValue({verifyDuty : this.advanceTableClosingOne.closingDutySlipForBillingModel.verifyDuty});
    this.advanceTableForm.patchValue({dsClosing : this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing});
    this.advanceTableForm.patchValue({runningDetails : this.advanceTableClosingOne.closingDutySlipForBillingModel.runningDetails});
    this.advanceTableForm.patchValue({vendorRemark : this.advanceTableClosingOne.closingDutySlipForBillingModel.vendorRemark});
    this.advanceTableForm.patchValue({physicalDutySlipReceived : this.advanceTableClosingOne.closingDutySlipForBillingModel.physicalDutySlipReceived});
    this.advanceTableForm.patchValue({goodForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling});
    this.selectedClosureType = this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType;
    //this.advanceTableForm.patchValue({actionTaken : this.advanceTableClosingOne.closingDutySlipModel.actionTaken});
    //this.advanceTableForm.patchValue({actionDetails : this.advanceTableClosingOne.closingDutySlipModel.actionDetails});
    this.onKeyUp();
    this.onTimeSelection();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutySlipForBillingID: [''],
      dutySlipID: [''],
      locationOutLocationOrHubID: [''],
      locationInLocationOrHubID: [''],
      closureType:[''],
      reservationID:[''],
      allotmentID:[''],

      locationOutDateForBilling: [''],
      locationOutTimeForBilling: [''],
      locationOutKMForBilling: [''],
      locationOutLatLongForBilling: [''],
      locationOutAddressStringForBilling: [''],

      reportingToGuestDateForBilling: [''],
      reportingToGuestTimeForBilling: [''],
      reportingToGuestKMForBilling: [''],
      reportingToGuestLatLongForBilling: [''],
      reportingToGuestAddressStringForBilling: [''],
      
      pickUpDateForBilling: [''],
      pickUpTimeForBilling: [''],
      pickUpKMForBilling: [''],
      pickUpLatLongForBilling: [''],
      pickUpAddressStringForBilling: [''],

      dropOffDateForBilling: [''],
      dropOffTimeForBilling: [''],
      dropOffKMForBilling: [''],
      dropOffLatLongForBilling: [''],
      dropOffAddressStringForBilling: [''],

      locationInDateForBilling: [''],
      locationInTimeForBilling: [''],
      locationInKMForBilling: [''],
      locationInLatLongForBilling: [''],
      locationInAddressStringForBilling: [''],
      
      dutyTypeID: [''],
      packageID: [''],
      closureStatus: [''],
      closureMethod:[''],

      goodForBilling: [''],
      verifyDuty: [''],
      dsClosing:[''],
      runningDetails:[''],
      vendorRemark:[''],
      physicalDutySlipReceived:[''],
      actionTaken:[''],
      actionDetails:['']
    });
  } 
  
//---------- Location Out Date For Billing ----------
  onLocOutDatepickerChange(event: any): void  {         
    const inputElement = event.targetElement;
    if (inputElement)
    {
      this.onBlurLocOutDateUpdateDate({ target: inputElement});
      
    }
    
    
  }

  onBlurLocOutDateUpdateDate(event: any): void {
    let value = event.target.value;
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('locationOutDateForBilling')?.setValue(formattedDate);    
    } 
    else 
    {
      this.advanceTableForm.get('locationOutDateForBilling')?.setErrors({ invalidDate: true });
    }
    this.onTimeSelection();
  }

  onTimeSelection() {
    const locOutTime = this.advanceTableForm.get('locationOutTimeForBilling')?.value;
    const locOutDate = this.advanceTableForm.get('locationOutDateForBilling')?.value;
    const pickUpTime = this.advanceTableForm.get('pickUpTimeForBilling')?.value;
    const pickUpDate = this.advanceTableForm.get('pickUpDateForBilling')?.value;
    const dropOffTime = this.advanceTableForm.get('dropOffTimeForBilling')?.value;
    const dropOffDate = this.advanceTableForm.get('dropOffDateForBilling')?.value;
    const locInTime = this.advanceTableForm.get('locationInTimeForBilling')?.value;
    const locInDate = this.advanceTableForm.get('locationInDateForBilling')?.value;

    const hasAll =
      locOutTime != null &&
      locOutDate != null &&
      locOutTime !== '' &&
      locOutDate !== '' &&
      pickUpTime != null &&
      pickUpDate != null &&
      pickUpTime !== '' &&
      pickUpDate !== '' &&
      dropOffTime != null &&
      dropOffDate != null &&
      dropOffTime !== '' &&
      dropOffDate !== '' &&
      locInTime != null &&
      locInDate != null &&
      locInTime !== '' &&
      locInDate !== '';

    if (!hasAll) {
      this.datetime = '';
      return;
    }

    if (
      !moment(locOutDate).isValid() ||
      !moment(locOutTime).isValid() ||
      !moment(pickUpDate).isValid() ||
      !moment(pickUpTime).isValid() ||
      !moment(dropOffDate).isValid() ||
      !moment(dropOffTime).isValid() ||
      !moment(locInDate).isValid() ||
      !moment(locInTime).isValid()
    ) {
      this.datetime = '';
      return;
    }

    // Moment uses YYYY (not lowercase yyyy) for 4-digit year
    const locOutTimeConversion = moment(locOutTime).format('HH:mm');
    const locOutDateConversion = moment(locOutDate).format('YYYY-MM-DD');
    const locationOutDateTime = locOutDateConversion + ' ' + locOutTimeConversion;

    const pickUpTimeConversion = moment(pickUpTime).format('HH:mm');
    const pickUpDateConversion = moment(pickUpDate).format('YYYY-MM-DD');
    const pickUpDateTime = pickUpDateConversion + ' ' + pickUpTimeConversion;

    const dropOffTimeConversion = moment(dropOffTime).format('HH:mm');
    const dropOffDateConversion = moment(dropOffDate).format('YYYY-MM-DD');
    const dropOffDateTime = dropOffDateConversion + ' ' + dropOffTimeConversion;

    const locInTimeConversion = moment(locInTime).format('HH:mm');
    const locInDateConversion = moment(locInDate).format('YYYY-MM-DD');
    const locInDateTime = locInDateConversion + ' ' + locInTimeConversion;

    const t0 = new Date(locationOutDateTime).getTime();
    const t1 = new Date(pickUpDateTime).getTime();
    const t2 = new Date(dropOffDateTime).getTime();
    const t3 = new Date(locInDateTime).getTime();
    if (![t0, t1, t2, t3].every((t) => Number.isFinite(t))) {
      this.datetime = '';
      return;
    }

    const diff3 = t1 - t0;
    const diff2 = t2 - t1;
    const diff1 = t3 - t2;
    const totalMilliseconds = diff1 + diff2 + diff3;
    if (!Number.isFinite(totalMilliseconds)) {
      this.datetime = '';
      return;
    }

    const totalMinutes = totalMilliseconds / (1000 * 60);
    if (!Number.isFinite(totalMinutes)) {
      this.datetime = '';
      return;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    this.datetime = hours + '.' + minutes;
  }

  onKeyUp() {
    const v = this.advanceTableForm.value;
    const toNum = (x: any): number | null => {
      if (x === null || x === undefined || x === '') {
        return null;
      }
      const n = Number(x);
      return Number.isFinite(n) ? n : null;
    };
    const locationIn = toNum(v.locationInKMForBilling);
    const dropOff = toNum(v.dropOffKMForBilling);
    const pickUp = toNum(v.pickUpKMForBilling);
    const locationOut = toNum(v.locationOutKMForBilling);
    if (locationIn === null || dropOff === null || pickUp === null || locationOut === null) {
      this.diff = null;
      return;
    }
    const diff1 = locationIn - dropOff;
    const diff2 = dropOff - pickUp;
    const diff3 = pickUp - locationOut;
    const sum = diff1 + diff2 + diff3;
    this.diff = Number.isFinite(sum) ? sum : null;
  }

  addtionOfManulKM()
  {
    this.totalKMForManul = this.advanceTableForm.value.hubToStartKM + this.advanceTableForm.value.startToEndKM + this.advanceTableForm.value.endToHubKM;
  }

  addtionOfAppKM()
  {
    this.totalKMForApp = this.advanceTableForm.value.locationToPickupTripKm + this.advanceTableForm.value.pickupToDropOffTripKm + this.advanceTableForm.value.dropOffToLocationInTripKm;
  }

  //---------- Pickup Date For Billing ----------
  onPickupDatepickerChange(event: any): void {
    const inputElement = event.targetElement;
    if (inputElement) 
    {
      this.onBlurPickupUpdateDate({ target: inputElement});
      
    }
    
  }
  
  onBlurPickupUpdateDate(event: any): void {
    let value = event.target.value;    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('pickUpDateForBilling')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('pickUpDateForBilling')?.setErrors({ invalidDate: true });
    }
    this.onTimeSelection();
  }

  //---------- Drop Off Date For Billing ----------
  onDropOffDatepickerChange(event: any): void {
    const inputElement = event.targetElement;
    if (inputElement) 
    {
      this.onBlurDropOffUpdateDate({ target: inputElement});
      
    }
    
  }
  
  onBlurDropOffUpdateDate(event: any): void {
    let value = event.target.value;    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('dropOffDateForBilling')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('dropOffDateForBilling')?.setErrors({ invalidDate: true });
    }
    this.onTimeSelection();
  }

  //---------- Drop Off Date For Billing ----------
  onLocInDatepickerChange(event: any): void {
    const inputElement = event.targetElement;
    
    if (inputElement) 
    {
      this.onBlurLocInUpdateDate({ target: inputElement});
    }
    
  }

  onBlurLocInUpdateDate(event: any): void {
    let value = event.target.value;    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('locationInDateForBilling')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('locationInDateForBilling')?.setErrors({ invalidDate: true });
    }
    this.onTimeSelection();
  }


  onGFBChange(event: any) 
    {
      if(this.advanceTableForm.value.verifyDuty===false || this.advanceTableForm.value.verifyDuty==='' || this.advanceTableForm.value.verifyDuty===null)
      {
        Swal.fire('', 'Please Verify Duty Before Good For Billing.', 'warning');
        this.advanceTableForm.patchValue({goodForBilling :false});
      return false;
      }
      const isChecked = event.checked;
      if (!this.advanceTableBH) {
        this.advanceTableBH = {} as BillingHistory;
      }
      if(isChecked === true)
      {
        let at = "Checked";
        this.advanceTableForm.patchValue({actionTaken : "GoodForBilling"});
        this.advanceTableForm.patchValue({actionDetails : at});
        this.advanceTableBH.verifyDuty = this.advanceTableForm.value.verifyDuty;
        this.advanceTableBH.goodForBilling = isChecked;
        this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
        this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
        this.CalculateBill();
      }
      if(isChecked === false)
      {
        let at = "Unchecked";
        this.advanceTableForm.patchValue({actionTaken : "GoodForBilling"});
        this.advanceTableForm.patchValue({actionDetails : at})
        this.advanceTableBH.verifyDuty = this.advanceTableForm.value.verifyDuty;
        this.advanceTableBH.goodForBilling = isChecked;
        this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
        this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
      }
      if(isChecked !==null)
      {
        this.SaveDataInBillingHistory();
      }
      
  }

  // onVDChange(event: any) 
  //   {
  //     const isChecked = event.checked;
  //     if (!this.advanceTableBH) {
  //       this.advanceTableBH = {} as BillingHistory;
  //     }
  //     if(this.disputeAdvanceTable === null)
  //   {
  //     if(isChecked === true)
  //     {
  //       let at = "Checked";
  //       this.advanceTableForm.patchValue({actionTaken : "Verify Duty"});
  //       this.advanceTableForm.patchValue({actionDetails : at});
  //       this.advanceTableBH.verifyDuty = isChecked;
  //       this.advanceTableForm.patchValue({goodForBilling : false});
  //       this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
  //       this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
  //     }
  //   }
  //     else if(this.disputeAdvanceTable !== null && this.disputeAdvanceTable.approvalStatus !== true){
  //         Swal.fire({
  //                 title:
  //                   'Please approve dispute status before verify duty.',
  //                 icon: 'warning',
  //               }).then((result) => {
  //                 if (result.value) {
          
  //                 }
  //               });
  //     }
  //     if(isChecked === false)
  //     {
  //       let at = "Unchecked";
  //       this.advanceTableForm.patchValue({actionTaken : "Verify Duty"});
  //       this.advanceTableForm.patchValue({actionDetails : at});
  //       this.advanceTableBH.verifyDuty = isChecked;
  //       this.advanceTableForm.patchValue({goodForBilling : false});
  //       this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
  //       this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
  //     }
  //     if(isChecked !==null)
  //     {
  //       this.SaveDataInBillingHistory();
  //     }
      
  // }

  onVDChange(event: any) {
    
  const isChecked = event.checked;

  if (!this.advanceTableBH) {
    this.advanceTableBH = {} as BillingHistory;
  }

  if (isChecked) {
    if (!this.disputeAdvanceTable || this.disputeAdvanceTable.length === 0) {
      // No disputes, allow verify duty
      this.setVerifyDuty(true, "Checked");
    } else {
      // Disputes exist: all approvalStatus must be true
      const allApproved = this.disputeAdvanceTable.every(
        (d: any) => d.approvalStatus === true
      );

      if (allApproved) {
        this.setVerifyDuty(true, "Checked");
        if (isChecked !== null) {
    this.SaveDataInBillingHistory();
  }
      }
       else {
        // Show alert and revert checkbox
        Swal.fire({
          title: 'Unapproved Disputes found!.',
          icon: 'warning',
        });

        // Revert checkbox in form
        this.advanceTableForm.patchValue({ verifyDuty: false });
      }
    }
  } else {
    // Checkbox unchecked by user
    this.setVerifyDuty(false, "Unchecked");
  }

  
}



setVerifyDuty(value: boolean, details: string) {
  this.advanceTableForm.patchValue({
    actionTaken: "Verify Duty",
    actionDetails: details,
    goodForBilling: false,
    verifyDuty: value
  });

  this.advanceTableBH.verifyDuty = value;
  this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
  this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
  this.SaveDataInBillingHistory();
}


  SaveDataInBillingHistory()
  {
    this.showSpinnerForVDGB = true;
    this.advanceTableBH.dutySlipForBillingID=this.advanceTableForm.value.dutySlipForBillingID;
    this.advanceTableBH.dutySlipID=this.advanceTableForm.value.dutySlipID;
    this.advanceTableBH.userID=this._generalService.getUserID();;
    this.dutySlipForBillingService.addBillingHistory(this.advanceTableBH)  
  .subscribe(
    response => 
    {   
      this.showSpinnerForVDGB = false; 
      this.showNotification(
        'snackbar-success',
        'Updated...!!!',
        'bottom',
        'center'
      );
    },
    error =>
    {
      this.showSpinnerForVDGB = false; 
      this.showNotification(
        'snackbar-danger',
        'Operation Failed...!!!',
        'bottom',
        'center'
      );
    })
  }

   showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  dateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  checkChronologyAndValues(): boolean {
    const form = this.advanceTableForm.value;
    // Date-only validations
    const pickupDate = this.dateOnly(new Date(form.pickUpDateForBilling));
    const locationOutDate = this.dateOnly(new Date(form.locationOutDateForBilling));
    const dropOffDate = this.dateOnly(new Date(form.dropOffDateForBilling));
    const locationInDate = this.dateOnly(new Date(form.locationInDateForBilling));
  
    if (pickupDate < locationOutDate) {
      Swal.fire('Error', 'Pickup Date cannot be before Location Out Date.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
    if (dropOffDate < pickupDate) {
      Swal.fire('Error', 'Drop-off Date cannot be before Pickup Date.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
    if (locationInDate < dropOffDate) {
      Swal.fire('Error', 'Location In Date cannot be before Drop-off Date.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
    // Date+Time validations
    const getDateTime = (dateInput: any, timeInput: any): Date | null => {
    try {
      let date: Date;
      let time: Date;
  
      // Normalize Date input
      if (dateInput instanceof Date) {
        date = dateInput;
      } else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
      } else {
        return null;
      }
  
      // Normalize Time input
      if (timeInput instanceof Date) {
        time = timeInput;
      } else if (typeof timeInput === 'string') {
        time = new Date(timeInput);
      } else {
        return null;
      }
  
      // Compose final DateTime
      const final = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      );
  
      return isNaN(final.getTime()) ? null : final;
    } catch (err) {
      return null;
    }
  };
  
    const locationOutDT = getDateTime(form.locationOutDateForBilling, form.locationOutTimeForBilling);
  const pickupDT = getDateTime(form.pickUpDateForBilling, form.pickUpTimeForBilling);
  const dropOffDT = getDateTime(form.dropOffDateForBilling, form.dropOffTimeForBilling);
  const locationInDT = getDateTime(form.locationInDateForBilling, form.locationInTimeForBilling);
  
  if (!locationOutDT || !pickupDT || !dropOffDT || !locationInDT) {
    Swal.fire('Error', 'One or more DateTime fields are invalid or missing.', 'warning')
    .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
    return false;
  }
  
    if (pickupDT < locationOutDT) {
      Swal.fire('Error', 'Pickup DateTime cannot be before Location Out DateTime.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
    if (dropOffDT < pickupDT) {
      Swal.fire('Error', 'Drop-off DateTime cannot be before Pickup DateTime.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
    if (locationInDT < dropOffDT) {
      Swal.fire('Error', 'Location In DateTime cannot be before Drop-off DateTime.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return (false);
    }
  
    // KM validations
    const locationOutKM = Number(form.locationOutKMForBilling);
    const pickupKM = Number(form.pickUpKMForBilling);
    const dropOffKM = Number(form.dropOffKMForBilling);
    const locationInKM = Number(form.locationInKMForBilling);
  
    if (pickupKM < locationOutKM) {
      Swal.fire('Error', 'Pickup KM cannot be less than Location Out KM.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
    if (dropOffKM < pickupKM) {
      Swal.fire('Error', 'Drop-off KM cannot be less than Pickup KM.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
    if (locationInKM < dropOffKM) {
      Swal.fire('Error', 'Location In KM cannot be less than Drop-off KM.', 'warning')
      .then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
    return true;
  }

  public ClossingDetails(): boolean
  {
  
    if (!this.advanceTableForm.value.dsClosing) {
      Swal.fire({
        title: '',
        text: 'Please Select DS Closing Option.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
    if (!this.advanceTableForm.value.physicalDutySlipReceived) {
      Swal.fire({
        title: '',
        text: 'Please Select Duty Slip Received Option.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
    //-------------Location OUT ---------------
   
    if (!this.advanceTableForm.value.locationOutAddressStringForBilling) {
      Swal.fire({
        title: '',
        text: 'Please Select Location Out Address.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
    
  //----------Pick UP ----------------------
  
    if (!this.advanceTableForm.value.pickUpAddressStringForBilling) {
      Swal.fire({
        title: '',
        text: 'Please Select Pick up Address.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
  //--------------Drop Off-------------------
  
    if (!this.advanceTableForm.value.dropOffAddressStringForBilling) {
      Swal.fire({
        title: '',
        text: 'Please Select Drop Off Address.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
   
    //-----------Location In----------------------
  
    if (!this.advanceTableForm.value.locationInAddressStringForBilling) {
      Swal.fire({
        title: '',
        text: 'Please Select Location In Address.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
    return true;
  }

  public Put(): void
  {
    this.showSpinner = true;
    //this.saveDisabled = false;
    if (!this.checkChronologyAndValues()) {
      return;
    }
    //this.saveDisabled = true;
      if (!this.ClossingDetails())
      {
        return;
      } 
      this.advanceTableForm.patchValue({actionDetails :'Unchecked',actionTaken : "Verify Duty"});
      //this.saveDisabled = true;      
      this.dutySlipForBillingService.update(this.advanceTableForm.getRawValue())  
      .subscribe(
        response => 
        {
          this.showSpinner = false;
          this.DSClosing = response.dsClosing;
          // this.saveDisabled = false;
          // this.CalculateBill();
          this.showNotification(
            'snackbar-success',
            'Saved...!!!',
            'bottom',
            'center'
          );
          this.buttonText = 'Update';
          this.advanceTableForm.controls["goodForBilling"].enable();
          this.advanceTableForm.controls["verifyDuty"].enable();          
          if(response.goodForBilling === true && response.verifyDuty === true)
          {
            this.advanceTableForm.controls["goodForBilling"].setValue(false);
            this.advanceTableForm.controls["verifyDuty"].setValue(false);
          }
          //this.LoadDataForBilling();
        },
        error =>
        {
          this.showSpinner = false;
          this.showNotification(
            'snackbar-danger',
            'Operation Failed.....!!!',
            'bottom',
            'center'
          ); 
          //this.saveDisabled = true;
        }
      )
    
  }
      

  //---------Calculate Bill------------------------
  public CalculateBill()
  {
    this.clossingOneService.calculateBill(this.DutySlipID)  
    .subscribe(
      response => 
      {
        this.Message = response.message;
        this.dutyStatusChanged.emit({
        verifyDuty: this.advanceTableForm.value.verifyDuty,
        goodForBilling: this.advanceTableForm.value.goodForBilling,
        message: this.Message
      });
        this.showNotification(
          'snackbar-success',
          'Duty Calculated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
      },
      error =>
      {
        const errorMessage = error || 'Operation Failed.....!!!';
        Swal.fire({
          title: errorMessage,
          icon: 'error'
        }).then(() => {
            this.advanceTableForm.patchValue({ verifyDuty: true });
            this.advanceTableForm.patchValue({ goodForBilling: false });
            this.onGFBChange({ checked: false });
            this.saveDisabled = true;
          });
      })  
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['disputeAdvanceTable']) {

    // ✅ Check if any dispute has approvalStatus === false
    const hasUnapprovedDispute = this.disputeAdvanceTable?.some(d => d.approvalStatus === false);

    if (hasUnapprovedDispute) {
      // ✅ Uncheck fields if any unapproved dispute is found
      this.advanceTableForm.patchValue({
        verifyDuty: false,
        goodForBilling: false
      });
    }
  }
}
 GetClosingData()
  {
    this.clossingOneService.GetClosingData(this.advanceTableClosingOne.closingDutySlipModel.dutySlipID).subscribe(
      data =>
      {
        this.advanceTableClosingOne = data;
      }
    );
  }
  
onChange() {
  this.dutyStatusChanged.emit({
    verifyDuty: this.advanceTableForm.value.verifyDuty,
    goodForBilling: this.advanceTableForm.value.goodForBilling,
    message: this.Message
  });
}

 public PostDataGPS() 
    {
      this.dutySlipForBillingService.PostDataGPS(this.advanceTableClosingOne.closingDutySlipModel.dutySlipID,this.RegistrationNumber).subscribe
      (
        data => 
          {
         //this.disputeAdvanceTable = data;
          this.showNotification(
            'snackbar-success',
            'GPS Data Created...!!!',
            'bottom',
            'center'
          ); 
          this.GetClosingData();
          this.InitGPS();       
        },
        error =>
        {
          this.showNotification(
            'snackbar-danger',
            'Operation Failed.....!!!',
            'bottom',
            'center'
          ); 
        }  
      // (error: HttpErrorResponse) => { this.disputeAdvanceTable = null;}
      );
    }
  

}






