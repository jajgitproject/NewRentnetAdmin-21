import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FormDialogComponentCustomerPerson } from 'src/app/customerPerson/dialogs/form-dialog/form-dialog.component';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { GeneralService } from 'src/app/general/general.service';
import Swal from 'sweetalert2';
import { ChangeEntityService } from 'src/app/changeEntity/changeEntity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-validationDialog',
  templateUrl: './validationDialog.component.html',
  styleUrls: ['./validationDialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ValidationFormDialogComponent {

  errors: any[] = [];
  advanceTable: any;
  passengerID: any;
  passengerName: any;
  public BookerList?: CustomerPersonDropDown[] = [];
  public PassengerList?: CustomerPersonDropDown[] = [];
 filteredPassengerOptions: Observable<CustomerPersonDropDown[]> = of([]);
 searchPassenger: FormControl = new FormControl();
 filteredBookerOptions: Observable<CustomerPersonDropDown[]>;
 searchBooker: FormControl = new FormControl();
 bookerID: any;
 advanceTableForm: FormGroup;
 selectedPassengerData: any;
 showPassenger = false;
showBooker = false;
  private readonly customerPersonQuickAddDialog = {
    panelClass: 'role-form-wide-dialog',
    width: '1200px',
    maxWidth: '98vw',
  };
  saveDisabled: boolean = true;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public _generalService:GeneralService,
      private fb: FormBuilder,
      public advanceTableService: ChangeEntityService,
      private snackBar: MatSnackBar,
      private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ValidationFormDialogComponent>
  ) { 
   
    this.errors = data.errors;
   this.advanceTable = {
  ...data.row[0],
  customerID: data.customerID,
  customerGroupID: data.customerGroupID,
  customerGroup: data.customerGroup,
  customerName: data.customerName
};
 console.log('ValidationDialog data:', this.advanceTable);
    this.advanceTableForm = this.createContactForm();
  }
   createContactForm(): FormGroup {
    return this.fb.group(
      {
        customerName: [],
        customerID: [],
        booker: [],
        primaryBookerID: [],
        passenger: [],
        primaryPassengerID: [],

      });
  }

  ngOnInit(): void {

  this.errors = this.data.errors || [];

  this.showPassenger = this.errors.some((x: string) =>
    x.toLowerCase().includes('passenger')
  );

  this.showBooker = this.errors.some((x: string) =>
    x.toLowerCase().includes('booker')
  );

  if (this.showPassenger) {
    this.InitPassenger();
  }

  if (this.showBooker) {
    this.InitBooker();
  }
}

 
 createNewBooker() {
    
   
    const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, {
      ...this.customerPersonQuickAddDialog,
      data: {
        //advanceTable: this.advanceTable,
        action: 'add',
        // forCP: 'CB',
        CustomerGroupID: this.advanceTable.customerGroupID,
        CustomerGroupName: this.advanceTable.customerGroup,
        cutomerID: this.advanceTable.customerID,
        customerName: this.advanceTable.customerName
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.InitBooker();
      this.InitPassenger();
    });
  }
 InitBooker(){
    this._generalService.GetCPForBooker(this.advanceTable.customerGroupID).subscribe(
      data=>
      {
        this.BookerList=data;
        this.advanceTableForm.controls['booker'].setValidators([Validators.required,this.primaryBookerValidator(this.BookerList)]);
        this.advanceTableForm.controls['booker'].updateValueAndValidity();
        this.filteredBookerOptions = this.advanceTableForm.controls['booker'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterBooker(value || ''))
        ); 
           this.cdr.detectChanges();
      });
  }

  private _filterBooker(value: string): any {
 
  const filterValue = value.toLowerCase();
if (!filterValue || filterValue.length < 3) {
    return [];
  }
  return this.BookerList?.filter(customer =>
    customer.customerPersonName.toLowerCase().includes(filterValue) ||
    customer.gender.toLowerCase().includes(filterValue) ||
    customer.importance.toLowerCase().includes(filterValue) ||
    customer.phone.toLowerCase().includes(filterValue)
  );
}
  primaryBookerValidator(BookerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = BookerList.some(option =>
        (option.customerPersonName + '-' + option.gender + '-' + option.importance + '-' + option.phone + '-' + option.customerDepartment + '-' + option.customerDesignation + '-' + option.customerName)?.toLowerCase() === value
      );
      return match ? null : { primaryBookerInvalid: true };
    };
  }


  onBookerSelected(selectedBookerName: string) {
    const selectedBooker = this.BookerList.find(
      data => data.customerPersonName +'-'+              
              data.gender +'-'+
              data.importance +'-'+
              data.phone +'-'+
              data.customerDepartment +'-'+
              data.customerDesignation +'-'+
               data.customerName === selectedBookerName
    );
  
    if (selectedBooker) {
      this.getBookerID(selectedBooker.customerPersonID);
    }
  }
  
  getBookerID(bookerID: any) {
    this.bookerID=bookerID;
    this.advanceTableForm.patchValue({primaryBookerID:this.bookerID});
  }

  //------------ Passenger -----------------
  InitPassenger(){
    this._generalService.GetCPForPassenger(this.advanceTable.customerGroupID).subscribe(
      data=>
      {
        this.PassengerList=data;
        this.advanceTableForm.controls['passenger'].setValidators([Validators.required,this.PassengerValidator(this.PassengerList)]);
        this.advanceTableForm.controls['passenger'].updateValueAndValidity({ emitEvent: false });

        const selectedPassenger = this.PassengerList.find(
          data => data.customerPersonID === this.advanceTableForm.value.primaryPassengerID
        );
        this.selectedPassengerData = selectedPassenger || null;
        
        this.filteredPassengerOptions = this.advanceTableForm.controls['passenger'].valueChanges.pipe(
          startWith(""),
          map(value => {
            const data = this._filterPassenger(value || '');
            return data
          })
        ); 
           this.cdr.detectChanges();
      });
  }

  private _filterPassenger(value: string): any {
  const filterValue = (value || '').toLowerCase();
  if (!filterValue || filterValue.length < 3) {
    return [];
  }
  return this.PassengerList.filter(customer =>
    customer?.customerPersonName?.toLowerCase().includes(filterValue) ||
    customer?.phone?.toLowerCase().includes(filterValue) ||
    customer?.importance?.toLowerCase().includes(filterValue) ||
    customer?.gender?.toLowerCase().includes(filterValue)
  );
}

PassengerValidator(PassengerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PassengerList.some(option =>
        (option.customerPersonName + '-' + option.gender + '-' + option.importance + '-' + option.phone + '-' + option.customerName)?.toLowerCase() === value
      );
      return match ? null : { passengerInvalid: true };
    };
  }

  private buildPassengerDisplay(data: any): string {
    return [
      data?.customerPersonName ?? '',
      data?.gender ?? '',
      data?.importance ?? '',
      data?.phone ?? '',
      data?.customerName ?? ''
    ].join('-');
  }


  onPassengerSelected(selectedPassengerName: string) {
    const selectedPassenger = this.PassengerList.find(
      data => data.customerPersonName +'-'+
              data.gender +'-'+
              data.importance +'-'+
              data.phone +'-'+
               data.customerName === selectedPassengerName
    );
  
    if (selectedPassenger) {
      this.selectedPassengerData = selectedPassenger;
      this.getPassengerID(selectedPassenger.customerPersonID,selectedPassenger.customerPersonName);
    }
  }
  
  getPassengerID(passengerID: any,passengerName:any) {
    this.passengerID=passengerID;
    this.passengerName=passengerName
    this.advanceTableForm.patchValue({primaryPassengerID:this.passengerID});
  }
  personShort()
  {
   
    const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
      {
        ...this.customerPersonQuickAddDialog,
        data: 
          {
            //advanceTable: this.advanceTable,
            action: 'add',
            // forCP:'CP',
            CustomerGroupID:this.advanceTable.customerGroupID,
            CustomerGroupName:this.advanceTable.customerGroup,
            cutomerID: this.advanceTable.customerID,
            customerName: this.advanceTable.customerName
            
          }
      });
      dialogRef.afterClosed().subscribe(res => {
        // received data from dialog-component
        this.InitBooker();
        this.InitPassenger();
      })
    
    }
    
  
 
    public save(): void {
        
       this.advanceTableService.update(this.advanceTable, this.advanceTable.customerID).subscribe(
         {
           next: (response) => {
             debugger
            
             if (response.successMessages?.length) {
               // const formattedMessages = response.successMessages.map((msg: string) => {
               // const parts = msg.replace('Success:', '').trim().split(' ');
               // const reservationNo = parts[0];
               // const dutySlipNo = parts[1];
               // return `ReservationNo: ${reservationNo} , DutySlipNo: ${dutySlipNo}`;
   
               const formattedMessages = [...new Set(
                 response.successMessages.map((msg: string) => {
                   const parts = msg.replace('Success:', '').trim().split(' ');
                   const reservationNo = parts[0];
                   const dutySlipNo = parts[1];
                   return `ReservationNo: ${reservationNo} , DutySlipNo: ${dutySlipNo}`;
                 })
               )];
   
               Swal.fire({
                  icon: 'success',
                 title: 'Entity updated successfully!',
                 html: `<div style="text-align:left;">
                 ${formattedMessages.map((m: string) => `• ${m}`).join('<br>')}
                </div>`,
                 confirmButtonText: 'OK'
               });
             }
   
   
             this.dialogRef.close(true);
             
           },
   
           error: (error) => {
             this.showNotification(
               'snackbar-danger',
               'Operation Failed',
               'bottom',
               'center'
             );
   
             //this.saveDisabled = true;
           },
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

toArray<T>(value: any): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  if (typeof value === 'object') {
    if (Array.isArray(value.data)) {
      return value.data as T[];
    }
    if (Array.isArray(value.result)) {
      return value.result as T[];
    }
    if (Array.isArray(value.items)) {
      return value.items as T[];
    }
  }
  return [];
}
}