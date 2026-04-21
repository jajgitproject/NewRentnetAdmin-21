// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { OtherDetailsService } from '../../otherDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { OtherDetails} from '../../otherDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationSourceDropDown } from 'src/app/reservationSource/reservationSourceDropDown.model';

@Component({
  standalone: false,
  // The embedded OtherDetailsComponent already owns the `app-otherDetails`
  // selector. Keeping the same selector here triggered Angular's NG0300
  // (multiple components match node with tagname app-otherDetails), which
  // crashed NewFormComponent's template at `<app-otherDetails>` and left the
  // whole /newForm page blank.
  selector: 'app-otherDetails-dialog',
  templateUrl: './otherDetails.component.html',
  styleUrls: ['./otherDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class OtherDetailsDialogComponent 
{
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: OtherDetails;
  employeesID: any;
  reservationDiscountDetailsByEmployeesID: any;
  ReservationID: any;
  reservationSourceID: any;

  constructor(
  public dialogRef: MatDialogRef<OtherDetailsDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: OtherDetailsService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        debugger;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Other Details';       
          this.dialogTitle ='Other Details';
          this.advanceTable = data.advanceTable[0];
          // this.advanceTable.discountApprovedByEmployee = data.advanceTable.firstName +" "+ data.advanceTable.lastName;
           this.ImagePath = this.advanceTable.attachment;
           this.uploadedByName();
        } else 
        {
          //this.dialogTitle = 'Create Other Details';
          this.dialogTitle = 'Other Details';
          this.advanceTable = new OtherDetails({});
          //this.advanceTable.activationStatus="Active";
          this.ReservationID = data.reservationID;
        }
        this.status=data?.status?.status || data?.status || data;
        // if(this.status!='Changes allow'){
        //   this.buttonDisabled=true;
        // }
             if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}

        this.advanceTableForm = this.createContactForm();
  }
  public ReservationSourceList?:ReservationSourceDropDown[]=[];
  
  filteredReservationSourceOptions: Observable<ReservationSourceDropDown[]>;
  searchReservationSource: FormControl = new FormControl();
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]>;
  public ngOnInit(): void
  {
   this.InitReservationSource(); 
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
  
      reservationID: [this.advanceTable.reservationID],  
      ticketNumber: [this.advanceTable.ticketNumber],
      attachment: [this.advanceTable.attachment],
      emailLink: [this.advanceTable.emailLink],
      reservationSourceID:[this.advanceTable.reservationSourceID],
      reservationSourceDetail:[this.advanceTable.reservationSourceDetail],
      referenceNumber:[this.advanceTable.referenceNumber],
      bookingEditedBy:[this.advanceTable.bookingEditedBy],
      reservationMode:[this.advanceTable.reservationMode],
      reservationSource:[this.advanceTable.reservationSource],
      
    });
  }

 InitReservationSource(){
    this._generalService.GetReservationSource().subscribe(
      data=>
      {
        this.ReservationSourceList=data;
        this.filteredReservationSourceOptions = this.advanceTableForm.controls['reservationSource'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterReservationSource(value || ''))
        ); 
      });
  }

  private _filterReservationSource(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ReservationSourceList.filter(
      customer => 
      {
        return customer.reservationSource.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getReservationSourceID(reservationSourceID: any) {
    debugger;
    this.reservationSourceID=reservationSourceID;
    this.advanceTableForm.patchValue({reservationSourceID:this.reservationSourceID || this.reservationSourceID});
  }

  uploadedByName(){
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>{
        this.EmployeeList=data;
        this.advanceTableForm.patchValue({bookingEditedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
      }
    );
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    // emppty stuff
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public Post(): void
  {
    debugger;
    this.advanceTableForm.patchValue({reservationID:this.ReservationID});
    this.advanceTableForm.patchValue({discountApprovedByEmployeeID:this.reservationDiscountDetailsByEmployeesID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Other Details Created...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close();
    },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
      }
    )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.advanceTable.reservationID});
    this.advanceTableForm.patchValue({reservationDiscountDetailsByEmployeeID:this.reservationDiscountDetailsByEmployeesID || this.reservationDiscountDetailsByEmployeesID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Other Details Update...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close();
    },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
      }
    )
  
  }
   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public uploadFinished = (event) => {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({ attachment: this.ImagePath })
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


