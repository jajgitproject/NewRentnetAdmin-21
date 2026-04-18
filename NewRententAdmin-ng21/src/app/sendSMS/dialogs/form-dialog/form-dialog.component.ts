// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { SendSMSService } from '../../sendSMS.service';
import { CustomerConfigurationMessaging, SendSMS } from '../../sendSMS.model';
import { PassengerMobileComponent } from '../passenger-mobile/passenger-mobile.component';
import { PassengerEmailComponent } from '../passenger-email/passenger-email.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddPeopleComponent } from '../add-people/add-people.component';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  displayedColumns: string[] = ['name','mobileno','reachedSMSToBooker','sendSMSWhatsApp','type','action'];
  dataSource: any;
  permissionData:CustomerConfigurationMessaging[] | null;
  showError: string;
  action: string;
  @ViewChild(MatTable) table: MatTable<any>;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SendSMS;
  ReservationID: any;
  vehicle: any;
  pickupDate:string;
  registrationNumber: any;
  customerPersonName: any;
  city: any;
  pickupTime: string;
  customerDetails: any;
  newRecords: [];
  newRecord: [];
  primaryMobile: any;
  primaryEmail: any;
  sortingData: number;
  customerPersonDetails = [];
  sortType: string;
  SearchSendSMS: string;
  showNoRecordsFoundMessage: boolean = false;
  SearchActivationStatus : boolean=true;
  PageNumber: number;
  constructor(
public dialog: MatDialog,
public sendSMSService: SendSMSService,
private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SendSMSService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        // if (this.action === 'edit') 
        // {
        //   this.dialogTitle ='SendSMS';       
        //   this.advanceTable = data.advanceTable;
        // } else 
        // {
        //   this.dialogTitle = 'SendSMS';
        //   this.advanceTable = new SendSMS({});
      
        // }
        this.advanceTableForm = this.createContactForm();

        this.ReservationID = data.reservationID;
        console.log(this.ReservationID)
        this.vehicle = data.vehicle;
        this.pickupDate =data.pickupDate;
        this.pickupTime =data.pickupTime
        console.log(this.vehicle)
        this.registrationNumber = data.registrationNumber;
        this.customerPersonName =data.customerPersonName;
        this.city=data.city;
        console.log(this.registrationNumber)
        this.customerDetails = data?.item?.customerPerson;
        this.primaryMobile =data.primaryMobile;
       
        this.primaryEmail=data.primaryEmail;
        console.log(this.primaryEmail)
        this.dataSource = data?.item?.passengerDetails;
        console.log(this.permissionData)
      this.customerPersonDetails.push(data?.item?.customerPerson);

  }
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
   this.loadData();
    
  }
  public loadData() 
   {
      this._generalService.GetPermission(this.ReservationID).subscribe
      (
        data =>   
        {
          this.permissionData = data;
          console.log(this.permissionData)

        },
        (error: HttpErrorResponse) => { this.permissionData = null;}
      );
  }
  
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }
  openMobile(){
    const dialogRef = this.dialog.open(AddPeopleComponent, 
      {
        width: '400px',
        data: 
          {
            customerMobile: this.customerDetails?.primaryMobile
             //advanceTable:this.advanceTableData[i],
             //action: 'edit',
      
          }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.newRecord = result;
        
      });
  }
saveData() {
  const dialogRef = this.dialog.open(AddPeopleComponent, {
    width: '500px',
    data: {
      ReservationID: this.ReservationID,
    }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    console.log(result);
    result?.forEach(element => {
      console.log(element);
      if (element.customerPersonName.customer) {
        const mobileParts = element.primaryMobile.split('-');
        const nameParts = element.customerPersonName.customer.split('-');
        const bookerParts = element.data && element.data[0]?.reachedSMSToBooker;
        const passengerParts = element.data && element.data[0]?.reachedSMSToPassenger;
        const sendSMSWhatsAppParts = element.data && element.data[0]?.sendSMSWhatsApp;
        const number = mobileParts[0];
        const name = nameParts[1];
        this.permissionData.push({
          primaryMobile: '91-' + number, customerPersonName: name,
          reachedSMSToBooker: bookerParts,
          reachedSMSToPassenger: passengerParts,
          sendSMSWhatsApp: sendSMSWhatsAppParts,
          type: element.type
        });
      }
      else if (element.customerPersonName.employee) {
        const mobileParts = element.primaryMobile.split('-');
        const nameParts = element.customerPersonName.employee.split('-');
        const number = mobileParts[0];
        const name = nameParts[1];
        console.log(name);
        this.permissionData.push({
          primaryMobile:'91-' + number, customerPersonName: name,
          reachedSMSToBooker: false,
          reachedSMSToPassenger: false,
          sendSMSWhatsApp: false,
          type: element.type
        });
      }
      else if (element.customerPersonName.number) {
        const mobileParts = element.primaryMobile.split('-');
        const number = mobileParts[0];
        const name = element.customerPersonName.name;
        this.permissionData.push({
          primaryMobile:'91-' + number,
          customerPersonName: name,
          reachedSMSToBooker: true,
          reachedSMSToPassenger: true,
          sendSMSWhatsApp: true,
          type: element.type
        });
      }
      this.table?.renderRows();
      if (this.permissionData.length > 0) {
        this.showNoRecordsFoundMessage = false;
      }
    });
  });
}

  openEmail(){
    const dialogRef = this.dialog.open(PassengerEmailComponent, 
      {
        width: '400px',
        data: 
          {
            customerEmail: this.customerDetails?.primaryEmail,
             //advanceTable:this.advanceTableData[i],
             //action: 'edit',
      
          }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.newRecords = result;
      });

  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      mobileno: [this.advanceTable?.customerPerson?.primaryMobile],
      serviceStaffName: [this.advanceTable?.serviceStaffName],
      serviceStaffMobile: [this.advanceTable?.serviceStaffMobile],
      reasonToResend: [this.advanceTable?.reasonToResend],
    });
    
  }

  deleteRecord(row: any) {
    const recordIndex = this.permissionData.findIndex((object) => object.primaryMobile === row.primaryMobile);
    this.permissionData.splice(recordIndex,1);
    this.table.renderRows();
    if (this.permissionData.length === 0) {
      this.showNoRecordsFoundMessage = true; 
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    //console.log(this.advanceTableForm.value);
  }
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
   
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('SendSMSCreate:SendSMSView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('SendSMSAll:SendSMSView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
   
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('SendSMSUpdate:SendSMSView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('SendSMSAll:SendSMSView:Failure');//To Send Updates  
    }
  )
  }
  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
}
 


