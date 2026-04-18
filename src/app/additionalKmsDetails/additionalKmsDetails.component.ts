// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AdditionalKmsDetailsService } from './additionalKmsDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdditionalKmsDetails } from './additionalKmsDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDialogComponent } from '../advance/dialogs/advance-dialog/advance-dialog.component';
import { AdditionalDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-additionalKmsDetails',
  templateUrl: './additionalKmsDetails.component.html',
  styleUrls: ['./additionalKmsDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AdditionalKmsDetailsComponent implements OnInit {
  @Input() advanceTableAD:AdditionalKmsDetails |any[] | null;
  @Input() dutySlipID;
    @Input() AllotmentID!: any;
  @Input() customerGroupID;
  @Input() verifyDutyStatusAndCacellationStatus;
  advanceTable: AdditionalKmsDetails | null;
  advanceTableForm: FormGroup;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  passengerID: number;
    showAdditionalKms:boolean = false;
       isEditingKms = false;
       isEditingMinutes = false;
         panelExpanded = false;
DutySlipID: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public additionalKmsDetailsService: AdditionalKmsDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService,
     public route: ActivatedRoute,
  ) {
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  // ngOnInit() {
  //   this.SubscribeUpdateService();
  //   this.loadDataforClosing();
  //   this.loadData();
  // }

   ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      const encryptedDutySlipID = paramsData.dutySlipID;
      this.AllotmentID = (this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID)));
      this.DutySlipID = (this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID)));            
    });
     this.loadDataforClosing();
    this.loadData();

  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  editAdditionalKms(i: any, item: any)
  {
    // console.log(item);
    // console.log(this.advanceTableAD[i]);
    const dialogRef = this.dialog.open(AdditionalDialogComponent, 
      {
        data: {
          advanceTable: item,
          action: 'edit',
          dutySlipID:this.dutySlipID,
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.loadData();
        this.loadDataforClosing();
        if (res) {
          if (res.action === 'edit') {
            this.showNotification(
              'snackbar-success',
              'Additional Kms Details Updated Successfully...!!!',
              'bottom',
              'center'
            );
          }
        }
      });
  }

//   public loadData() 
//   {
//      this.additionalKmsDetailsService.getAdditionalKmsDetails(this.dutySlipID).subscribe
//      (
//        (data: AdditionalKmsDetails)=>   
//        {
//          this.advanceTableAD = data;        
//        },
//        (error: HttpErrorResponse) => { this.advanceTableAD = null;}
//      );
//  }

  submit() 
  {
    // emppty stuff
  }

  refresh()
  {
      this.loadDataforClosing();
    this.loadData();
  }
  
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
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
          if(this.MessageArray[0]=="additionalKmsDetailsCreate")
          {
            if(this.MessageArray[1]=="additionalKmsDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'additionalKmsDetails Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="additionalKmsDetailsUpdate")
          {
            if(this.MessageArray[1]=="additionalKmsDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'additionalKmsDetails Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="additionalKmsDetailsDelete")
          {
            if(this.MessageArray[1]=="additionalKmsDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'additionalKmsDetails Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="additionalKmsDetailsAll")
          {
            if(this.MessageArray[1]=="additionalKmsDetailsView")
            {
              if(this.MessageArray[2]=="Failure")
              {
                this.refresh();
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
                this.refresh();
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

  openAdditional()
{
  const dialogRef = this.dialog.open(AdditionalDialogComponent, 
    {
      data: 
      {
        dutySlipID: this.DutySlipID,
        //action: 'edit',
        record: this.advanceTableAD
      }
    });   
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData();
      this.loadDataforClosing();
    })
}

public loadData() {
  this.showAdditionalKms = false;
  this.additionalKmsDetailsService.getAdditionalKmsDetails(this.DutySlipID).subscribe(
    data => {   
      if (data !== null && data.length > 0) {
        this.advanceTableAD = data;
        this.showAdditionalKms = data.some(d => d.additionalKMs > 0 || d.additionalMinutes > 0);
      } else {
      this.advanceTableAD = null;
        this.showAdditionalKms = false;
      }
    },
    (error: HttpErrorResponse) => { 
      this.advanceTableAD = null;
      this.showAdditionalKms = false;
    }
  );
}

//------AdditionalKm
showAndScrollAdditionalKm() {
  this.showAdditionalKms = true;
  setTimeout(() => {
    const element = document.getElementById('AdditionalKms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

  openAdditionalKms() {
    this.isEditingKms = true;
    this.isEditingMinutes = false;
    this.openAdditionalKMMinutes('additionalKMs');
  }

  openAdditionalMinutes() {
    this.isEditingMinutes = true;
    this.isEditingKms = false;
    this.openAdditionalKMMinutes('additionalMinutes');
  }

  openAdditionalKMMinutes(type: string) {
    const dialogRef = this.dialog.open(AdditionalDialogComponent, {
      data: {
        dutySlipID: this.DutySlipID,
        record: this.advanceTableAD,
        type: type
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.isEditingKms = false;
      this.isEditingMinutes = false;
      this.loadData();
      this.loadDataforClosing();
    });
  }

 scrollToLinkButton() {
    const element = document.getElementById('linkButtonSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
    public loadDataforClosing() 
  {
    const allotmentID = this.AllotmentID;
     this.additionalKmsDetailsService.getAdditionalKmsDetailsForClosing(allotmentID).subscribe
     (
       (data: AdditionalKmsDetails)=>   
       {
        
         this.advanceTableAD = data; 
         //console.log(data);       
       },
       (error: HttpErrorResponse) => { this.advanceTableAD = null;}
     );
 }
   togglePanel(): void {
    this.panelExpanded = !this.panelExpanded;

    // Optional: scroll into view only on expand
    if (this.panelExpanded) {
      setTimeout(() => this.scrollToLinkButton(), 300); // wait for animation
    }
  }

  onPanelOpen(): void {
    // Optional logic on open
  }

  onPanelClose(): void {
    // Optional logic on close
  }

}



