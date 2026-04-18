// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerAllowedCarsInCDPService } from '../../customerAllowedCarsInCDP.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerAllowedCarsInCDP } from '../../customerAllowedCarsInCDP.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerAllowedCarsInCDPDropDown } from '../../customerAllowedCarsInCDPDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentCustomerAllowedCarsInCDP 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerAllowedCarsInCDP;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  CustomerGroupID!: number;
  CustomerGroup!: string;
  saveDisabled:boolean=true;
  public CustomerAllowedCarsInCDPList?: CustomerAllowedCarsInCDPDropDown[] = [];

  public VehicleList?: VehicleDropDown[] = [];
    filteredVehicleOptions: Observable<VehicleDropDown[]>;
  image: any;
  fileUploadEl: any;
  someAction: any;
  vehicleID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentCustomerAllowedCarsInCDP>, 
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerAllowedCarsInCDPService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        this.CustomerGroupID= data.customerGroupID;
        this.CustomerGroup =data.customerGroup;
        this.someAction=data.ForCD;
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Allow Car ';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Allow Car';
          this.advanceTable = new CustomerAllowedCarsInCDP({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitVehicle();
    
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      allowedCarsInCDPID: [this.advanceTable.allowedCarsInCDPID],
      customerGroupID: [this.advanceTable.customerGroupID],
      vehicleID: [this.advanceTable.vehicleID],
      vehicle: [this.advanceTable.vehicle],
      activationStatus: [this.advanceTable.activationStatus]
    });
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
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  onNoClick()
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({ customerGroupID:this.data.customerGroupID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAllowedCarsInCDPCreate:CustomerAllowedCarsInCDPView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAllowedCarsInCDPAll:CustomerAllowedCarsInCDPView:Failure');//To Send Updates  
     this.saveDisabled = true;
    }
  )
}
  public Put(): void
  {
    this.advanceTableForm.patchValue({ customerGroupID:this.advanceTable.customerGroupID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAllowedCarsInCDPUpdate:CustomerAllowedCarsInCDPView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAllowedCarsInCDPAll:CustomerAllowedCarsInCDPView:Failure');//To Send Updates  
     this.saveDisabled = true;
    }
  )
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
  

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

  
/////////////////for Image Upload ends////////////////////////////


// Only Numbers with Decimals
// keyPressNumbersDecimal(event) {
//   var charCode = (event.which) ? event.which : event.keyCode;
//   if (charCode != 46 && charCode > 31
//     && (charCode < 48 || charCode > 57)) {
//     event.preventDefault();
//     return false;
//   }
//   return true;
// }

// Only AlphaNumeric
// keyPressAlphaNumeric(event) {

//   var inp = String.fromCharCode(event.keyCode);

//   if (/[a-zA-Z]/.customerAllowedCarsInCDP(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }
  //----------- Customer Validation --------------
  vehicleValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(employee => employee.vehicle.toLowerCase() === value);
      return match ? null : { vehicleInvalid: true };
    };
  }

  InitVehicle() {
    this._generalService.GetVehicle().subscribe(
      data => {
        ;
        this.VehicleList = data;
        this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,
        this.vehicleValidator(this.VehicleList)]);
        this.advanceTableForm.controls['vehicle'].updateValueAndValidity();
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        );
        //console.log(this.StateList);
      },
      error => {

      }
    );
  }
  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      customer => {
        return customer.vehicle.toLowerCase().includes(filterValue);
      }
    );
  }
  onVehicleSelected(selectedVehicle: string) {
    const selectedValue = this.VehicleList.find(
      data => data.vehicle === selectedVehicle
    );

    if (selectedValue) {
      this.getvehicleID(selectedValue.vehicleID);
    }
  }
  getvehicleID(vehicleID: any) {
    this.vehicleID=vehicleID;
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID}); 
    // this.initVehicleCategories(vehicleID);
  }
 



}


