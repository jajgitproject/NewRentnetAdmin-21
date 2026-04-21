// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DiscountDetailsService } from '../../discountDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { DiscountDetails} from '../../discountDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { atLeastOneRequired } from './atLeastOneRequired.component';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-discountDetails',
  templateUrl: './discountDetails.component.html',
  styleUrls: ['./discountDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class DiscountDetailsDialogComponent 
{
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DiscountDetails;
  employeesID: any;
  reservationDiscountDetailsByEmployeesID: any;
  ReservationID: any;
  AllotmentID: any;

  constructor(
  public dialogRef: MatDialogRef<DiscountDetailsDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DiscountDetailsService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
        public route:ActivatedRoute,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Reservation Discount';       
          this.advanceTable = data.advanceTable;
          this.advanceTable.discountApprovedByEmployee = data.advanceTable.firstName +" "+ data.advanceTable.lastName;
          this.ImagePath = this.advanceTable.attachment;
      
        } else 
        {
          this.dialogTitle = 'Reservation Discount';
          this.advanceTable = new DiscountDetails({});
          this.advanceTable.activationStatus=true;
          this.ReservationID = data.reservationID;
        }
        this.status = data.verifyDutyStatusAndCacellationStatus || data?.status?.status || data?.status;
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
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]>;
  public ngOnInit(): void
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      const encryptedReservationID = paramsData.reservationID;
      this.AllotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID));
      this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
      
    });
  
    
   this.InitEmployee(); 
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationDiscountID: [this.advanceTable.reservationDiscountID],
       reservationID: [this.ReservationID || 0],
       allotmentID: [this.AllotmentID || 0],
      activationStatus: [this.advanceTable.activationStatus],
      discountPercentage: [this.advanceTable.discountPercentage],
      isAllowedOnPackageRate: [this.advanceTable.isAllowedOnPackageRate || null],
      isAllowedOnExtras: [this.advanceTable.isAllowedOnExtras || null],
      discountApprovedByEmployeeID: [this.advanceTable.discountApprovedByEmployeeID],
      attachment:[this.advanceTable.attachment],
      discountApprovedByEmployee:[this.advanceTable.discountApprovedByEmployee]      
    }, { validator: atLeastOneRequired });
  }
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
        this.advanceTableForm.controls['discountApprovedByEmployee'].setValidators([Validators.required,this.ApprovedByEmployeeValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['discountApprovedByEmployee'].updateValueAndValidity();
        this.filteredCreatedByOptionss = this.advanceTableForm.controls['discountApprovedByEmployee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        );
      });
  }

  ApprovedByEmployeeValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = EmployeeList.some(data => ((data.firstName + ' ' + data.lastName).toLowerCase()) === value );
      return match ? null : { discountApprovedByEmployeeInvalid: true };
      };
    }

  private _filtersearchinstructed(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.EmployeeList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().includes(filterValue);
      }
    );
  }

  OnDisApprovedBySelect(selectedDisApprovedBy: string)
  {
    const DisApprovedByName = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedDisApprovedBy
    );
    if (selectedDisApprovedBy) 
    {
      this.getemployee(DisApprovedByName.employeeID);
    }
  }
  
  getemployee(employeeID: any) 
  {
    this.reservationDiscountDetailsByEmployeesID=employeeID;
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
    if(this.AllotmentID)
    {
 this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    
  }   // this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    this.advanceTableForm.patchValue({discountApprovedByEmployeeID:this.reservationDiscountDetailsByEmployeesID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
      if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
      {
        Swal.fire({
                    title: '',
                    icon: 'warning',
                    html: `<b>Please delete previous record to add new.</b>`,
                    customClass: {container: 'swal2-popup-high-zindex'}
                  })
        this.saveDisabled = true;
      }
      else
      {
        this.showNotification(
          'snackbar-success',
          'Discount Details Created...!!!',
          'bottom',
          'center'
        );
      this.saveDisabled = true;
      this.dialogRef.close();
      }
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Field...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    //this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    this.advanceTableForm.patchValue({discountApprovedByEmployeeID:this.reservationDiscountDetailsByEmployeesID || this.advanceTable.discountApprovedByEmployeeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
     this.showNotification(
        'snackbar-success',
        'Discount Details Update...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
      this.dialogRef.close();
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Opertion Field...!!!',
        'bottom',
        'center'
      ); 
      this.saveDisabled = true;
    }
  )
  }

  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
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
    this.saveDisabled = false;
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


