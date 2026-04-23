// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerPersonInventoryRestrictionService } from '../../customerPersonInventoryRestriction.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn,AbstractControl} from '@angular/forms';
import { CustomerPersonInventoryRestriction } from '../../customerPersonInventoryRestriction.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
;
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { RegistrationDropDown } from 'src/app/interstateTaxEntry/registrationDropDown.model';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerPersonInventoryRestriction;
  searchTerm : FormControl = new FormControl();
  inventory : FormControl=new FormControl();
  filteredVehicleOptions:Observable<VehicleDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
   filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
    public RegistrationNumberList?: RegistrationDropDown[] = [];

  image: any;
  fileUploadEl: any;
  customerPersonName: any;
  driverID: any;
  saveDisabled:boolean = true;
  inventoryID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerPersonInventoryRestrictionService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Inventory Restriction for';       
          this.advanceTable = data.advanceTable;
          this.advanceTableForm = this.createContactForm();
          this.advanceTableForm?.controls['registrationNumber'].setValue(this.advanceTable?.registrationNumber);
          this.advanceTableForm?.controls['inventoryID'].setValue(this.advanceTable?.inventoryID);
        } else 
        {
          this.dialogTitle = 'Inventory Restriction for';
          this.advanceTable = new CustomerPersonInventoryRestriction({});
          this.advanceTable.activationStatus=true;
          this.advanceTableForm = this.createContactForm();
        }
        
        this.customerPersonName=data.CustomerPersonName;
  }
  public ngOnInit(): void
  {
    this.InitRegistrationNumber();
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
      customerPersonInventoryRestrictionID: [this.advanceTable.customerPersonInventoryRestrictionID],
      customerPersonID: [this.advanceTable.customerPersonID],
      inventoryID: [this.advanceTable.inventoryID],
      inventoryName: [this.advanceTable.inventoryName],
      registrationNumber: [this.advanceTable?.registrationNumber],
      remark: [this.advanceTable.remark],
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
  onNoClick():void{
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({inventoryID:this.inventoryID});
    this.advanceTableForm.patchValue({customerPersonID:this.data.CustomerPersonID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonInventoryRestrictionCreate:CustomerPersonInventoryRestrictionView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerPersonInventoryRestrictionAll:CustomerPersonInventoryRestrictionView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({inventoryID:this.inventoryID || this.advanceTable.inventoryID});
    this.advanceTableForm.patchValue({customerPersonID:this.advanceTable.customerPersonID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonInventoryRestrictionUpdate:CustomerPersonInventoryRestrictionView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerPersonInventoryRestrictionAll:CustomerPersonInventoryRestrictionView:Failure');//To Send Updates 
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

//   if (/[a-zA-Z]/.customerPersonInventoryRestriction(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

//-----------Inventory----------------
InitVehicle(){
  this._generalService.GetVehicleAsInventory().subscribe(
    data=>
    {
      this.VehicleList=data;
      this.advanceTableForm.controls['inventoryName'].setValidators([Validators.required,
        this.inventoryTypeValidator(this.VehicleList)
      ]);
      this.advanceTableForm.controls['inventoryName'].updateValueAndValidity();

      this.filteredVehicleOptions = this.advanceTableForm.controls['inventoryName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
      ); 
    });
}

private _filterVehicle(value: string): any {
  const filterValue = value.toLowerCase();
  return this.VehicleList.filter(
    customer => 
    {
      return customer.vehicle.toLowerCase().includes(filterValue);
    }
  );
}

onInventorySelected(selectedInventory: string)
{
  const InventoryName = this.VehicleList.find(
    data => data.vehicle === selectedInventory
  );
  if (selectedInventory) 
  {
    this.getvehicleID(InventoryName.vehicleID);
  }
}

getvehicleID(inventoryID: any) {
  this.inventoryID=inventoryID;
  this.advanceTableForm.patchValue({inventoryID:this.inventoryID});
}

inventoryTypeValidator(VehicleList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = VehicleList.some(group => group.vehicle.toLowerCase() === value);
    return match ? null : { inventoryTypeInvalid: true };
  };
}

InitRegistrationNumber(){
  this._generalService.GetRegistrationForDropDown().subscribe(
    data=>
    {
      this.RegistrationNumberList=data;
      this.filteredRegistrationNumberOptions = this.advanceTableForm.controls['registrationNumber'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterRN(value || ''))
      ); 
    });
}

private _filterRN(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 3)
     {
        return [];   
      }
  return this.RegistrationNumberList.filter(
    customer => 
    {
      return customer.registrationNumber.toLowerCase().includes(filterValue);
    });
}
OnRegNoSelect(selectedRegNo: string)
{
const RegNoName = this.RegistrationNumberList.find(
  data => data.registrationNumber === selectedRegNo
);
if (selectedRegNo) 
{
  this.getInventoryID(RegNoName.inventoryID);
}
}

getInventoryID(inventoryID: any,) {
  this.inventoryID=inventoryID;
  this.advanceTableForm.patchValue({inventoryID:this.inventoryID});
 
}

}


