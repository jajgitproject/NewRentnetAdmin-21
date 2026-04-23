// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { VehicleInterStateTaxService } from '../../vehicleInterStateTax.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { VehicleInterStateTax } from '../../vehicleInterStateTax.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { VehicleInterStateTaxDropDown } from '../../vehicleInterStateTaxDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  advanceTable: VehicleInterStateTax;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';

  image: any;
  fileUploadEl: any;
  InventoryID: any;
  RegistrationNumber: any;

  public StateList?: StateDropDown[] = [];
  filteredStateOptions: Observable<StateDropDown[]>;

  public InventoryList?: RegistrationDropDown[] = [];
  filteredRegistrationOptions: Observable<RegistrationDropDown[]>;

  interStateTaxStateID: any;
  redirectingFrom: any;
  StateID: any;
  State: any;
  InventoryIDForMaster: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: VehicleInterStateTaxService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.redirectingFrom=data.RedirectingFrom;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Interstate Tax';       
          this.advanceTable = data.advanceTable;
          this.ImagePath=this.advanceTable.interStateTaxImage;
        } else 
        {
          this.dialogTitle = 'Interstate Tax';
          this.advanceTable = new VehicleInterStateTax({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        if(this.redirectingFrom==='Inventory')
        {
          this.InventoryID=data.InventoryID;
          this.RegistrationNumber=data.RegNo;
        }
        if(this.redirectingFrom==='State')
        {
          this.StateID=data.StateID;
          this.State=data.StateName;
        }
        
  }
  public ngOnInit(): void
  {
    if(this.redirectingFrom==='Inventory')
    {
      this.InitState();
    }
    if(this.redirectingFrom==='State')
    {
      this.InitInventory();
    }
    if(!this.redirectingFrom)
    {
      this.InitState();
      this.InitInventory();
    }
        
  }

  // InitState(){
  //   this._generalService.getStateForInterstateTax().subscribe(
  //     data=>{
  //       this.StateList=data;
  //     }
  //   )
  // }

  //--------- State Validator --------
  stateNameValidator(StateList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = StateList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { stateNameInvalid: true };
    };
  }
  
  InitState() {
    this._generalService.getStateForInterstateTax().subscribe(
      data => {
        this.StateList = data;
        this.advanceTableForm.controls['state'].setValidators([Validators.required,
          this.stateNameValidator(this.StateList)]);
        this.advanceTableForm.controls['state'].updateValueAndValidity();
        this.filteredStateOptions = this.advanceTableForm.controls["state"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );
      },
      error => {}
    );
  }
 private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    return this.StateList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  getTitles(interStateTaxStateID: any) {
    this.interStateTaxStateID=interStateTaxStateID;
  }

  InitInventory() {
    this._generalService.GetRegistrationForDropDown().subscribe(
      data => {
        this.InventoryList = data;
        this.filteredRegistrationOptions = this.advanceTableForm.controls["registrationNumber"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterInventory(value || ''))
        );
      },
      error => {

      }
    );
  }
 private _filterInventory(value: string): any {
    const filterValue = value.toLowerCase();
    return this.InventoryList.filter(
      customer => 
      {
        return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  getInventoryID(inventoryID: any) {
    this.InventoryID=inventoryID;
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
      inventoryInterStateTaxID: [this.advanceTable.inventoryInterStateTaxID],
      inventoryID:  [this.advanceTable.inventoryID],
      registrationNumber:[this.advanceTable.registrationNumber],
      interStateTaxStartDate: [this.advanceTable.interStateTaxStartDate],
      interStateTaxEndDate: [this.advanceTable.interStateTaxEndDate],
      interStateTaxStateID: [this.advanceTable.interStateTaxStateID],
      state: [this.advanceTable.state],
      interStateTaxAmount: [this.advanceTable.interStateTaxAmount],
      interStateTaxImage: [this.advanceTable.interStateTaxImage],
      activationStatus: [this.advanceTable.activationStatus]
    });
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
    this.dialogRef.close()
  }
  public Post(): void
  {
    if(this.redirectingFrom==='Inventory')
    {
      this.advanceTableForm.patchValue({inventoryID:this.InventoryID});
      this.advanceTableForm.patchValue({interStateTaxStateID:this.interStateTaxStateID});
    }
    if(this.redirectingFrom==='State')
    {
      this.advanceTableForm.patchValue({interStateTaxStateID:this.StateID});
      this.advanceTableForm.patchValue({inventoryID:this.InventoryID});
    }

    if(!this.redirectingFrom)
      {
        this.advanceTableForm.patchValue({inventoryID:this.InventoryID});
        this.advanceTableForm.patchValue({interStateTaxStateID:this.interStateTaxStateID});
      }
    
    
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('VehicleInterStateTaxCreate:VehicleInterStateTaxView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('VehicleInterStateTaxAll:VehicleInterStateTaxView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    if(this.redirectingFrom==='Inventory')
      {
        this.advanceTableForm.patchValue({inventoryID:this.InventoryID || this.advanceTable.inventoryID});
        this.advanceTableForm.patchValue({interStateTaxStateID:this.interStateTaxStateID || this.advanceTable.interStateTaxStateID});
      }
      if(this.redirectingFrom==='State')
      {
        this.advanceTableForm.patchValue({interStateTaxStateID:this.StateID || this.advanceTable.interStateTaxStateID});
        this.advanceTableForm.patchValue({inventoryID:this.InventoryID || this.advanceTable.inventoryID});
      }
      if(!this.redirectingFrom)
      {
        this.advanceTableForm.patchValue({inventoryID:this.InventoryID || this.advanceTable.inventoryID});
        this.advanceTableForm.patchValue({interStateTaxStateID:this.interStateTaxStateID || this.advanceTable.interStateTaxStateID});
      }
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('VehicleInterStateTaxUpdate:VehicleInterStateTaxView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('VehicleInterStateTaxAll:VehicleInterStateTaxView:Failure');//To Send Updates  
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
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({interStateTaxImage:this.ImagePath})
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

//   if (/[a-zA-Z]/.vehicleInterStateTax(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


