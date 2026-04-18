// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ClosingDetailShowService } from './closingDetailShow.service';
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



import { ActivatedRoute } from '@angular/router';
import { ClosingDetailShowModel } from './closingDetailShow.model';
@Component({
  standalone: false,
  selector: 'app-closingDetailShow',
  templateUrl: './closingDetailShow.component.html',
  styleUrls: ['./closingDetailShow.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ClosingDetailShowComponent implements OnInit {	
  @Input() ReservationID;
  //ReservationID: any;
  CustomerGroupID: any;
  advanceTableForm:FormGroup;

  advanceTable: ClosingDetailShowModel | null;
  CustomerID: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public closingDetailShowService: ClosingDetailShowService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    public route:ActivatedRoute,
   
  ) 
  {
   this.advanceTableForm = this.createContactForm();
  }
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  
  ngOnInit() {
    this.GetLocationOut();
    // this.GetLocationIn();
    // this.GetDrop();
    // this.GetPickUp();
    };
   

  public GetLocationOut() 
  {
     this.closingDetailShowService.LocationOut(this.ReservationID).subscribe
     (
       (data: ClosingDetailShowModel)=>   
       {
         this.advanceTable = data;
         this.advanceTableForm.patchValue({locationOutDate:this.advanceTable[0].locationOutDate});
         this.advanceTableForm.patchValue({pickUpDate:this.advanceTable[0].pickUpDate});
         this.advanceTableForm.patchValue({dropOffDate:this.advanceTable[0].dropOffDate});
         this.advanceTableForm.patchValue({locationInDate:this.advanceTable[0].locationInDate});

         this.advanceTableForm.patchValue({locationOutTime:this.advanceTable[0].locationOutTime});
         this.advanceTableForm.patchValue({pickUpTime:this.advanceTable[0].pickUpTime});
         this.advanceTableForm.patchValue({dropOffTime:this.advanceTable[0].dropOffTime});
         this.advanceTableForm.patchValue({locationInTime:this.advanceTable[0].locationInTime});

         this.advanceTableForm.patchValue({locationOutKM:this.advanceTable[0].locationOutKM});
         this.advanceTableForm.patchValue({pickUpKM:this.advanceTable[0].pickUpKM});
         this.advanceTableForm.patchValue({dropOffKM:this.advanceTable[0].dropOffKM});
         this.advanceTableForm.patchValue({locationInKM:this.advanceTable[0].locationInKM});

         this.advanceTableForm.patchValue({locationOutEntryMethod:this.advanceTable[0].locationOutEntryMethod});
         this.advanceTableForm.patchValue({pickupEntryMethod:this.advanceTable[0].pickupEntryMethod});
         this.advanceTableForm.patchValue({dropOffEntryMethod:this.advanceTable[0].dropOffEntryMethod});
         this.advanceTableForm.patchValue({locationInEntryMethod:this.advanceTable[0].locationInEntryMethod});

        //  console.log(this.advanceTable)      
       },
       (error: HttpErrorResponse) => { this.advanceTable = null;}
     );
  }

  createContactForm(): FormGroup 
    {
      return this.fb.group(
      {
        locationInKM: [''],
        locationInEntryMethod: [''],
        locationInDate: [''],
        locationInTime: [''],
  
        locationOutKM: [''],
        locationOutEntryMethod: [''],
        locationOutDate: [''],
        locationOutTime: [''],
  
        dropOffKM: [''],
        dropOffDate: [''],
        dropOffTime: [''],
        dropOffEntryMethod: [''],
  
        pickUpKM: [''],
        pickUpDate: [''],
        pickUpTime: [''],
        pickupEntryMethod: ['']
        
      });
    } 

  // public GetLocationIn() 
  // {
  //    this.closingDetailShowService.LocationIn(this.ReservationID).subscribe
  //    (
  //      (data: ClosingDetailShowModel)=>   
  //      {
  //        this.advanceTable = data;
  //        console.log(this.advanceTable)      
  //      },
  //      (error: HttpErrorResponse) => { this.advanceTable = null;}
  //    );
  // }

  // public GetPickUp() 
  // {
  //    this.closingDetailShowService.PickUp(this.ReservationID).subscribe
  //    (
  //      (data: ClosingDetailShowModel)=>   
  //      {
  //        this.advanceTable = data;
  //        console.log(this.advanceTable)      
  //      },
  //      (error: HttpErrorResponse) => { this.advanceTable = null;}
  //    );
  // }

  // public GetDrop() 
  // {
  //    this.closingDetailShowService.Drop(this.ReservationID).subscribe
  //    (
  //      (data: ClosingDetailShowModel)=>   
  //      {
  //        this.advanceTable = data;
  //        console.log(this.advanceTable)      
  //      },
  //      (error: HttpErrorResponse) => { this.advanceTable = null;}
  //    );
  // }
  
}


