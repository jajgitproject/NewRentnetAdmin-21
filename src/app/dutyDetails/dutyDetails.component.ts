// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DutyDetailsService } from './dutyDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DutyDetails } from './dutyDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormDialogAddPassengersComponent } from '../addPassengers/dialogs/form-dialog/form-dialog.component';
import { FormDialogStopsPopupComponent } from '../stopsPopup/dialogs/form-dialog/form-dialog.component';
//import { FormDialogAddStopComponent } from '../addStop/dialogs/form-dialog/form-dialog.component';
import { FormDialogPickupDetailsComponent } from '../pickupDetails/dialogs/form-dialog/form-dialog.component';
import { FormDialogDropOffDetailsComponent } from '../dropOffDetails/dialogs/form-dialog/form-dialog.component';
import { FormDialogAddStopComponent } from '../addStop/dialogs/form-dialog/form-dialog.component';

@Component({
  standalone: false,
  selector: 'app-dutyDetails',
  templateUrl: './dutyDetails.component.html',
  styleUrls: ['./dutyDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyDetailsComponent implements OnInit {
  advanceTableForm: FormGroup;
  advanceTable: DutyDetails | null;
  
  passenger:string='Amit # 99908333747 - amit@hcl.com - HCL Noida Sector 16	';
  dutyType:string='Local Trip';
  pacakge:string='Half Day';
  car:string='Fortuner';
  city:string='Modinagar';
  pickupAddress:string='K837, Shastri Nagar';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyDetailsService: DutyDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.advanceTable = new DutyDetails({});
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.SubscribeUpdateService();
  }
  submit() 
  {
    // emppty stuff
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
  addStop()
  {
    const dialogRef = this.dialog.open(FormDialogAddStopComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  pickupDetails()
  {
    const dialogRef = this.dialog.open(FormDialogPickupDetailsComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }
  dropOffDetails()
  {
    const dialogRef = this.dialog.open(FormDialogDropOffDetailsComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  addStops()
  {
    const dialogRef = this.dialog.open(FormDialogStopsPopupComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      // customerSpecificFieldsID: [this.advanceTable.customerSpecificFieldsID],
      // field1: [this.advanceTable.field1],
      // field2: [this.advanceTable.field2],
      // field3: [this.advanceTable.field3],
      // field4: [this.advanceTable.field4]
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
  onContextMenu(event: MouseEvent, item: DutyDetails) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
 
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
          if(this.MessageArray[0]=="DutyDetailsCreate")
          {
            if(this.MessageArray[1]=="DutyDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'DutyDetails Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyDetailsUpdate")
          {
            if(this.MessageArray[1]=="DutyDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'DutyDetails Updated..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyDetailsDelete")
          {
            if(this.MessageArray[1]=="DutyDetailsView")
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
          else if(this.MessageArray[0]=="DutyDetailsAll")
          {
            if(this.MessageArray[1]=="DutyDetailsView")
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
}



