// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReservationStopDropDown } from '../../reservationStopDropDown.model';
import { CustomerPersonDetailsDropDown } from '../../customerPersonDetailsDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationPassenger } from '../../passengerDetails.model';
import { PassengerDetailsService } from '../../passengerDetails.service';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogRPComponent implements OnInit
{
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  public ReservationStopList?: ReservationStopDropDown[] = [];
  filteredOptions: Observable<ReservationStopDropDown[]>;

  public ReservationDropOffStopList?: ReservationStopDropDown[] = [];
  filteredDropOffOptions: Observable<ReservationStopDropDown[]>;

  public PassengerList?: CustomerPersonDropDown[] = [];
  filteredPassengerOptions: Observable<CustomerPersonDropDown[]>;
  
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ReservationPassenger;
  pickupID: any;
  dropOffID: any;
  passengerID: any;
  reservationID: any;
  customerGroupID: any;
  reservationPickupStop: any;
  passengerDetailsData: any;
  viewDetails = false;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  constructor(
  public dialogRef: MatDialogRef<FormDialogRPComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PassengerDetailsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Passenger';       
          this.dialogTitle ='Passenger ';
          this.advanceTable=data.advanceTable;
          this.advanceTable.passengerEmployee=this.advanceTable.customerPersonName+"-"+this.advanceTable.gender+"-"+
          this.advanceTable.importance+"-"+this.advanceTable.primaryMobile+"-"+this.advanceTable.customerDepartment+"-"+
          this.advanceTable.customerDesignation+"-"+this.advanceTable.customerName; 
          this.advanceTable.reservationPickupStop=this.advanceTable.pickupAddress;
          this.advanceTable.reservationDropoffStop=this.advanceTable.dropOffAddress;
          
          this.advanceTable.activationStatus=true;
        } else 
        {
          this.dialogTitle = 'Passenger';
          this.advanceTable = new ReservationPassenger({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.reservationID=data.reservationID;
        this.customerGroupID=data.customerGroupID;
        this.status=data?.status?.status || data?.status || data;
        // if(this.status!='Changes allow'){
        //   this.buttonDisabled=true;
        // }
            if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}

        this.viewDetails = data.view;
        this.advanceTableService.getTableData(this.reservationID, this.SearchActivationStatus, this.PageNumber).subscribe
        (
          (data: any)=>   
          {
            this.passengerDetailsData = data;
           
          },
          (error: HttpErrorResponse) => { this.advanceTable = null;}
        );
  }

  ngOnInit()
  { 
    this.InitPassenger();
    this.InitPickupStop();
    this.InitDropOffStop();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationPassengerID: [this.advanceTable.reservationPassengerID],
      reservationID: [this.advanceTable.reservationID],
      passengerEmployeeID: [this.advanceTable.passengerEmployeeID],
      passengerEmployee: [this.advanceTable.passengerEmployee],
      isPrimaryPassenger: [this.advanceTable.isPrimaryPassenger],
      reservationPickupStopID: [this.advanceTable.reservationPickupStopID],
      reservationPickupStop:[this.advanceTable.reservationPickupStop],
      reservationDropoffStopID: [this.advanceTable.reservationDropoffStopID],
      reservationDropoffStop: [this.advanceTable.reservationDropoffStop],
      procCalledFrom: [this.advanceTable.procCalledFrom],
      activationStatus: [this.advanceTable.activationStatus],
      customerPersonName: [this.advanceTable.customerPersonName],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

showNotification(colorName, text, placementFrom, placementAlign) {
  this.snackBar.open(text, '', {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName
  });
}

  submit() 
  {
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableForm.patchValue({reservationPickupStopID:this.pickupID || this.advanceTable.reservationPickupStopID});
    this.advanceTableForm.patchValue({reservationDropoffStopID:this.dropOffID || this.advanceTable.reservationDropoffStopID || 0});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        
        this.showNotification(
          'snackbar-success',
          'Reservation Passenger Created...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
        this.dialogRef.close();
       //this._generalService.sendUpdate('ReservationPassengerCreate:ReservationPassengerView:Success');//To Send Updates  
    
  },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=true;
       //this._generalService.sendUpdate('ReservationPassengerAll:ReservationPassengerView:Failure');//To Send Updates  
    }
  )
  }

  public Put(): void
  {
    
    this.advanceTableForm.patchValue({reservationPassengerID:this.advanceTable.reservationPassengerID});
    this.advanceTableForm.patchValue({reservationID:this.advanceTable.reservationID});
    this.advanceTableForm.patchValue({procCalledFrom:"ReservationDetails"});
    this.advanceTableForm.patchValue({isPrimaryPassenger:false});
    this.advanceTableForm.patchValue({reservationPickupStopID:this.pickupID || this.advanceTable.reservationPickupStopID});
    this.advanceTableForm.patchValue({reservationDropoffStopID:this.dropOffID || this.advanceTable.reservationDropoffStopID || 0});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        
        this.showNotification(
          'snackbar-success',
          'Reservation Passenger Updated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
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
      this.saveDisabled=true;
     //this._generalService.sendUpdate('PaymentCycleAll:PaymentCycleView:Failure');//To Send Updates  
    }
  )
  }

  public confirmAdd(): void 
  {
    this.saveDisabled=false;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }

  InitPickupStop(){
    this._generalService.getPickupStop(this.reservationID).subscribe(
      data=>
      {
        this.ReservationStopList=data;
        this.advanceTableForm.controls['reservationPickupStop'].setValidators([Validators.required,this.PickupStopValidator(this.ReservationStopList)]);
        this.advanceTableForm.controls['reservationPickupStop'].updateValueAndValidity();
        this.filteredOptions = this.advanceTableForm.controls['reservationPickupStop'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ReservationStopList.filter(
      customer => 
      {
        return customer.reservationStopAddress.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  PickupStopValidator(ReservationStopList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = ReservationStopList.some(data => ((data.reservationStopAddress).toLowerCase()) === value);
        return match ? null : { reservationPickupStopInvalid: true };
      };
    }
  
  onPickupStopSelected(selectedStateName: string) {
    
    const selectedState = this.ReservationStopList.find(
      data => data.reservationStopAddress === selectedStateName
    );
  
    if (selectedState) {
      this.getPickupStopID(selectedState.reservationStopID);
    }
  }

  getPickupStopID(pickupStopID:any)
  {
    this.pickupID=pickupStopID;
    //this.advanceTableForm.patchValue({reservationPickupStopID:this.pickupID})
  }

  InitDropOffStop(){
    this._generalService.getPickupStop(this.reservationID).subscribe(
      data=>
      {
        this.ReservationDropOffStopList=data;
        this.advanceTableForm.controls['reservationDropoffStop'].setValidators([this.DropOffStopValidator(this.ReservationDropOffStopList)]);
        this.filteredDropOffOptions = this.advanceTableForm.controls['reservationDropoffStop'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffStop(value || ''))
        ); 
      });
  }

  private _filterDropOffStop(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ReservationDropOffStopList.filter(
      customer => 
      {
        return customer.reservationStopAddress.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  DropOffStopValidator(ReservationDropOffStopList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
          return null; // No value to validate, return null (no error)
        }
        const value = control.value?.toLowerCase();
        const match = ReservationDropOffStopList.some(data => (data.reservationStopAddress).toLowerCase() === value);
        return match ? null : { reservationDropoffStopInvalid: true };
      };
    }

  onDropOffStopSelected(selectedStateName: string) {
    
    const selectedState = this.ReservationDropOffStopList.find(
      data => data.reservationStopAddress === selectedStateName
    );
  
    if (selectedState) {
      this.getDropOffStopID(selectedState.reservationStopID);
    }
  }
  
  getDropOffStopID(dropOffStopID:any)
  {
    this.dropOffID=dropOffStopID;
    //this.advanceTableForm.patchValue({reservationDropoffStopID:this.dropOffID})
  }

  InitPassenger(){
    this._generalService.GetCPForPassenger(this.customerGroupID).subscribe(
      data=>
      {
        this.PassengerList=data;
        this.advanceTableForm.controls['passengerEmployee'].setValidators([Validators.required,this.PassengerEmployeeValidator(this.PassengerList)]);
        this.advanceTableForm.controls['passengerEmployee'].updateValueAndValidity();
        this.filteredPassengerOptions = this.advanceTableForm.controls['passengerEmployee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPassenger(value || ''))
        ); 
      });
  }

  private _filterPassenger(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PassengerList.filter(
      customer => 
      {
        return customer.customerPersonName.toLowerCase().includes(filterValue);
      }
    );
  }

  PassengerEmployeeValidator(PassengerList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = PassengerList.some(data => ((data.customerPersonName + '-' + data.gender + '-' + data.importance + '-' + data.phone + '-' + data.customerDepartment + '-' + data.customerDesignation + '-' + data.customerName).toLowerCase()) === value);
        return match ? null : { passengerEmployeeInvalid: true };
      };
    }
  
  onPassengerSelected(selectedStateName: string) {
    
    const selectedState = this.PassengerList.find(
      data => data.customerPersonName +'-'+
      data.gender +'-'+
      data.importance +'-'+
      data.phone +'-'+
      data.customerDepartment +'-'+
      data.customerDesignation +'-'+
       data.customerName === selectedStateName
    );
  
    if (selectedState) {
      this.getPassengerID(selectedState.customerPersonID);
    }
  }

  getPassengerID(passengerID:any)
  {
    this.passengerID=passengerID;
    this.advanceTableForm.patchValue({passengerEmployeeID:this.passengerID})
  }
}


